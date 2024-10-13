
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_Wallet_CLIENT_HXX_
#define INCLUDE_mmx_Wallet_CLIENT_HXX_

#include <vnx/Client.h>
#include <mmx/Contract.hxx>
#include <mmx/KeyFile.hxx>
#include <mmx/Solution.hxx>
#include <mmx/Transaction.hxx>
#include <mmx/account_info_t.hxx>
#include <mmx/account_t.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/balance_t.hxx>
#include <mmx/hash_t.hpp>
#include <mmx/offer_data_t.hxx>
#include <mmx/pubkey_t.hpp>
#include <mmx/skey_t.hpp>
#include <mmx/spend_options_t.hxx>
#include <mmx/tx_entry_t.hxx>
#include <mmx/tx_log_entry_t.hxx>
#include <mmx/tx_type_e.hxx>
#include <mmx/txin_t.hxx>
#include <mmx/uint128.hpp>
#include <mmx/virtual_plot_info_t.hxx>
#include <vnx/Module.h>
#include <vnx/Variant.hpp>
#include <vnx/addons/HttpData.hxx>
#include <vnx/addons/HttpRequest.hxx>
#include <vnx/addons/HttpResponse.hxx>


namespace mmx {

class WalletClient : public vnx::Client {
public:
	WalletClient(const std::string& service_name);
	
	WalletClient(vnx::Hash64 service_addr);
	
	std::shared_ptr<const ::mmx::Transaction> send(const uint32_t& index = 0, const ::mmx::uint128& amount = ::mmx::uint128(), const ::mmx::addr_t& dst_addr = ::mmx::addr_t(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> send_many(const uint32_t& index = 0, const std::vector<std::pair<::mmx::addr_t, ::mmx::uint128>>& amounts = {}, const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> send_from(const uint32_t& index = 0, const ::mmx::uint128& amount = ::mmx::uint128(), const ::mmx::addr_t& dst_addr = ::mmx::addr_t(), const ::mmx::addr_t& src_addr = ::mmx::addr_t(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> deploy(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Contract> contract = nullptr, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> execute(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const std::string& method = "", const std::vector<::vnx::Variant>& args = {}, const vnx::optional<uint32_t>& user = nullptr, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> deposit(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const std::string& method = "", const std::vector<::vnx::Variant>& args = {}, const ::mmx::uint128& amount = ::mmx::uint128(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> make_offer(const uint32_t& index = 0, const uint32_t& owner = 0, const ::mmx::uint128& bid_amount = ::mmx::uint128(), const ::mmx::addr_t& bid_currency = ::mmx::addr_t(), const ::mmx::uint128& ask_amount = ::mmx::uint128(), const ::mmx::addr_t& ask_currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> offer_trade(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const ::mmx::uint128& amount = ::mmx::uint128(), const uint32_t& dst_addr = 0, const ::mmx::uint128& price = ::mmx::uint128(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> offer_withdraw(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> accept_offer(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const uint32_t& dst_addr = 0, const ::mmx::uint128& price = ::mmx::uint128(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> cancel_offer(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> swap_trade(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const ::mmx::uint128& amount = ::mmx::uint128(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const vnx::optional<::mmx::uint128>& min_trade = nullptr, const int32_t& num_iter = 20, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> swap_add_liquid(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const std::array<::mmx::uint128, 2>& amount = {}, const uint32_t& pool_idx = 0, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> swap_rem_liquid(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const std::array<::mmx::uint128, 2>& amount = {}, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> plotnft_exec(const ::mmx::addr_t& address = ::mmx::addr_t(), const std::string& method = "", const std::vector<::vnx::Variant>& args = {}, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> plotnft_create(const uint32_t& index = 0, const std::string& name = "", const vnx::optional<uint32_t>& owner = nullptr, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> complete(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> sign_off(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Solution> sign_msg(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const ::mmx::hash_t& msg = ::mmx::hash_t());
	
	void send_off(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr);
	
	void send_off_async(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr);
	
	void mark_spent(const uint32_t& index = 0, const std::map<std::pair<::mmx::addr_t, ::mmx::addr_t>, ::mmx::uint128>& amounts = {});
	
	void mark_spent_async(const uint32_t& index = 0, const std::map<std::pair<::mmx::addr_t, ::mmx::addr_t>, ::mmx::uint128>& amounts = {});
	
	void reserve(const uint32_t& index = 0, const std::map<std::pair<::mmx::addr_t, ::mmx::addr_t>, ::mmx::uint128>& amounts = {});
	
	void reserve_async(const uint32_t& index = 0, const std::map<std::pair<::mmx::addr_t, ::mmx::addr_t>, ::mmx::uint128>& amounts = {});
	
	void release(const uint32_t& index = 0, const std::map<std::pair<::mmx::addr_t, ::mmx::addr_t>, ::mmx::uint128>& amounts = {});
	
	void release_async(const uint32_t& index = 0, const std::map<std::pair<::mmx::addr_t, ::mmx::addr_t>, ::mmx::uint128>& amounts = {});
	
	void release_all();
	
	void release_all_async();
	
	void reset_cache(const uint32_t& index = 0);
	
	void reset_cache_async(const uint32_t& index = 0);
	
	void update_cache(const uint32_t& index = 0);
	
	void update_cache_async(const uint32_t& index = 0);
	
	std::vector<::mmx::tx_entry_t> get_history(const uint32_t& index = 0, const uint32_t& since = 0, const uint32_t& until = -1, const int32_t& limit = -1, const vnx::optional<::mmx::tx_type_e>& type = nullptr, const vnx::optional<::mmx::addr_t>& currency = nullptr);
	
	std::vector<::mmx::tx_entry_t> get_history_memo(const uint32_t& index = 0, const std::string& memo = "", const int32_t& limit = -1, const vnx::optional<::mmx::addr_t>& currency = nullptr);
	
	std::vector<::mmx::tx_log_entry_t> get_tx_log(const uint32_t& index = 0, const int32_t& limit = -1, const uint32_t& offset = 0);
	
	std::vector<::mmx::txin_t> gather_inputs_for(const uint32_t& index = 0, const ::mmx::uint128& amount = ::mmx::uint128(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	::mmx::balance_t get_balance(const uint32_t& index = 0, const ::mmx::addr_t& currency = ::mmx::addr_t());
	
	std::map<::mmx::addr_t, ::mmx::balance_t> get_balances(const uint32_t& index = 0, const vnx::bool_t& with_zero = 0, const vnx::bool_t& show_all = 0);
	
	std::map<::mmx::addr_t, ::mmx::balance_t> get_total_balances(const std::vector<::mmx::addr_t>& addresses = {});
	
	std::map<::mmx::addr_t, ::mmx::balance_t> get_contract_balances(const ::mmx::addr_t& address = ::mmx::addr_t());
	
	std::map<::mmx::addr_t, std::shared_ptr<const ::mmx::Contract>> get_contracts(const uint32_t& index = 0, const vnx::optional<std::string>& type_name = nullptr, const vnx::optional<::mmx::hash_t>& type_hash = nullptr);
	
	std::map<::mmx::addr_t, std::shared_ptr<const ::mmx::Contract>> get_contracts_owned(const uint32_t& index = 0, const vnx::optional<std::string>& type_name = nullptr, const vnx::optional<::mmx::hash_t>& type_hash = nullptr);
	
	std::vector<::mmx::virtual_plot_info_t> get_virtual_plots(const uint32_t& index = 0);
	
	std::vector<::mmx::offer_data_t> get_offers(const uint32_t& index = 0, const vnx::bool_t& state = 0);
	
	std::map<::mmx::addr_t, std::array<std::pair<::mmx::addr_t, ::mmx::uint128>, 2>> get_swap_liquidity(const uint32_t& index = 0);
	
	::mmx::addr_t get_address(const uint32_t& index = 0, const uint32_t& offset = 0);
	
	std::vector<::mmx::addr_t> get_all_addresses(const int32_t& index = 0);
	
	int32_t find_wallet_by_addr(const ::mmx::addr_t& address = ::mmx::addr_t());
	
	::mmx::account_info_t get_account(const uint32_t& index = 0);
	
	std::vector<::mmx::account_info_t> get_all_accounts();
	
	vnx::bool_t is_locked(const uint32_t& index = 0);
	
	void lock(const uint32_t& index = 0);
	
	void lock_async(const uint32_t& index = 0);
	
	void unlock(const uint32_t& index = 0, const std::string& passphrase = "");
	
	void unlock_async(const uint32_t& index = 0, const std::string& passphrase = "");
	
	void add_account(const uint32_t& index = 0, const ::mmx::account_t& config = ::mmx::account_t(), const vnx::optional<std::string>& passphrase = nullptr);
	
	void add_account_async(const uint32_t& index = 0, const ::mmx::account_t& config = ::mmx::account_t(), const vnx::optional<std::string>& passphrase = nullptr);
	
	void create_account(const ::mmx::account_t& config = ::mmx::account_t(), const vnx::optional<std::string>& passphrase = nullptr);
	
	void create_account_async(const ::mmx::account_t& config = ::mmx::account_t(), const vnx::optional<std::string>& passphrase = nullptr);
	
	void create_wallet(const ::mmx::account_t& config = ::mmx::account_t(), const vnx::optional<std::string>& words = nullptr, const vnx::optional<std::string>& passphrase = nullptr);
	
	void create_wallet_async(const ::mmx::account_t& config = ::mmx::account_t(), const vnx::optional<std::string>& words = nullptr, const vnx::optional<std::string>& passphrase = nullptr);
	
	void import_wallet(const ::mmx::account_t& config = ::mmx::account_t(), std::shared_ptr<const ::mmx::KeyFile> key_file = nullptr, const vnx::optional<std::string>& passphrase = nullptr);
	
	void import_wallet_async(const ::mmx::account_t& config = ::mmx::account_t(), std::shared_ptr<const ::mmx::KeyFile> key_file = nullptr, const vnx::optional<std::string>& passphrase = nullptr);
	
	void remove_account(const uint32_t& index = 0, const uint32_t& account = 0);
	
	void remove_account_async(const uint32_t& index = 0, const uint32_t& account = 0);
	
	std::shared_ptr<const ::mmx::KeyFile> export_wallet(const uint32_t& index = 0);
	
	std::vector<std::string> get_mnemonic_wordlist(const std::string& lang = "en");
	
	std::set<::mmx::addr_t> get_token_list();
	
	void add_token(const ::mmx::addr_t& address = ::mmx::addr_t());
	
	void add_token_async(const ::mmx::addr_t& address = ::mmx::addr_t());
	
	void rem_token(const ::mmx::addr_t& address = ::mmx::addr_t());
	
	void rem_token_async(const ::mmx::addr_t& address = ::mmx::addr_t());
	
	::mmx::hash_t get_master_seed(const uint32_t& index = 0);
	
	std::vector<std::string> get_mnemonic_seed(const uint32_t& index = 0);
	
	std::pair<::mmx::skey_t, ::mmx::pubkey_t> get_farmer_keys(const uint32_t& index = 0);
	
	std::vector<std::pair<::mmx::skey_t, ::mmx::pubkey_t>> get_all_farmer_keys();
	
	std::shared_ptr<const ::vnx::addons::HttpResponse> http_request(std::shared_ptr<const ::vnx::addons::HttpRequest> request = nullptr, const std::string& sub_path = "");
	
	std::shared_ptr<const ::vnx::addons::HttpData> http_request_chunk(std::shared_ptr<const ::vnx::addons::HttpRequest> request = nullptr, const std::string& sub_path = "", const int64_t& offset = 0, const int64_t& max_bytes = 0);
	
	::vnx::Object vnx_get_config_object();
	
	::vnx::Variant vnx_get_config(const std::string& name = "");
	
	void vnx_set_config_object(const ::vnx::Object& config = ::vnx::Object());
	
	void vnx_set_config_object_async(const ::vnx::Object& config = ::vnx::Object());
	
	void vnx_set_config(const std::string& name = "", const ::vnx::Variant& value = ::vnx::Variant());
	
	void vnx_set_config_async(const std::string& name = "", const ::vnx::Variant& value = ::vnx::Variant());
	
	::vnx::TypeCode vnx_get_type_code();
	
	std::shared_ptr<const ::vnx::ModuleInfo> vnx_get_module_info();
	
	void vnx_restart();
	
	void vnx_restart_async();
	
	void vnx_stop();
	
	void vnx_stop_async();
	
	vnx::bool_t vnx_self_test();
	
};


} // namespace mmx

#endif // INCLUDE_mmx_Wallet_CLIENT_HXX_
