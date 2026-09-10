/*
 * mmxwallet.cpp
 *
 * Standalone command line wallet using the public HTTP(S) RPC.
 */

#include <mmx/ChainParams.hxx>
#include <mmx/ECDSA_Wallet.h>
#include <mmx/KeyFile.hxx>
#include <mmx/Transaction.hxx>
#include <mmx/fixed128.hpp>
#include <mmx/mnemonic.h>
#include <mmx/secp256k1.hpp>
#include <mmx/utils.h>

#include <vnx/vnx.h>

#include <algorithm>
#include <cctype>
#include <cstring>
#include <cstdio>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <limits>
#include <map>
#include <optional>
#include <random>
#include <sstream>
#include <stdexcept>
#include <string>
#include <tuple>
#include <vector>

#ifdef _WIN32
#define MMX_POPEN _popen
#define MMX_PCLOSE _pclose
#else
#include <sys/stat.h>
#include <unistd.h>
#define MMX_POPEN popen
#define MMX_PCLOSE pclose
#endif


namespace {

constexpr uint32_t MAX_NUM_ADDRESSES = 10;

std::string trim(std::string value)
{
	while(!value.empty() && std::isspace(static_cast<unsigned char>(value.back()))) {
		value.pop_back();
	}
	const auto begin = std::find_if(value.begin(), value.end(), [](const char ch) {
		return !std::isspace(static_cast<unsigned char>(ch));
	});
	value.erase(value.begin(), begin);
	return value;
}

std::string shell_quote(const std::string& value)
{
#ifdef _WIN32
	std::string out = "\"";
	for(const auto ch : value) {
		if(ch == '"') {
			out += "\\\"";
		} else if(ch == '%') {
			out += "%%";
		} else {
			out += ch;
		}
	}
	return out + "\"";
#else
	std::string out = "'";
	for(const auto ch : value) {
		if(ch == '\'') {
			out += "'\\''";
		} else {
			out += ch;
		}
	}
	return out + "'";
#endif
}

std::optional<std::filesystem::path> find_curl()
{
	const auto path_env = std::getenv("PATH");
	if(!path_env) {
		return {};
	}
#ifdef _WIN32
	const char separator = ';';
	const std::vector<std::string> names = {"curl.exe", "curl"};
#else
	const char separator = ':';
	const std::vector<std::string> names = {"curl"};
#endif
	std::istringstream stream(path_env);
	std::string directory;
	while(std::getline(stream, directory, separator)) {
		const auto base = directory.empty() ? std::filesystem::path(".") : std::filesystem::path(directory);
		for(const auto& name : names) {
			const auto path = base / name;
			std::error_code error;
			if(!std::filesystem::is_regular_file(path, error)) {
				continue;
			}
#ifndef _WIN32
			if(::access(path.c_str(), X_OK) != 0) {
				continue;
			}
#endif
			const auto absolute = std::filesystem::absolute(path, error);
			return error ? path : absolute;
		}
	}
	return {};
}

class temp_file_t {
public:
	explicit temp_file_t(const std::string& suffix)
	{
		std::random_device random;
		for(size_t attempt = 0; attempt < 100; ++attempt) {
			std::ostringstream name;
			name << "mmxwallet-" << std::hex << random() << random() << suffix;
			path = std::filesystem::temp_directory_path() / name.str();
			if(!std::filesystem::exists(path)) {
				return;
			}
		}
		throw std::runtime_error("failed to allocate temporary file name");
	}

	~temp_file_t()
	{
		std::error_code error;
		std::filesystem::remove(path, error);
	}

	std::filesystem::path path;
};

class rpc_client_t {
public:
	explicit rpc_client_t(std::string url)
	{
		const auto curl = find_curl();
		if(!curl) {
			throw std::runtime_error("curl was not found in PATH; install curl or add it to PATH to use the RPC");
		}
		curl_path = curl->string();

		url = trim(url);
		if(url.find("://") == std::string::npos) {
			url = "https://" + url;
		}
		if(url.rfind("http://", 0) != 0 && url.rfind("https://", 0) != 0) {
			throw std::logic_error("RPC URL needs to use HTTP or HTTPS");
		}
		if(std::any_of(url.begin(), url.end(), [](const char ch) {
			return std::iscntrl(static_cast<unsigned char>(ch));
		})) {
			throw std::logic_error("invalid RPC URL");
		}
		while(!url.empty() && url.back() == '/') {
			url.pop_back();
		}
		base_url = std::move(url);
	}

	vnx::Variant get_json(const std::string& path) const
	{
		return parse_json(request("GET", path, {}));
	}

	vnx::Variant post_json(const std::string& path, const std::string& body) const
	{
		return parse_json(request("POST", path, body));
	}

	void post(const std::string& path, const std::string& body) const
	{
		request("POST", path, body);
	}

private:
	std::string request(const std::string& method, const std::string& path, const std::string& body) const
	{
		if(path.empty() || path.front() != '/') {
			throw std::logic_error("invalid RPC path");
		}
		temp_file_t response_file(".response");
		temp_file_t request_file(".request");

		std::string command = shell_quote(curl_path)
				+ " --silent --show-error --max-time 30 --connect-timeout 10 --max-filesize 16777216 --proto "
				+ shell_quote("=http,https") + " --output " + shell_quote(response_file.path.string())
				+ " --write-out " + shell_quote("%{http_code}");
		if(method == "POST") {
			{
				std::ofstream stream(request_file.path, std::ios::binary | std::ios::trunc);
				if(!stream) {
					throw std::runtime_error("failed to create temporary request file");
				}
				stream << body;
			}
			std::filesystem::permissions(request_file.path,
					std::filesystem::perms::owner_read | std::filesystem::perms::owner_write,
					std::filesystem::perm_options::replace);
			command += " --header " + shell_quote("Content-Type: application/json")
					+ " --data-binary " + shell_quote("@" + request_file.path.string());
		}
		command += " " + shell_quote(base_url + path);

		std::string status_text;
		if(auto pipe = MMX_POPEN(command.c_str(), "r")) {
			char buffer[64];
			while(std::fgets(buffer, sizeof(buffer), pipe)) {
				status_text += buffer;
			}
			const auto exit_code = MMX_PCLOSE(pipe);
			if(exit_code != 0) {
				throw std::runtime_error("RPC request failed: " + base_url);
			}
		} else {
			throw std::runtime_error("failed to execute curl");
		}

		std::ifstream stream(response_file.path, std::ios::binary);
		std::ostringstream response;
		response << stream.rdbuf();
		const auto content = response.str();
		const auto status = std::stoi(trim(status_text));
		if(status < 200 || status >= 300) {
			auto message = trim(content);
			if(message.size() > 500) {
				message.resize(500);
			}
			throw std::runtime_error("RPC returned HTTP " + std::to_string(status)
					+ (message.empty() ? std::string() : ": " + message));
		}
		return content;
	}

	static vnx::Variant parse_json(const std::string& content)
	{
		try {
			return vnx::from_string<vnx::Variant>(content);
		} catch(const std::exception& ex) {
			throw std::runtime_error(std::string("invalid JSON response from RPC: ") + ex.what());
		}
	}

private:
	std::string curl_path;
	std::string base_url;
};

struct currency_balance_t {
	mmx::uint128 amount;
	std::string symbol;
	int32_t decimals = 0;
};

struct remote_state_t {
	uint32_t height = 0;
	std::map<mmx::addr_t, currency_balance_t> totals;
};

struct currency_filter_t {
	std::optional<mmx::addr_t> address;
	std::optional<std::string> symbol;
	bool all = false;
};

struct wallet_entry_t {
	std::filesystem::path path;
	std::string finger_print;
	bool with_passphrase = false;
};

std::filesystem::path get_wallet_directory()
{
	if(const auto path = std::getenv("MMX_HOME")) {
		return path;
	}
	if(const auto path = std::getenv("HOME")) {
		return std::filesystem::path(path) / ".mmx";
	}
	return ".";
}

std::string get_finger_print(const mmx::KeyFile& key)
{
	return key.finger_print ? *key.finger_print : mmx::get_finger_print(key.seed_value, {});
}

bool requires_passphrase(const mmx::KeyFile& key)
{
	return key.finger_print && *key.finger_print != mmx::get_finger_print(key.seed_value, {});
}

std::vector<wallet_entry_t> find_wallets(const std::filesystem::path& directory)
{
	std::vector<wallet_entry_t> result;
	std::error_code error;
	if(!std::filesystem::exists(directory, error)) {
		return result;
	}
	for(const auto& entry : std::filesystem::directory_iterator(directory)) {
		if(!entry.is_regular_file()) {
			continue;
		}
		const auto name = entry.path().filename().string();
		const std::string suffix = ".dat";
		const auto has_prefix = [&](const std::string& prefix) {
			return name.rfind(prefix, 0) == 0 && name.size() > prefix.size() + suffix.size()
					&& name.substr(name.size() - suffix.size()) == suffix;
		};
		if(name != "wallet.dat" && !has_prefix("wallet_") && !has_prefix("mmxwallet_")) {
			continue;
		}
		const auto key = vnx::read_from_file<mmx::KeyFile>(entry.path().string());
		if(!key) {
			throw std::runtime_error("failed to read wallet: " + entry.path().string());
		}
		result.push_back({entry.path(), get_finger_print(*key), requires_passphrase(*key)});
	}
	std::sort(result.begin(), result.end(), [](const auto& left, const auto& right) {
		return left.path.filename().string() < right.path.filename().string();
	});
	return result;
}

std::filesystem::path get_wallet_config_path(const std::filesystem::path& directory)
{
	return directory / "mmxwallet.json";
}

std::optional<std::string> get_active_wallet(const std::filesystem::path& directory)
{
	const auto path = get_wallet_config_path(directory);
	if(!std::filesystem::exists(path)) {
		return {};
	}
	const auto object = vnx::read_config_file(path.string());
	const auto selector = object["active_wallet"].to_string_value();
	return selector.empty() ? std::optional<std::string>() : selector;
}

void set_active_wallet(const std::filesystem::path& directory, const std::string& file_name)
{
	if(std::filesystem::create_directories(directory)) {
		std::filesystem::permissions(directory, std::filesystem::perms::owner_all,
				std::filesystem::perm_options::replace);
	}
	const auto path = get_wallet_config_path(directory);
	auto object = std::filesystem::exists(path) ? vnx::read_config_file(path.string()) : vnx::Object();
	object["active_wallet"] = file_name;
	vnx::write_config_file(path.string(), object);
	std::filesystem::permissions(path, std::filesystem::perms::owner_read | std::filesystem::perms::owner_write,
			std::filesystem::perm_options::replace);
}

std::optional<size_t> parse_wallet_index(const std::string& value)
{
	if(value.empty() || !std::all_of(value.begin(), value.end(), [](const char ch) {
		return std::isdigit(static_cast<unsigned char>(ch));
	})) {
		return {};
	}
	try {
		const auto index = std::stoull(value);
		if(index <= std::numeric_limits<size_t>::max()) {
			return index;
		}
	} catch(...) {
		// Invalid selectors are reported by select_wallet().
	}
	return {};
}

wallet_entry_t select_wallet(const std::vector<wallet_entry_t>& wallets, std::string selector,
		const std::optional<std::string>& active)
{
	if(wallets.empty()) {
		throw std::runtime_error("no wallets found; run 'mmxwallet create' or 'mmxwallet import'");
	}
	if(!selector.empty()) {
		bool explicit_index = false;
		if(selector.front() == '#') {
			explicit_index = true;
			selector.erase(selector.begin());
		}
		if(!explicit_index) {
			const wallet_entry_t* match = nullptr;
			for(const auto& wallet : wallets) {
				if(wallet.finger_print == selector) {
					if(match) {
						throw std::logic_error("wallet fingerprint is ambiguous; select it by index");
					}
					match = &wallet;
				}
			}
			if(match) {
				return *match;
			}
		}
		if(const auto index = parse_wallet_index(selector); index && *index < wallets.size()) {
			return wallets[*index];
		}
		throw std::logic_error("no wallet matches selector: " + selector);
	}
	if(active) {
		for(const auto& wallet : wallets) {
			if(wallet.path.filename() == *active) {
				return wallet;
			}
		}
		const wallet_entry_t* match = nullptr;
		for(const auto& wallet : wallets) {
			if(wallet.finger_print == *active) {
				if(match) {
					throw std::runtime_error("active wallet fingerprint is ambiguous; select it again with 'mmxwallet use'");
				}
				match = &wallet;
			}
		}
		if(match) {
			return *match;
		}
		throw std::runtime_error("active wallet " + *active + " was not found; select another with 'mmxwallet use'");
	}
	if(wallets.size() == 1) {
		return wallets.front();
	}
	throw std::runtime_error("multiple wallets found; select one with 'mmxwallet use' or --wallet");
}

wallet_entry_t select_wallet_by_finger_print(const std::vector<wallet_entry_t>& wallets,
		const std::string& finger_print)
{
	const wallet_entry_t* match = nullptr;
	for(const auto& wallet : wallets) {
		if(wallet.finger_print == finger_print) {
			if(match) {
				throw std::logic_error("wallet fingerprint is ambiguous; select it persistently by index first");
			}
			match = &wallet;
		}
	}
	if(match) {
		return *match;
	}
	throw std::logic_error("no wallet matches fingerprint: " + finger_print);
}

mmx::account_t make_account(const mmx::KeyFile& key, const uint32_t account_index, const uint32_t num_addresses)
{
	mmx::account_t account;
	account.index = account_index;
	account.num_addresses = num_addresses;
	account.with_passphrase = requires_passphrase(key);
	account.finger_print = get_finger_print(key);
	return account;
}

std::shared_ptr<mmx::ECDSA_Wallet> load_wallet(
		const std::filesystem::path& path, const uint32_t account_index, const uint32_t num_addresses,
		std::shared_ptr<const mmx::ChainParams> params)
{
	const auto key = vnx::read_from_file<mmx::KeyFile>(path.string());
	if(!key) {
		throw std::runtime_error("failed to read wallet: " + path.string());
	}
	auto wallet = std::make_shared<mmx::ECDSA_Wallet>(
			key->seed_value, make_account(*key, account_index, num_addresses), params);
	if(requires_passphrase(*key)) {
		wallet->unlock(vnx::input_password("Passphrase: "));
	} else {
		wallet->unlock();
	}
	return wallet;
}

void write_wallet(const std::filesystem::path& path, const mmx::KeyFile& key)
{
	if(std::filesystem::exists(path)) {
		throw std::logic_error("wallet already exists: " + path.string());
	}
	if(!path.parent_path().empty() && std::filesystem::create_directories(path.parent_path())) {
		std::filesystem::permissions(path.parent_path(), std::filesystem::perms::owner_all,
				std::filesystem::perm_options::replace);
	}
	vnx::write_to_file(path.string(), key);
	std::filesystem::permissions(path, std::filesystem::perms::owner_read | std::filesystem::perms::owner_write,
			std::filesystem::perm_options::replace);
}

std::shared_ptr<mmx::ChainParams> fetch_params(const rpc_client_t& rpc)
{
	auto params = mmx::ChainParams::create();
	params->from_object(rpc.get_json("/chain/info").to_object());
	if(params->network.empty()) {
		throw std::runtime_error("RPC returned chain parameters without a network name");
	}
	if(params->decimals < 0 || params->decimals > 18) {
		throw std::runtime_error("RPC returned invalid native currency decimals");
	}
	return params;
}

uint32_t check_rpc_state(const rpc_client_t& rpc, const std::shared_ptr<const mmx::ChainParams>& params)
{
	const auto node_info = rpc.get_json("/node/info").to_object();
	if(!node_info["is_synced"].to<bool>()) {
		throw std::runtime_error("RPC node is not synced");
	}
	if(node_info["name"].to_string_value() != params->network) {
		throw std::runtime_error("RPC network does not match chain parameters");
	}
	return node_info["height"].to<uint32_t>();
}

remote_state_t update_wallet(const rpc_client_t& rpc, mmx::ECDSA_Wallet& wallet,
		const std::shared_ptr<const mmx::ChainParams>& params)
{
	remote_state_t state;
	state.height = check_rpc_state(rpc, params);
	std::map<std::pair<mmx::addr_t, mmx::addr_t>, mmx::uint128> balances;

	for(const auto& address : wallet.get_all_addresses()) {
		const auto result = rpc.get_json("/address?id=" + address.to_string() + "&limit=1000").to_object();
		for(const auto& value : result["balances"].to<std::vector<vnx::Variant>>()) {
			const auto row = value.to_object();
			const mmx::addr_t currency(row["contract"].to_string_value());
			const mmx::uint128 amount(row["amount"].to_string_value());
			const auto decimals = row["decimals"].to<int32_t>();
			const auto symbol = row["symbol"].to_string_value();
			if(decimals < 0 || decimals > 18) {
				throw std::runtime_error("RPC returned invalid currency decimals");
			}
			if(currency == mmx::addr_t() && decimals != params->decimals) {
				throw std::runtime_error("RPC returned inconsistent native currency decimals");
			}
			if(!balances.emplace(std::make_pair(address, currency), amount).second) {
				throw std::runtime_error("RPC returned a duplicate balance");
			}

			auto& total = state.totals[currency];
			if(total.amount && (total.decimals != decimals || total.symbol != symbol)) {
				throw std::runtime_error("RPC returned inconsistent currency metadata");
			}
			total.amount += amount;
			total.symbol = symbol;
			total.decimals = decimals;
		}
	}
	wallet.update_cache(balances, {}, state.height);
	return state;
}

uint64_t make_nonce()
{
	const auto random = mmx::hash_t::secure_random();
	uint64_t nonce = 0;
	std::memcpy(&nonce, random.data(), sizeof(nonce));
	return nonce ? nonce : 1;
}

std::string format_amount(const mmx::uint128& amount, const int32_t decimals)
{
	return mmx::fixed128(amount, decimals).to_string();
}

mmx::addr_t parse_currency(const std::string& value)
{
	if(value == "all") {
		throw std::logic_error("currency 'all' is only valid for balance and history");
	}
	if(value.empty() || value == "MMX") {
		return mmx::addr_t();
	}
	if(value.rfind("mmx1", 0) != 0) {
		throw std::logic_error("sending another currency requires its contract address");
	}
	return mmx::addr_t(value);
}

currency_filter_t parse_currency_filter(const std::string& value)
{
	currency_filter_t filter;
	if(value == "all") {
		filter.all = true;
	} else if(value.empty() || value == "MMX") {
		filter.address = mmx::addr_t();
	} else if(value.rfind("mmx1", 0) == 0) {
		filter.address = mmx::addr_t(value);
	} else {
		filter.symbol = value;
	}
	return filter;
}

void print_balance(const mmx::addr_t& currency, const currency_balance_t& balance)
{
	const auto symbol = balance.symbol.empty() ? currency.to_string() : balance.symbol;
	std::cout << format_amount(balance.amount, balance.decimals) << " " << symbol << " (" << balance.amount << ")";
	if(currency != mmx::addr_t()) {
		std::cout << " [" << currency << "]";
	}
	std::cout << "\n";
}

void print_balances(const remote_state_t& state, const std::string& currency_string)
{
	const auto filter = parse_currency_filter(currency_string);
	if(filter.all) {
		if(state.totals.empty()) {
			std::cout << "0 MMX\n";
		}
		for(const auto& entry : state.totals) {
			print_balance(entry.first, entry.second);
		}
		return;
	}
	if(filter.symbol) {
		size_t num_matches = 0;
		for(const auto& entry : state.totals) {
			if(entry.second.symbol == *filter.symbol) {
				print_balance(entry.first, entry.second);
				++num_matches;
			}
		}
		if(!num_matches) {
			throw std::logic_error("no currencies match symbol: " + *filter.symbol);
		}
		return;
	}
	const auto entry = state.totals.find(*filter.address);
	if(entry == state.totals.end()) {
		std::cout << "0 " << (*filter.address == mmx::addr_t() ? "MMX" : "[" + filter.address->to_string() + "]")
				<< "\n";
	} else {
		print_balance(*filter.address, entry->second);
	}
}

std::string sanitize_text(std::string value)
{
	for(auto& ch : value) {
		const auto byte = static_cast<unsigned char>(ch);
		if(byte < 0x20 || byte == 0x7F) {
			ch = '?';
		}
	}
	return value;
}

std::vector<vnx::Object> fetch_history(const rpc_client_t& rpc, const mmx::ECDSA_Wallet& wallet,
		const currency_filter_t& filter, const uint32_t limit)
{
	std::vector<vnx::Object> result;
	for(const auto& address : wallet.get_all_addresses()) {
		uint32_t until = std::numeric_limits<uint32_t>::max();
		size_t num_matches = 0;
		while(true) {
			const uint32_t request_limit = filter.symbol ? 1000 : limit;
			auto path = "/address/history?id=" + address.to_string() + "&limit=" + std::to_string(request_limit);
			if(filter.address) {
				path += "&currency=" + filter.address->to_string();
			}
			if(until != std::numeric_limits<uint32_t>::max()) {
				path += "&until=" + std::to_string(until);
			}
			const auto values = rpc.get_json(path).to<std::vector<vnx::Variant>>();
			if(values.empty()) {
				break;
			}
			uint32_t min_height = std::numeric_limits<uint32_t>::max();
			for(const auto& value : values) {
				auto row = value.to_object();
				const auto currency = mmx::addr_t(row["contract"].to_string_value());
				if(filter.address && currency != *filter.address) {
					throw std::runtime_error("RPC returned history for the wrong currency");
				}
				min_height = std::min(min_height, row["height"].to<uint32_t>());
				if(filter.symbol && row["symbol"].to_string_value() != *filter.symbol) {
					continue;
				}
				result.push_back(std::move(row));
				++num_matches;
			}
			if(!filter.symbol || num_matches >= limit || values.size() < request_limit || min_height == 0) {
				break;
			}
			until = min_height - 1;
		}
	}
	std::stable_sort(result.begin(), result.end(), [](const vnx::Object& left, const vnx::Object& right) {
		return std::make_tuple(left["is_pending"].to<bool>(), left["height"].to<uint32_t>(),
				left["time_stamp"].to<int64_t>())
				> std::make_tuple(right["is_pending"].to<bool>(), right["height"].to<uint32_t>(),
						right["time_stamp"].to<int64_t>());
	});
	if(result.size() > limit) {
		result.resize(limit);
	}
	return result;
}

void print_history(const std::vector<vnx::Object>& history, const std::shared_ptr<const mmx::ChainParams>& params)
{
	if(history.empty()) {
		std::cout << "No history.\n";
		return;
	}
	for(auto iter = history.rbegin(); iter != history.rend(); ++iter) {
		const auto& row = *iter;
		const auto is_pending = row["is_pending"].to<bool>();
		const auto height = row["height"].to<uint32_t>();
		const auto time_stamp = row["time_stamp"].to<int64_t>();
		const auto type = sanitize_text(row["type"].to_string_value());
		const auto contract = mmx::addr_t(row["contract"].to_string_value());
		const auto address = mmx::addr_t(row["address"].to_string_value());
		mmx::hash_t txid;
		txid.from_string(row["txid"].to_string_value());
		const mmx::uint128 amount(row["amount"].to_string_value());
		const auto decimals = row["decimals"].to<int32_t>();
		if(decimals < 0 || decimals > 18) {
			throw std::runtime_error("RPC returned invalid currency decimals in history");
		}
		if(contract == mmx::addr_t() && decimals != params->decimals) {
			throw std::runtime_error("RPC returned inconsistent native currency decimals in history");
		}
		const auto symbol_value = sanitize_text(row["symbol"].to_string_value());
		const auto symbol = symbol_value.empty() ? contract.to_string() : symbol_value;
		const bool is_outgoing = type == "SPEND" || type == "TXFEE";

		std::cout << (is_pending ? "[pending]" : "[" + std::to_string(height) + "]");
		if(time_stamp > 0) {
			std::cout << " " << vnx::get_date_string_ex("%Y-%m-%d %H:%M:%S", false, time_stamp / 1000);
		}
		std::cout << " " << type << " " << (is_outgoing ? "-" : "+") << " "
				<< format_amount(amount, decimals) << " " << symbol << " (" << amount << ") @ " << address
				<< " TX(" << txid << ")";
		if(!row["memo"].is_null()) {
			std::cout << " Memo(" << vnx::to_string(row["memo"]) << ")";
		}
		std::cout << "\n";
	}
}

bool accept_prompt()
{
	std::cout << "Broadcast transaction? (y/N): ";
	std::string input;
	std::getline(std::cin, input);
	return input == "y" || input == "Y";
}

void print_help()
{
	std::cout
		<< "Usage:\n"
		<< "  mmxwallet create [--file PATH] [--with-passphrase]\n"
		<< "  mmxwallet import [--file PATH] [--with-passphrase]\n"
		<< "  mmxwallet list\n"
		<< "  mmxwallet use <INDEX|FINGERPRINT>\n"
		<< "  mmxwallet mnemonic [--wallet FINGERPRINT] [--file PATH]\n"
		<< "  mmxwallet get mnemonic [--wallet FINGERPRINT] [--file PATH]\n"
		<< "  mmxwallet address [--wallet FINGERPRINT] [--offset N] [--num-addresses N]\n"
		<< "  mmxwallet addresses [--wallet FINGERPRINT] [--num-addresses N]\n"
		<< "  mmxwallet balance [--wallet FINGERPRINT] [--currency ADDRESS|SYMBOL|all] [--num-addresses N] [--rpc URL]\n"
		<< "  mmxwallet history [--wallet FINGERPRINT] [--currency ADDRESS|SYMBOL|all] [--limit N]\n"
		<< "                    [--num-addresses N] [--rpc URL]\n"
		<< "  mmxwallet send [--wallet FINGERPRINT] --target ADDRESS --amount VALUE\n"
		<< "                 [--currency ADDRESS] [--memo TEXT] [--transaction PATH]\n"
		<< "                 [--yes] [--json]\n"
		<< "  mmxwallet broadcast --transaction PATH [--rpc URL] [--json]\n"
		<< "  mmxwallet info [--rpc URL]\n\n"
		<< "Defaults:\n"
		<< "  RPC: rpc.mmx.network\n"
		<< "  Wallet directory: $MMX_HOME or $HOME/.mmx\n";
}

} // anonymous namespace


int main(int argc, char** argv)
{
#ifndef _WIN32
	::umask(0077);
#endif
	mmx::secp256k1_init();

	std::map<std::string, std::string> options;
	options["r"] = "rpc";
	options["f"] = "file";
	options["a"] = "amount";
	options["t"] = "target";
	options["x"] = "currency";
	options["m"] = "memo";
	options["k"] = "offset";
	options["N"] = "num-addresses";
	options["w"] = "wallet";
	options["y"] = "yes";
	options["json"] = "";
	options["rpc"] = "URL";
	options["file"] = "PATH";
	options["amount"] = "VALUE";
	options["target"] = "ADDRESS";
	options["currency"] = "ADDRESS|SYMBOL|all";
	options["memo"] = "TEXT";
	options["offset"] = "N";
	options["limit"] = "N";
	options["num-addresses"] = "N";
	options["wallet"] = "FINGERPRINT";
	options["transaction"] = "PATH";
	options["account"] = "N";
	options["fee-ratio"] = "VALUE";
	options["expire-delta"] = "BLOCKS";

	vnx::write_config("log_level", 2);
	vnx::write_config("rpc", "rpc.mmx.network");
	vnx::init("mmxwallet", argc, argv, options);

	int exit_code = 0;
	try {
		std::string command;
		std::string rpc_url;
		std::string file_name;
		std::string target_string;
		std::string currency_string;
		std::string wallet_selector;
		std::string transaction_file;
		vnx::optional<std::string> memo;
		uint32_t account_index = 0;
		uint32_t num_addresses = 1;
		uint32_t offset = 0;
		uint32_t history_limit = 20;
		double fee_ratio = 1;
		uint32_t expire_delta = 100;
		bool with_passphrase = false;
		bool pre_accept = false;
		bool json_output = false;
		mmx::fixed128 value;

		vnx::read_config("$1", command);
		vnx::read_config("rpc", rpc_url);
		vnx::read_config("file", file_name);
		vnx::read_config("target", target_string);
		vnx::read_config("currency", currency_string);
		vnx::read_config("wallet", wallet_selector);
		vnx::read_config("transaction", transaction_file);
		vnx::read_config("memo", memo);
		vnx::read_config("account", account_index);
		vnx::read_config("num-addresses", num_addresses);
		vnx::read_config("offset", offset);
		vnx::read_config("limit", history_limit);
		vnx::read_config("fee-ratio", fee_ratio);
		vnx::read_config("expire-delta", expire_delta);
		vnx::read_config("with-passphrase", with_passphrase);
		vnx::read_config("yes", pre_accept);
		vnx::read_config("json", json_output);
		const auto have_amount = vnx::read_config("amount", value);

		if(command.empty() || command == "help" || command == "--help") {
			print_help();
		} else if(!num_addresses || num_addresses > MAX_NUM_ADDRESSES) {
			throw std::logic_error("num-addresses needs to be between 1 and " + std::to_string(MAX_NUM_ADDRESSES));
		} else if(command == "history" && (!history_limit || history_limit > 1000)) {
			throw std::logic_error("limit needs to be between 1 and 1000");
		} else {
			const auto wallet_directory = get_wallet_directory();

			if(command == "create" || command == "import") {
				if(!wallet_selector.empty()) {
					throw std::logic_error("--wallet cannot be used when creating or importing a wallet");
				}
				mmx::KeyFile key;
				if(command == "create") {
					key.seed_value = mmx::hash_t::secure_random();
				} else {
					const auto words = trim(vnx::input_password("Mnemonic: "));
					key.seed_value = mmx::mnemonic::words_to_seed(mmx::mnemonic::string_to_words(words));
				}

				vnx::optional<std::string> passphrase;
				if(with_passphrase) {
					passphrase = vnx::input_password("Passphrase: ");
					if(*passphrase != vnx::input_password("Passphrase (again): ")) {
						throw std::logic_error("passphrase mismatch");
					}
					key.finger_print = mmx::get_finger_print(key.seed_value, passphrase);
				}
				const auto finger_print = mmx::get_finger_print(key.seed_value, passphrase);
				const auto wallet_path = file_name.empty()
						? wallet_directory / ("mmxwallet_" + finger_print + ".dat") : std::filesystem::path(file_name);
				if(file_name.empty()) {
					for(const auto& wallet : find_wallets(wallet_directory)) {
						if(wallet.finger_print == finger_print) {
							throw std::logic_error("wallet already exists: " + wallet.path.string());
						}
					}
				}
				auto params = mmx::ChainParams::create();
				params->network = "mainnet";
				mmx::ECDSA_Wallet wallet(key.seed_value, make_account(key, account_index, num_addresses), params);
				wallet.unlock(passphrase ? *passphrase : std::string());
				write_wallet(wallet_path, key);
				if(file_name.empty()) {
					set_active_wallet(wallet_directory, wallet_path.filename().string());
				}
				std::cout << (command == "create" ? "Created" : "Imported") << " wallet: " << wallet_path.string() << "\n";
				std::cout << "Fingerprint: " << finger_print << "\n";
				if(command == "create") {
					std::cout << "Mnemonic: "
							<< mmx::mnemonic::words_to_string(mmx::mnemonic::seed_to_words(key.seed_value)) << "\n";
				}
				std::cout << "Address: " << wallet.get_address(0) << "\n";
			}
			else if(command == "list") {
				if(!file_name.empty() || !wallet_selector.empty()) {
					throw std::logic_error("list does not accept --file or --wallet");
				}
				const auto wallets = find_wallets(wallet_directory);
				const auto active = get_active_wallet(wallet_directory);
				std::string active_file;
				if(active) {
					for(const auto& wallet : wallets) {
						if(wallet.path.filename() == *active) {
							active_file = wallet.path.filename().string();
							break;
						}
					}
					if(active_file.empty()) {
						size_t num_matches = 0;
						std::string match;
						for(const auto& wallet : wallets) {
							if(wallet.finger_print == *active) {
								++num_matches;
								match = wallet.path.filename().string();
							}
						}
						if(num_matches == 1) {
							active_file = std::move(match);
						}
					}
				}
				if(wallets.empty()) {
					std::cout << "No wallets found in " << wallet_directory.string() << "\n";
				}
				for(size_t i = 0; i < wallets.size(); ++i) {
					const bool is_active = active ? wallets[i].path.filename() == active_file : wallets.size() == 1;
					std::cout << (is_active ? "* " : "  ") << "[" << i << "] " << wallets[i].finger_print << "  "
							<< wallets[i].path.filename().string()
							<< (wallets[i].with_passphrase ? "  (passphrase)" : "") << "\n";
				}
			}
			else if(command == "use") {
				if(!file_name.empty() || !wallet_selector.empty()) {
					throw std::logic_error("use takes a positional index or fingerprint");
				}
				std::string positional_selector;
				vnx::read_config("$2", positional_selector);
				if(positional_selector.empty()) {
					throw std::logic_error("usage: mmxwallet use <INDEX|FINGERPRINT>");
				}
				const auto wallet = select_wallet(find_wallets(wallet_directory), positional_selector, {});
				set_active_wallet(wallet_directory, wallet.path.filename().string());
				std::cout << "Active wallet: " << wallet.finger_print << " (" << wallet.path.filename().string() << ")\n";
			}
			else if(command == "info") {
				const rpc_client_t rpc(rpc_url);
				const auto info = rpc.get_json("/node/info").to_object();
				std::cout << "RPC: " << rpc_url << "\n";
				std::cout << "Network: " << info["name"].to_string_value() << "\n";
				std::cout << "Height: " << info["height"].to_string_value() << "\n";
				std::cout << "Synced: " << (info["is_synced"].to<bool>() ? "yes" : "no") << "\n";
			}
			else if(command == "broadcast") {
				if(transaction_file.empty()) {
					throw std::logic_error("broadcast requires --transaction PATH");
				}
				std::ifstream stream(transaction_file, std::ios::binary);
				if(!stream) {
					throw std::runtime_error("failed to read transaction: " + transaction_file);
				}
				std::ostringstream encoded;
				encoded << stream.rdbuf();
				const auto tx_json = encoded.str();
				const auto tx = vnx::from_string<mmx::Transaction>(tx_json);
				const rpc_client_t rpc(rpc_url);
				const auto params = fetch_params(rpc);
				check_rpc_state(rpc, params);
				if(!tx.is_signed() || !tx.is_valid(params)) {
					throw std::runtime_error("transaction file does not contain a valid signed transaction");
				}
				const auto validation = rpc.post_json("/transaction/validate", tx_json).to_object();
				if(validation["did_fail"].to<bool>()) {
					throw std::runtime_error("transaction execution would fail: "
							+ vnx::to_string(validation["error"]));
				}
				rpc.post("/transaction/broadcast", tx_json);
				if(json_output) {
					vnx::Object result;
					result["command"] = "broadcast";
					result["status"] = "broadcast";
					result["transaction_id"] = tx.id.to_string();
					result["broadcast"] = true;
					std::cout << vnx::to_string(vnx::Variant(result)) << "\n";
				} else {
					std::cout << "Transaction ID: " << tx.id << "\n";
					std::cout << "Transaction broadcast successfully.\n";
				}
			}
			else if(command == "mnemonic" || command == "get" || command == "address" || command == "addresses"
					|| command == "balance" || command == "history" || command == "send") {
				std::string get_subject;
				if(command == "get") {
					vnx::read_config("$2", get_subject);
					if(get_subject != "mnemonic") {
						throw std::logic_error("usage: mmxwallet get mnemonic");
					}
				}
				if(!file_name.empty() && !wallet_selector.empty()) {
					throw std::logic_error("--file and --wallet cannot be used together");
				}
				std::filesystem::path wallet_path;
				if(file_name.empty()) {
					const auto wallets = find_wallets(wallet_directory);
					wallet_path = wallet_selector.empty()
							? select_wallet(wallets, {}, get_active_wallet(wallet_directory)).path
							: select_wallet_by_finger_print(wallets, wallet_selector).path;
				} else {
					wallet_path = file_name;
				}

				if(command == "mnemonic" || command == "get") {
					const auto key = vnx::read_from_file<mmx::KeyFile>(wallet_path.string());
					if(!key) {
						throw std::runtime_error("failed to read wallet: " + wallet_path.string());
					}
					const auto words = mmx::mnemonic::words_to_string(mmx::mnemonic::seed_to_words(key->seed_value));
					if(command == "get") {
						std::cout << words << "\n";
					} else {
						auto params = mmx::ChainParams::create();
						params->network = "mainnet";
						const auto wallet = load_wallet(wallet_path, account_index, num_addresses, params);
						std::cout << "Address: " << wallet->get_address(0) << "\n";
						std::cout << "Mnemonic: " << words << "\n";
					}
				}
				else if(command == "address" || command == "addresses") {
					auto params = mmx::ChainParams::create();
					params->network = "mainnet";
					const auto wallet = load_wallet(wallet_path, account_index, num_addresses, params);
					if(command == "address") {
						std::cout << wallet->get_address(offset) << "\n";
					} else {
						for(size_t i = 0; i < wallet->get_all_addresses().size(); ++i) {
							std::cout << "[" << i << "] " << wallet->get_address(i) << "\n";
						}
					}
				}
				else if(command == "history") {
					const rpc_client_t rpc(rpc_url);
					const auto params = fetch_params(rpc);
					check_rpc_state(rpc, params);
					const auto wallet = load_wallet(wallet_path, account_index, num_addresses, params);
					print_history(fetch_history(rpc, *wallet, parse_currency_filter(currency_string), history_limit), params);
				}
				else {
					const rpc_client_t rpc(rpc_url);
					const auto params = fetch_params(rpc);
					auto wallet = load_wallet(wallet_path, account_index, num_addresses, params);
					const auto state = update_wallet(rpc, *wallet, params);

					if(command == "balance") {
						print_balances(state, currency_string);
					}
					else {
						if(!have_amount || !value) {
							throw std::logic_error("amount must be greater than zero");
						}
						if(target_string.empty()) {
							throw std::logic_error("missing target address");
						}
						if(memo && memo->size() > 64) {
							throw std::logic_error("memo exceeds 64 characters");
						}
						if(fee_ratio <= 0 || fee_ratio > std::numeric_limits<uint32_t>::max() / 1024.) {
							throw std::logic_error("invalid fee ratio");
						}

						const mmx::addr_t target(target_string);
						if(target == mmx::addr_t()) {
							throw std::logic_error("target address cannot be zero");
						}
						const auto currency = parse_currency(currency_string);
						int32_t decimals = params->decimals;
						std::string symbol = "MMX";
						if(currency != mmx::addr_t()) {
							const auto iter = state.totals.find(currency);
							if(iter == state.totals.end()) {
								throw std::logic_error("wallet has no balance for the requested currency");
							}
							decimals = iter->second.decimals;
							symbol = iter->second.symbol;
						}
						const auto amount = mmx::to_amount(value, decimals);
						if(!amount) {
							throw std::logic_error("amount is below the smallest currency unit");
						}

						auto tx = mmx::Transaction::create();
						tx->note = mmx::tx_note_e::TRANSFER;
						tx->add_output(currency, target, amount, memo);

						mmx::spend_options_t spend_options;
						spend_options.fee_ratio = fee_ratio * 1024;
						spend_options.expire_delta = expire_delta;
						spend_options.nonce = make_nonce();
						wallet->complete(tx, spend_options);
						if(!tx->is_signed() || !tx->is_valid(params)) {
							throw std::runtime_error("failed to create a valid signed transaction");
						}

						std::ostringstream stream;
						stream << *tx;
						const auto tx_json = stream.str();
						const auto validation = rpc.post_json("/transaction/validate", tx_json).to_object();
						if(validation["did_fail"].to<bool>()) {
							throw std::runtime_error("transaction execution would fail: "
									+ vnx::to_string(validation["error"]));
						}
						const mmx::uint128 total_fee(validation["total_fee"].to_string_value());
						if(total_fee > tx->max_fee_amount) {
							throw std::runtime_error("RPC returned a transaction fee above the signed maximum");
						}
						if(!transaction_file.empty()) {
							std::ofstream transaction_stream(transaction_file,
									std::ios::binary | std::ios::trunc);
							if(!transaction_stream) {
								throw std::runtime_error("failed to write transaction: " + transaction_file);
							}
							transaction_stream << tx_json;
							transaction_stream.close();
							std::filesystem::permissions(transaction_file,
									std::filesystem::perms::owner_read | std::filesystem::perms::owner_write,
									std::filesystem::perm_options::replace);
						}

						const bool broadcast = pre_accept || (!json_output && accept_prompt());
						if(broadcast) {
							rpc.post("/transaction/broadcast", tx_json);
						}
						if(json_output) {
							vnx::Object result;
							result["command"] = "send";
							result["status"] = broadcast ? "broadcast" : "validated";
							result["transaction_id"] = tx->id.to_string();
							result["amount"] = format_amount(amount, decimals);
							result["amount_atomic"] = amount.to_string();
							result["currency"] = symbol;
							result["currency_address"] = currency.to_string();
							result["target"] = target.to_string();
							result["fee"] = format_amount(total_fee, params->decimals);
							result["fee_atomic"] = total_fee.to_string();
							result["expires_height"] = tx->expires;
							result["current_height"] = state.height;
							result["broadcast"] = broadcast;
							if(memo) {
								result["memo"] = *memo;
							}
							std::cout << vnx::to_string(vnx::Variant(result)) << "\n";
						} else {
							std::cout << "Amount: " << format_amount(amount, decimals) << " " << symbol << "\n";
							std::cout << "Target: " << target << "\n";
							std::cout << "Fee: " << format_amount(total_fee, params->decimals) << " MMX\n";
							std::cout << "Expires: " << tx->expires << " (current height " << state.height << ")\n";
							std::cout << "Transaction ID: " << tx->id << "\n";
							if(broadcast) {
								std::cout << "Transaction broadcast successfully.\n";
							} else {
							std::cout << "Transaction not broadcast.\n";
							}
						}
					}
				}
			}
			else {
				throw std::logic_error("unknown command: " + command);
			}
		}
	}
	catch(const std::exception& ex) {
		bool json_output = false;
		vnx::read_config("json", json_output);
		if(json_output) {
			vnx::Object error;
			error["status"] = "error";
			error["error"] = ex.what();
			error["code"] = dynamic_cast<const mmx::insufficient_wallet_funds*>(&ex)
					? "insufficient_funds" : "wallet_error";
			std::cerr << vnx::to_string(vnx::Variant(error)) << "\n";
		} else {
			std::cerr << "Error: " << ex.what() << "\n";
		}
		exit_code = 1;
	}

	vnx::close();
	mmx::secp256k1_free();
	return exit_code;
}
