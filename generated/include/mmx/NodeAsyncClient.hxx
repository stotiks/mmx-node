
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_Node_ASYNC_CLIENT_HXX_
#define INCLUDE_mmx_Node_ASYNC_CLIENT_HXX_

#include <vnx/AsyncClient.h>
#include <mmx/Block.hxx>
#include <mmx/BlockHeader.hxx>
#include <mmx/ChainParams.hxx>
#include <mmx/Contract.hxx>
#include <mmx/NetworkInfo.hxx>
#include <mmx/ProofOfTime.hxx>
#include <mmx/ProofResponse.hxx>
#include <mmx/Transaction.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/balance_t.hxx>
#include <mmx/hash_t.hpp>
#include <mmx/stxo_entry_t.hxx>
#include <mmx/tx_entry_t.hxx>
#include <mmx/tx_info_t.hxx>
#include <mmx/txio_key_t.hxx>
#include <mmx/txo_info_t.hxx>
#include <mmx/utxo_entry_t.hxx>
#include <vnx/Module.h>
#include <vnx/TopicPtr.hpp>
#include <vnx/addons/HttpData.hxx>
#include <vnx/addons/HttpRequest.hxx>
#include <vnx/addons/HttpResponse.hxx>


namespace mmx {

class NodeAsyncClient : public vnx::AsyncClient {
public:
	NodeAsyncClient(const std::string& service_name);
	
	NodeAsyncClient(vnx::Hash64 service_addr);
	
	uint64_t get_params(
			const std::function<void(std::shared_ptr<const ::mmx::ChainParams>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::ChainParams>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_network_info(
			const std::function<void(std::shared_ptr<const ::mmx::NetworkInfo>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::NetworkInfo>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_height(
			const std::function<void(const uint32_t&)>& _callback = std::function<void(const uint32_t&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_synced_height(
			const std::function<void(const vnx::optional<uint32_t>&)>& _callback = std::function<void(const vnx::optional<uint32_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_block(const ::mmx::hash_t& hash = ::mmx::hash_t(), 
			const std::function<void(std::shared_ptr<const ::mmx::Block>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::Block>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_block_at(const uint32_t& height = 0, 
			const std::function<void(std::shared_ptr<const ::mmx::Block>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::Block>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_header(const ::mmx::hash_t& hash = ::mmx::hash_t(), 
			const std::function<void(std::shared_ptr<const ::mmx::BlockHeader>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::BlockHeader>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_header_at(const uint32_t& height = 0, 
			const std::function<void(std::shared_ptr<const ::mmx::BlockHeader>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::BlockHeader>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_block_hash(const uint32_t& height = 0, 
			const std::function<void(const vnx::optional<::mmx::hash_t>&)>& _callback = std::function<void(const vnx::optional<::mmx::hash_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_txo_info(const ::mmx::txio_key_t& key = ::mmx::txio_key_t(), 
			const std::function<void(const vnx::optional<::mmx::txo_info_t>&)>& _callback = std::function<void(const vnx::optional<::mmx::txo_info_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_txo_infos(const std::vector<::mmx::txio_key_t>& keys = {}, 
			const std::function<void(const std::vector<vnx::optional<::mmx::txo_info_t>>&)>& _callback = std::function<void(const std::vector<vnx::optional<::mmx::txo_info_t>>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_tx_height(const ::mmx::hash_t& id = ::mmx::hash_t(), 
			const std::function<void(const vnx::optional<uint32_t>&)>& _callback = std::function<void(const vnx::optional<uint32_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_tx_info(const ::mmx::hash_t& id = ::mmx::hash_t(), 
			const std::function<void(const vnx::optional<::mmx::tx_info_t>&)>& _callback = std::function<void(const vnx::optional<::mmx::tx_info_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_tx_ids_at(const uint32_t& height = 0, 
			const std::function<void(const std::vector<::mmx::hash_t>&)>& _callback = std::function<void(const std::vector<::mmx::hash_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t add_block(std::shared_ptr<const ::mmx::Block> block = nullptr, 
			const std::function<void()>& _callback = std::function<void()>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t add_transaction(std::shared_ptr<const ::mmx::Transaction> tx = nullptr, const vnx::bool_t& pre_validate = 0, 
			const std::function<void()>& _callback = std::function<void()>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_contract(const ::mmx::addr_t& address = ::mmx::addr_t(), 
			const std::function<void(std::shared_ptr<const ::mmx::Contract>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::Contract>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_contracts(const std::vector<::mmx::addr_t>& addresses = {}, 
			const std::function<void(const std::vector<std::shared_ptr<const ::mmx::Contract>>&)>& _callback = std::function<void(const std::vector<std::shared_ptr<const ::mmx::Contract>>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_contracts_owned(const std::vector<::mmx::addr_t>& owners = {}, 
			const std::function<void(const std::map<::mmx::addr_t, std::shared_ptr<const ::mmx::Contract>>&)>& _callback = std::function<void(const std::map<::mmx::addr_t, std::shared_ptr<const ::mmx::Contract>>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_transaction(const ::mmx::hash_t& id = ::mmx::hash_t(), const vnx::bool_t& include_pending = 0, 
			const std::function<void(std::shared_ptr<const ::mmx::Transaction>)>& _callback = std::function<void(std::shared_ptr<const ::mmx::Transaction>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_transactions(const std::vector<::mmx::hash_t>& ids = {}, 
			const std::function<void(const std::vector<std::shared_ptr<const ::mmx::Transaction>>&)>& _callback = std::function<void(const std::vector<std::shared_ptr<const ::mmx::Transaction>>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_history_for(const std::vector<::mmx::addr_t>& addresses = {}, const int32_t& since = 0, 
			const std::function<void(const std::vector<::mmx::tx_entry_t>&)>& _callback = std::function<void(const std::vector<::mmx::tx_entry_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_balance(const ::mmx::addr_t& address = ::mmx::addr_t(), const ::mmx::addr_t& currency = ::mmx::addr_t(), const uint32_t& min_confirm = 1, 
			const std::function<void(const uint64_t&)>& _callback = std::function<void(const uint64_t&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_balances(const ::mmx::addr_t& address = ::mmx::addr_t(), const uint32_t& min_confirm = 1, 
			const std::function<void(const std::map<::mmx::addr_t, ::mmx::balance_t>&)>& _callback = std::function<void(const std::map<::mmx::addr_t, ::mmx::balance_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_total_balance(const std::vector<::mmx::addr_t>& addresses = {}, const ::mmx::addr_t& currency = ::mmx::addr_t(), const uint32_t& min_confirm = 1, 
			const std::function<void(const uint64_t&)>& _callback = std::function<void(const uint64_t&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_total_balances(const std::vector<::mmx::addr_t>& addresses = {}, const uint32_t& min_confirm = 1, 
			const std::function<void(const std::map<::mmx::addr_t, uint64_t>&)>& _callback = std::function<void(const std::map<::mmx::addr_t, uint64_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_total_supply(const ::mmx::addr_t& currency = ::mmx::addr_t(), 
			const std::function<void(const uint64_t&)>& _callback = std::function<void(const uint64_t&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_utxo_list(const std::vector<::mmx::addr_t>& addresses = {}, const uint32_t& min_confirm = 1, const uint32_t& since = 0, 
			const std::function<void(const std::vector<::mmx::utxo_entry_t>&)>& _callback = std::function<void(const std::vector<::mmx::utxo_entry_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_utxo_list_for(const std::vector<::mmx::addr_t>& addresses = {}, const ::mmx::addr_t& currency = ::mmx::addr_t(), const uint32_t& min_confirm = 1, const uint32_t& since = 0, 
			const std::function<void(const std::vector<::mmx::utxo_entry_t>&)>& _callback = std::function<void(const std::vector<::mmx::utxo_entry_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t get_stxo_list(const std::vector<::mmx::addr_t>& addresses = {}, const uint32_t& since = 0, 
			const std::function<void(const std::vector<::mmx::stxo_entry_t>&)>& _callback = std::function<void(const std::vector<::mmx::stxo_entry_t>&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t start_sync(const vnx::bool_t& force = 0, 
			const std::function<void()>& _callback = std::function<void()>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t http_request(std::shared_ptr<const ::vnx::addons::HttpRequest> request = nullptr, const std::string& sub_path = "", 
			const std::function<void(std::shared_ptr<const ::vnx::addons::HttpResponse>)>& _callback = std::function<void(std::shared_ptr<const ::vnx::addons::HttpResponse>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t http_request_chunk(std::shared_ptr<const ::vnx::addons::HttpRequest> request = nullptr, const std::string& sub_path = "", const int64_t& offset = 0, const int64_t& max_bytes = 0, 
			const std::function<void(std::shared_ptr<const ::vnx::addons::HttpData>)>& _callback = std::function<void(std::shared_ptr<const ::vnx::addons::HttpData>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_get_config_object(
			const std::function<void(const ::vnx::Object&)>& _callback = std::function<void(const ::vnx::Object&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_get_config(const std::string& name = "", 
			const std::function<void(const ::vnx::Variant&)>& _callback = std::function<void(const ::vnx::Variant&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_set_config_object(const ::vnx::Object& config = ::vnx::Object(), 
			const std::function<void()>& _callback = std::function<void()>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_set_config(const std::string& name = "", const ::vnx::Variant& value = ::vnx::Variant(), 
			const std::function<void()>& _callback = std::function<void()>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_get_type_code(
			const std::function<void(const ::vnx::TypeCode&)>& _callback = std::function<void(const ::vnx::TypeCode&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_get_module_info(
			const std::function<void(std::shared_ptr<const ::vnx::ModuleInfo>)>& _callback = std::function<void(std::shared_ptr<const ::vnx::ModuleInfo>)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_restart(
			const std::function<void()>& _callback = std::function<void()>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_stop(
			const std::function<void()>& _callback = std::function<void()>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
	uint64_t vnx_self_test(
			const std::function<void(const vnx::bool_t&)>& _callback = std::function<void(const vnx::bool_t&)>(),
			const std::function<void(const vnx::exception&)>& _error_callback = std::function<void(const vnx::exception&)>());
	
protected:
	int32_t vnx_purge_request(uint64_t _request_id, const vnx::exception& _ex) override;
	
	int32_t vnx_callback_switch(uint64_t _request_id, std::shared_ptr<const vnx::Value> _value) override;
	
private:
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::ChainParams>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_params;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::NetworkInfo>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_network_info;
	std::unordered_map<uint64_t, std::pair<std::function<void(const uint32_t&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_height;
	std::unordered_map<uint64_t, std::pair<std::function<void(const vnx::optional<uint32_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_synced_height;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::Block>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_block;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::Block>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_block_at;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::BlockHeader>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_header;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::BlockHeader>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_header_at;
	std::unordered_map<uint64_t, std::pair<std::function<void(const vnx::optional<::mmx::hash_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_block_hash;
	std::unordered_map<uint64_t, std::pair<std::function<void(const vnx::optional<::mmx::txo_info_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_txo_info;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<vnx::optional<::mmx::txo_info_t>>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_txo_infos;
	std::unordered_map<uint64_t, std::pair<std::function<void(const vnx::optional<uint32_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_tx_height;
	std::unordered_map<uint64_t, std::pair<std::function<void(const vnx::optional<::mmx::tx_info_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_tx_info;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<::mmx::hash_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_tx_ids_at;
	std::unordered_map<uint64_t, std::pair<std::function<void()>, std::function<void(const vnx::exception&)>>> vnx_queue_add_block;
	std::unordered_map<uint64_t, std::pair<std::function<void()>, std::function<void(const vnx::exception&)>>> vnx_queue_add_transaction;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::Contract>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_contract;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<std::shared_ptr<const ::mmx::Contract>>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_contracts;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::map<::mmx::addr_t, std::shared_ptr<const ::mmx::Contract>>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_contracts_owned;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::mmx::Transaction>)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_transaction;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<std::shared_ptr<const ::mmx::Transaction>>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_transactions;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<::mmx::tx_entry_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_history_for;
	std::unordered_map<uint64_t, std::pair<std::function<void(const uint64_t&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_balance;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::map<::mmx::addr_t, ::mmx::balance_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_balances;
	std::unordered_map<uint64_t, std::pair<std::function<void(const uint64_t&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_total_balance;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::map<::mmx::addr_t, uint64_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_total_balances;
	std::unordered_map<uint64_t, std::pair<std::function<void(const uint64_t&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_total_supply;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<::mmx::utxo_entry_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_utxo_list;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<::mmx::utxo_entry_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_utxo_list_for;
	std::unordered_map<uint64_t, std::pair<std::function<void(const std::vector<::mmx::stxo_entry_t>&)>, std::function<void(const vnx::exception&)>>> vnx_queue_get_stxo_list;
	std::unordered_map<uint64_t, std::pair<std::function<void()>, std::function<void(const vnx::exception&)>>> vnx_queue_start_sync;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::vnx::addons::HttpResponse>)>, std::function<void(const vnx::exception&)>>> vnx_queue_http_request;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::vnx::addons::HttpData>)>, std::function<void(const vnx::exception&)>>> vnx_queue_http_request_chunk;
	std::unordered_map<uint64_t, std::pair<std::function<void(const ::vnx::Object&)>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_get_config_object;
	std::unordered_map<uint64_t, std::pair<std::function<void(const ::vnx::Variant&)>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_get_config;
	std::unordered_map<uint64_t, std::pair<std::function<void()>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_set_config_object;
	std::unordered_map<uint64_t, std::pair<std::function<void()>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_set_config;
	std::unordered_map<uint64_t, std::pair<std::function<void(const ::vnx::TypeCode&)>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_get_type_code;
	std::unordered_map<uint64_t, std::pair<std::function<void(std::shared_ptr<const ::vnx::ModuleInfo>)>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_get_module_info;
	std::unordered_map<uint64_t, std::pair<std::function<void()>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_restart;
	std::unordered_map<uint64_t, std::pair<std::function<void()>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_stop;
	std::unordered_map<uint64_t, std::pair<std::function<void(const vnx::bool_t&)>, std::function<void(const vnx::exception&)>>> vnx_queue_vnx_self_test;
	
};


} // namespace mmx

#endif // INCLUDE_mmx_Node_ASYNC_CLIENT_HXX_
