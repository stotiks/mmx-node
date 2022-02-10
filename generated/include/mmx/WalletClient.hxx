
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_Wallet_CLIENT_HXX_
#define INCLUDE_mmx_Wallet_CLIENT_HXX_

#include <vnx/Client.h>
#include <mmx/Contract.hxx>
#include <mmx/FarmerKeys.hxx>
#include <mmx/Solution.hxx>
#include <mmx/Transaction.hxx>
#include <mmx/account_t.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/balance_t.hxx>
#include <mmx/hash_t.hpp>
#include <mmx/spend_options_t.hxx>
#include <mmx/stxo_entry_t.hxx>
#include <mmx/tx_entry_t.hxx>
#include <mmx/txio_key_t.hxx>
#include <mmx/utxo_entry_t.hxx>
#include <mmx/utxo_t.hxx>
#include <vnx/Module.h>
#include <vnx/addons/HttpData.hxx>
#include <vnx/addons/HttpRequest.hxx>
#include <vnx/addons/HttpResponse.hxx>


namespace mmx {

class WalletClient : public vnx::Client {
public:
	WalletClient(const std::string& service_name);
	
	WalletClient(vnx::Hash64 service_addr);
	
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
	
	::mmx::hash_t send(const uint32_t& index = 0, const uint64_t& amount = 0, const ::mmx::addr_t& dst_addr = ::mmx::addr_t(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	::mmx::hash_t send_from(const uint32_t& index = 0, const uint64_t& amount = 0, const ::mmx::addr_t& dst_addr = ::mmx::addr_t(), const ::mmx::addr_t& src_addr = ::mmx::addr_t(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	::mmx::hash_t mint(const uint32_t& index = 0, const uint64_t& amount = 0, const ::mmx::addr_t& dst_addr = ::mmx::addr_t(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	::mmx::hash_t deploy(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Contract> contract = nullptr, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	vnx::optional<::mmx::hash_t> split(const uint32_t& index = 0, const uint64_t& max_amount = 0, const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> complete(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr, const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::shared_ptr<const ::mmx::Transaction> sign_off(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr, const vnx::bool_t& cover_fee = 0, const std::vector<std::pair<::mmx::txio_key_t, ::mmx::utxo_t>>& utxo_list = {});
	
	std::shared_ptr<const ::mmx::Solution> sign_msg(const uint32_t& index = 0, const ::mmx::addr_t& address = ::mmx::addr_t(), const ::mmx::hash_t& msg = ::mmx::hash_t());
	
	void send_off(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr);
	
	void send_off_async(const uint32_t& index = 0, std::shared_ptr<const ::mmx::Transaction> tx = nullptr);
	
	void mark_spent(const uint32_t& index = 0, const std::vector<::mmx::txio_key_t>& keys = {});
	
	void mark_spent_async(const uint32_t& index = 0, const std::vector<::mmx::txio_key_t>& keys = {});
	
	void reserve(const uint32_t& index = 0, const std::vector<::mmx::txio_key_t>& keys = {});
	
	void reserve_async(const uint32_t& index = 0, const std::vector<::mmx::txio_key_t>& keys = {});
	
	void release(const uint32_t& index = 0, const std::vector<::mmx::txio_key_t>& keys = {});
	
	void release_async(const uint32_t& index = 0, const std::vector<::mmx::txio_key_t>& keys = {});
	
	void release_all();
	
	void release_all_async();
	
	std::vector<::mmx::utxo_entry_t> get_utxo_list(const uint32_t& index = 0, const uint32_t& min_confirm = 0);
	
	std::vector<::mmx::utxo_entry_t> get_utxo_list_for(const uint32_t& index = 0, const ::mmx::addr_t& currency = ::mmx::addr_t(), const uint32_t& min_confirm = 0);
	
	std::vector<::mmx::stxo_entry_t> get_stxo_list(const uint32_t& index = 0);
	
	std::vector<::mmx::stxo_entry_t> get_stxo_list_for(const uint32_t& index = 0, const ::mmx::addr_t& currency = ::mmx::addr_t());
	
	std::vector<::mmx::utxo_entry_t> gather_utxos_for(const uint32_t& index = 0, const uint64_t& amount = 0, const ::mmx::addr_t& currency = ::mmx::addr_t(), const ::mmx::spend_options_t& options = ::mmx::spend_options_t());
	
	std::vector<::mmx::tx_entry_t> get_history(const uint32_t& index = 0, const int32_t& since = 0);
	
	::mmx::balance_t get_balance(const uint32_t& index = 0, const ::mmx::addr_t& currency = ::mmx::addr_t(), const uint32_t& min_confirm = 0);
	
	std::map<::mmx::addr_t, ::mmx::balance_t> get_balances(const uint32_t& index = 0, const uint32_t& min_confirm = 0);
	
	std::map<::mmx::addr_t, std::shared_ptr<const ::mmx::Contract>> get_contracts(const uint32_t& index = 0);
	
	::mmx::addr_t get_address(const uint32_t& index = 0, const uint32_t& offset = 0);
	
	std::vector<::mmx::addr_t> get_all_addresses(const int32_t& index = 0);
	
	::mmx::account_t get_account(const uint32_t& index = 0);
	
	std::map<uint32_t, ::mmx::account_t> get_all_accounts();
	
	void add_account(const uint32_t& index = 0, const ::mmx::account_t& config = ::mmx::account_t());
	
	void add_account_async(const uint32_t& index = 0, const ::mmx::account_t& config = ::mmx::account_t());
	
	void create_account(const ::mmx::account_t& config = ::mmx::account_t());
	
	void create_account_async(const ::mmx::account_t& config = ::mmx::account_t());
	
	void create_wallet(const ::mmx::account_t& config = ::mmx::account_t());
	
	void create_wallet_async(const ::mmx::account_t& config = ::mmx::account_t());
	
	::mmx::hash_t get_master_seed(const uint32_t& index = 0);
	
	std::shared_ptr<const ::mmx::FarmerKeys> get_farmer_keys(const uint32_t& index = 0);
	
	std::vector<std::shared_ptr<const ::mmx::FarmerKeys>> get_all_farmer_keys();
	
	std::shared_ptr<const ::vnx::addons::HttpResponse> http_request(std::shared_ptr<const ::vnx::addons::HttpRequest> request = nullptr, const std::string& sub_path = "");
	
	std::shared_ptr<const ::vnx::addons::HttpData> http_request_chunk(std::shared_ptr<const ::vnx::addons::HttpRequest> request = nullptr, const std::string& sub_path = "", const int64_t& offset = 0, const int64_t& max_bytes = 0);
	
};


} // namespace mmx

#endif // INCLUDE_mmx_Wallet_CLIENT_HXX_
