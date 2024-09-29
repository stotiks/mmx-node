/*
 * Node.h
 *
 *  Created on: Dec 7, 2021
 *      Author: mad
 */

#ifndef INCLUDE_MMX_NODE_H_
#define INCLUDE_MMX_NODE_H_

#include <mmx/NodeBase.hxx>
#include <mmx/Block.hxx>
#include <mmx/ChainParams.hxx>
#include <mmx/RouterAsyncClient.hxx>
#include <mmx/TimeLordAsyncClient.hxx>
#include <mmx/contract/Binary.hxx>
#include <mmx/operation/Execute.hxx>
#include <mmx/txio_entry_t.hpp>
#include <mmx/OCL_VDF.h>
#include <mmx/uint128.hpp>
#include <mmx/tx_index_t.hxx>
#include <mmx/block_index_t.hxx>
#include <mmx/trade_log_t.hxx>
#include <mmx/table.h>
#include <mmx/multi_table.h>
#include <mmx/balance_cache_t.h>
#include <mmx/farmed_block_info_t.hxx>
#include <mmx/utils.h>

#include <mmx/vm/Engine.h>
#include <mmx/vm/StorageDB.h>
#include <mmx/vm/StorageCache.h>

#include <vnx/ThreadPool.h>
#include <vnx/addons/HttpInterface.h>

#include <unordered_set>
#include <unordered_map>
#include <shared_mutex>


namespace mmx {

class Node : public NodeBase {
public:
	Node(const std::string& _vnx_value);

	bool do_restart = false;

protected:
	void init() override;

	void main() override;

	std::shared_ptr<const ChainParams> get_params() const override;

	std::shared_ptr<const NetworkInfo> get_network_info() const override;

	hash_t get_genesis_hash() const override;

	uint32_t get_height() const override;

	vnx::optional<uint32_t> get_synced_height() const override;

	std::shared_ptr<const Block> get_block(const hash_t& hash) const override;

	std::shared_ptr<const Block> get_block_at(const uint32_t& height) const override;

	std::shared_ptr<const BlockHeader> get_header(const hash_t& hash) const override;

	std::shared_ptr<const BlockHeader> get_header_at(const uint32_t& height) const override;

	vnx::optional<hash_t> get_block_hash(const uint32_t& height) const override;

	vnx::optional<std::pair<hash_t, hash_t>> get_block_hash_ex(const uint32_t& height) const override;

	vnx::optional<uint32_t> get_tx_height(const hash_t& id) const override;

	std::vector<hash_t> get_tx_ids_at(const uint32_t& height) const override;

	std::vector<hash_t> get_tx_ids_since(const uint32_t& height) const override;

	std::vector<hash_t> get_tx_ids(const uint32_t& limit) const override;

	vnx::optional<tx_info_t> get_tx_info(const hash_t& id) const override;

	vnx::optional<tx_info_t> get_tx_info_for(std::shared_ptr<const Transaction> tx) const;

	std::shared_ptr<const Transaction> get_transaction(const hash_t& id, const bool& include_pending = false) const override;

	std::vector<std::shared_ptr<const Transaction>> get_transactions(const std::vector<hash_t>& ids) const override;

	std::vector<tx_entry_t> get_history(const std::vector<addr_t>& addresses, const uint32_t& since, const uint32_t& until, const int32_t& limit) const override;

	std::vector<tx_entry_t> get_history_memo(const std::vector<addr_t>& addresses, const std::string& memo, const int32_t& limit) const override;

	std::shared_ptr<const Contract> get_contract(const addr_t& address) const override;

	std::shared_ptr<const Contract> get_contract_for(const addr_t& address) const override;

	std::vector<std::shared_ptr<const Contract>> get_contracts(const std::vector<addr_t>& addresses) const override;

	std::vector<addr_t> get_contracts_by(const std::vector<addr_t>& addresses, const vnx::optional<hash_t>& type_hash = nullptr) const override;

	std::vector<addr_t> get_contracts_owned_by(const std::vector<addr_t>& addresses, const vnx::optional<hash_t>& type_hash = nullptr) const override;

	exec_result_t validate(std::shared_ptr<const Transaction> tx) const override;

	void add_block(std::shared_ptr<const Block> block) override;

	void add_transaction(std::shared_ptr<const Transaction> tx, const vnx::bool_t& pre_validate = false) override;

	uint128 get_balance(const addr_t& address, const addr_t& currency) const override;

	uint128 get_total_balance(const std::vector<addr_t>& addresses, const addr_t& currency) const override;

	std::map<addr_t, uint128> get_balances(const addr_t& address) const override;

	std::map<addr_t, balance_t> get_contract_balances(const addr_t& address) const;

	std::map<addr_t, uint128> get_total_balances(const std::vector<addr_t>& addresses) const override;

	std::map<std::pair<addr_t, addr_t>, uint128> get_all_balances(const std::vector<addr_t>& addresses) const override;

	std::vector<exec_entry_t> get_exec_history(const addr_t& address, const int32_t& limit, const vnx::bool_t& recent) const override;

	std::map<std::string, vm::varptr_t> read_storage(const addr_t& contract, const uint32_t& height = -1) const override;

	std::map<uint64_t, vm::varptr_t> dump_storage(const addr_t& contract, const uint32_t& height = -1) const override;

	vm::varptr_t read_storage_var(const addr_t& contract, const uint64_t& address, const uint32_t& height = -1) const override;

	vm::varptr_t read_storage_entry_var(const addr_t& contract, const uint64_t& address, const uint64_t& key, const uint32_t& height = -1) const override;

	std::pair<vm::varptr_t, uint64_t> read_storage_field(const addr_t& contract, const std::string& name, const uint32_t& height = -1) const override;

	std::tuple<vm::varptr_t, uint64_t, uint64_t> read_storage_entry_addr(
			const addr_t& contract, const std::string& name, const addr_t& key, const uint32_t& height = -1) const;

	std::tuple<vm::varptr_t, uint64_t, uint64_t> read_storage_entry_string(
			const addr_t& contract, const std::string& name, const std::string& key, const uint32_t& height = -1) const;

	std::vector<vm::varptr_t> read_storage_array(const addr_t& contract, const uint64_t& address, const uint32_t& height = -1) const override;

	std::map<vm::varptr_t, vm::varptr_t> read_storage_map(const addr_t& contract, const uint64_t& address, const uint32_t& height = -1) const override;

	std::map<std::string, vm::varptr_t> read_storage_object(const addr_t& contract, const uint64_t& address, const uint32_t& height = -1) const override;

	vnx::Variant call_contract(	const addr_t& address, const std::string& method, const std::vector<vnx::Variant>& args = {},
								const vnx::optional<addr_t>& user = nullptr, const vnx::optional<std::pair<addr_t, uint64_t>>& deposit = nullptr) const override;

	uint128 get_total_supply(const addr_t& currency) const override;

	vnx::optional<plot_nft_info_t> get_plot_nft_info(const addr_t& address) const override;

	addr_t get_plot_nft_target(const addr_t& address) const override;

	std::vector<virtual_plot_info_t> get_virtual_plots(const std::vector<addr_t>& addresses) const override;

	std::vector<virtual_plot_info_t> get_virtual_plots_for(const pubkey_t& farmer_key) const override;

	std::vector<virtual_plot_info_t> get_virtual_plots_owned_by(const std::vector<addr_t>& addresses) const override;

	std::shared_ptr<const contract::VirtualPlot> get_virtual_plot(const addr_t& plot_id, const vnx::optional<hash_t>& block_hash) const;

	uint64_t get_virtual_plot_balance(const addr_t& plot_id, const vnx::optional<hash_t>& block_hash) const override;

	offer_data_t get_offer(const addr_t& address) const override;

	std::vector<offer_data_t> fetch_offers(const std::vector<addr_t>& addresses, const vnx::bool_t& state, const vnx::bool_t& closed = false) const override;

	std::vector<offer_data_t> get_offers(const uint32_t& since, const vnx::bool_t& state) const override;

	std::vector<offer_data_t> get_offers_by(const std::vector<addr_t>& owners, const vnx::bool_t& state) const override;

	std::vector<offer_data_t> get_recent_offers(const int32_t& limit, const vnx::bool_t& state) const override;

	std::vector<offer_data_t> get_recent_offers_for(
			const vnx::optional<addr_t>& bid, const vnx::optional<addr_t>& ask, const uint64_t& min_bid,
			const int32_t& limit, const vnx::bool_t& state) const override;

	std::vector<trade_entry_t> get_trade_history(const int32_t& limit, const uint32_t& since = 0) const override;

	std::vector<trade_entry_t> get_trade_history_for(
			const vnx::optional<addr_t>& bid, const vnx::optional<addr_t>& ask, const int32_t& limit, const uint32_t& since = 0) const override;

	std::vector<swap_info_t> get_swaps(const uint32_t& since, const vnx::optional<addr_t>& token, const vnx::optional<addr_t>& currency) const override;

	swap_info_t get_swap_info(const addr_t& address) const override;

	swap_user_info_t get_swap_user_info(const addr_t& address, const addr_t& user) const override;

	std::vector<swap_entry_t> get_swap_history(const addr_t& address, const int32_t& limit) const override;

	std::array<uint128, 2> get_swap_trade_estimate(const addr_t& address, const uint32_t& i, const uint64_t& amount, const int32_t& num_iter) const override;

	std::array<uint128, 2> get_swap_fees_earned(const addr_t& address, const addr_t& user) const override;

	std::array<uint128, 2> get_swap_equivalent_liquidity(const addr_t& address, const addr_t& user) const override;

	std::map<addr_t, std::array<std::pair<addr_t, uint128>, 2>> get_swap_liquidity_by(const std::vector<addr_t>& addresses) const override;

	std::vector<std::shared_ptr<const BlockHeader>> get_farmed_blocks(
			const std::vector<pubkey_t>& farmer_keys, const vnx::bool_t& full_blocks, const uint32_t& since = 0, const int32_t& limit = -1) const override;

	farmed_block_summary_t get_farmed_block_summary(const std::vector<pubkey_t>& farmer_keys, const uint32_t& since = 0) const override;

	std::vector<std::pair<pubkey_t, uint32_t>> get_farmer_ranking(const int32_t& limit) const override;

	std::tuple<pooling_error_e, std::string> verify_plot_nft_target(const addr_t& address, const addr_t& pool_target) const override;

	std::tuple<pooling_error_e, std::string> verify_partial(
			std::shared_ptr<const Partial> partial, const vnx::optional<addr_t>& pool_target) const override;

	void on_stuck_timeout();

	void start_sync(const vnx::bool_t& force) override;

	void revert_sync(const uint32_t& height) override;

	void http_request_async(std::shared_ptr<const vnx::addons::HttpRequest> request, const std::string& sub_path,
							const vnx::request_id_t& request_id) const override;

	void http_request_chunk_async(	std::shared_ptr<const vnx::addons::HttpRequest> request, const std::string& sub_path,
									const int64_t& offset, const int64_t& max_bytes, const vnx::request_id_t& request_id) const override;

	void handle(std::shared_ptr<const Block> block) override;

	void handle(std::shared_ptr<const Transaction> tx) override;

	void handle(std::shared_ptr<const ProofOfTime> proof) override;

	void handle(std::shared_ptr<const ProofResponse> value) override;

	void handle(std::shared_ptr<const VDF_Point> value) override;

	std::shared_ptr<vnx::Value> vnx_call_switch(std::shared_ptr<const vnx::Value> method, const vnx::request_id_t& request_id) override;

private:
	struct waitcond_t {
		std::mutex mutex;
		std::condition_variable signal;
		bool do_wait = true;
	};

	struct execution_context_t {
		uint32_t height = 0;
		std::shared_ptr<vm::StorageCache> storage;
		std::unordered_map<addr_t, std::vector<hash_t>> mutate_map;				// [contract => TX ids]
		std::unordered_map<hash_t, std::unordered_set<hash_t>> wait_map;		// [TX id => TX ids]
		std::unordered_map<hash_t, std::shared_ptr<waitcond_t>> signal_map;		// [TX id => condition]
		void wait(const hash_t& txid) const;
		void signal(const hash_t& txid) const;
		void setup_wait(const hash_t& txid, const addr_t& address);
	};

	struct balance_log_t {
		std::map<std::pair<addr_t, addr_t>, uint128> added;
		std::map<std::pair<addr_t, addr_t>, uint128> removed;
	};

	struct fork_t {
		bool is_invalid = false;
		bool is_verified = false;
		bool is_connected = false;
		bool is_vdf_verified = false;
		bool is_proof_verified = false;
		bool is_all_proof_verified = false;
		int64_t recv_time = 0;
		std::weak_ptr<fork_t> prev;
		std::shared_ptr<const Block> block;
		std::shared_ptr<const VDF_Point> vdf_point;
		std::shared_ptr<const BlockHeader> diff_block;
		std::shared_ptr<const execution_context_t> context;
		balance_log_t balance;
	};

	struct tx_map_t {
		uint32_t height = -1;
		std::shared_ptr<const Transaction> tx;
	};

	struct tx_pool_t {
		bool is_valid = false;
		bool is_skipped = false;
		uint32_t cost = 0;
		uint32_t fee = 0;
		uint32_t luck = 0;	// random value
		std::shared_ptr<const Transaction> tx;
	};

	struct proof_data_t {
		hash_t hash;
		uint32_t height = 0;
		vnx::Hash64 farmer_mac;
		std::shared_ptr<const ProofOfSpace> proof;
	};

	void update();
	void trigger_update();
	void update_control();

	void verify_vdfs();
	void verify_proofs();
	void pre_validate_blocks();
	void verify_block_proofs();

	void print_stats();

	bool recv_height(const uint32_t& height) const;

	void add_fork(std::shared_ptr<fork_t> fork);

	void add_dummy_blocks(const uint32_t& height);

	void add_dummy_block(std::shared_ptr<const BlockHeader> prev);

	bool tx_pool_update(const tx_pool_t& entry, const bool force_add = false);

	void tx_pool_erase(const hash_t& txid);

	void purge_tx_pool();

	void validate_new();

	void on_sync_done(const uint32_t height);

	std::vector<tx_pool_t> validate_for_block(const int64_t deadline_ms);

	std::shared_ptr<const Block> make_block(std::shared_ptr<const BlockHeader> prev, std::shared_ptr<const VDF_Point> vdf_point, const proof_data_t& proof, const bool full_block);

	int get_offer_state(const addr_t& address) const;

	trade_entry_t make_trade_entry(const uint32_t& height, const trade_log_t& log) const;

	std::vector<offer_data_t> fetch_offers_for(
			const std::vector<addr_t>& addresses, const vnx::optional<addr_t>& bid, const vnx::optional<addr_t>& ask,
			const bool state = false, const bool filter = false) const;

	std::tuple<vm::varptr_t, uint64_t, uint64_t> read_storage_entry_var(
			const addr_t& contract, const std::string& name, const vm::varptr_t& key, const uint32_t& height = -1) const;

	void sync_more();

	void sync_result(const uint32_t& height, const std::vector<std::shared_ptr<const Block>>& blocks);

	void fetch_block(const hash_t& hash);

	void fetch_result(const hash_t& hash, std::shared_ptr<const Block> block);

	std::shared_ptr<const BlockHeader> fork_to(const hash_t& state);

	std::shared_ptr<const BlockHeader> fork_to(std::shared_ptr<fork_t> fork_head);

	std::shared_ptr<fork_t> find_best_fork(const uint32_t at_height = -1) const;

	std::vector<std::shared_ptr<fork_t>> get_fork_line(std::shared_ptr<fork_t> fork_head = nullptr) const;

	std::shared_ptr<execution_context_t> validate(std::shared_ptr<const Block> block) const;

	std::shared_ptr<execution_context_t> new_exec_context(const uint32_t height) const;

	void prepare_context(std::shared_ptr<execution_context_t> context, std::shared_ptr<const Transaction> tx) const;

	void execute(	std::shared_ptr<const Transaction> tx,
					std::shared_ptr<const execution_context_t> context,
					std::shared_ptr<const operation::Execute> op,
					std::shared_ptr<const Contract> contract,
					const addr_t& address,
					std::vector<txout_t>& exec_outputs,
					std::map<std::pair<addr_t, addr_t>, uint128>& exec_spend_map,
					std::shared_ptr<vm::StorageCache> storage_cache,
					uint64_t& tx_cost, exec_error_t& error, const bool is_public) const;

	void execute(	std::shared_ptr<const Transaction> tx,
					std::shared_ptr<const execution_context_t> context,
					std::shared_ptr<const contract::Executable> executable,
					std::vector<txout_t>& exec_outputs,
					std::map<std::pair<addr_t, addr_t>, uint128>& exec_spend_map,
					std::shared_ptr<vm::StorageCache> storage_cache,
					std::shared_ptr<vm::Engine> engine,
					const std::string& method_name,
					exec_error_t& error, const bool is_public) const;

	std::shared_ptr<const exec_result_t> validate(
			std::shared_ptr<const Transaction> tx, std::shared_ptr<const execution_context_t> context) const;

	void validate_diff_adjust(const uint64_t& block, const uint64_t& prev) const;

	void commit(std::shared_ptr<const Block> block);

	void purge_tree();

	void update_farmer_ranking();

	void add_proof(	const uint32_t height, const hash_t& challenge,
					std::shared_ptr<const ProofOfSpace> proof, const vnx::Hash64 farmer_mac);

	bool verify(std::shared_ptr<const ProofResponse> value);

	void verify_proof(std::shared_ptr<fork_t> fork, const hash_t& challenge) const;

	template<typename T>
	uint256_t verify_proof_impl(std::shared_ptr<const T> proof, const hash_t& challenge, const uint64_t space_diff) const;

	void verify_proof(
			std::shared_ptr<const ProofOfSpace> proof, const hash_t& challenge,
			std::shared_ptr<const BlockHeader> diff_block,
			const vnx::optional<uint64_t>& space_diff = nullptr) const;

	void verify_vdf(std::shared_ptr<const ProofOfTime> proof) const;

	void verify_vdf(std::shared_ptr<const ProofOfTime> proof, const uint32_t chain) const;

	void verify_vdf_success(std::shared_ptr<const ProofOfTime> proof, std::shared_ptr<const VDF_Point> point);

	void verify_vdf_failed(std::shared_ptr<const ProofOfTime> proof);

	void verify_vdf_task(std::shared_ptr<const ProofOfTime> proof) const noexcept;

	void check_vdf_task(std::shared_ptr<fork_t> fork, std::shared_ptr<const BlockHeader> prev, std::shared_ptr<const BlockHeader> infuse) const noexcept;

	void apply(	std::shared_ptr<const Block> block,
				std::shared_ptr<const execution_context_t> context, bool is_replay = false);

	void apply(	std::shared_ptr<const Block> block,
				std::shared_ptr<const Transaction> tx,
				uint32_t& counter);

	void revert(const uint32_t height);

	std::shared_ptr<const BlockHeader> get_root() const;

	std::shared_ptr<const BlockHeader> get_peak() const;

	std::shared_ptr<const BlockHeader> get_block_ex(const hash_t& hash, bool full_block) const;

	std::shared_ptr<const BlockHeader> get_block_at_ex(const uint32_t& height, bool full_block) const;

	std::shared_ptr<fork_t> find_fork(const hash_t& hash) const;

	std::shared_ptr<fork_t> find_prev_fork(std::shared_ptr<fork_t> fork, const size_t distance = 1) const;

	std::shared_ptr<const BlockHeader> find_prev_header(
			std::shared_ptr<const BlockHeader> block, const size_t distance = 1, bool clamped = false) const;

	std::shared_ptr<const BlockHeader> find_diff_header(std::shared_ptr<const BlockHeader> block, uint32_t offset = 0) const;

	std::shared_ptr<const BlockHeader> get_diff_header(std::shared_ptr<const BlockHeader> block, uint32_t offset = 0) const;

	bool find_challenge(std::shared_ptr<const BlockHeader> block, hash_t& challenge, uint32_t offset = 0) const;

	std::shared_ptr<const VDF_Point> find_vdf_point(const uint32_t height, const uint64_t vdf_start, const uint64_t vdf_iters,
			const std::array<hash_t, 2>& input, const std::array<hash_t, 2>& output) const;

	std::shared_ptr<const VDF_Point> find_vdf_point(std::shared_ptr<const BlockHeader> block) const;

	std::shared_ptr<const VDF_Point> find_next_vdf_point(std::shared_ptr<const BlockHeader> block) const;

	std::vector<proof_data_t> find_proof(const hash_t& challenge) const;

	uint64_t calc_block_reward(std::shared_ptr<const BlockHeader> block, const uint64_t total_fees) const;

	vnx::optional<addr_t> get_vdf_reward_addr(std::shared_ptr<const BlockHeader> block) const;

	std::shared_ptr<const BlockHeader> read_block(vnx::File& file, bool full_block = true,
			int64_t* block_offset = nullptr, std::vector<int64_t>* tx_offsets = nullptr) const;

	void write_block(std::shared_ptr<const Block> block);

	template<typename T>
	std::shared_ptr<const T> get_contract_as(const addr_t& address, uint64_t* read_cost = nullptr, const uint64_t gas_limit = 0) const;

	std::shared_ptr<const Contract> get_contract_ex(const addr_t& address, uint64_t* read_cost = nullptr, const uint64_t gas_limit = 0) const;

	std::shared_ptr<const Contract> get_contract_for_ex(const addr_t& address, uint64_t* read_cost = nullptr, const uint64_t gas_limit = 0) const;

	void async_api_call(std::shared_ptr<const vnx::Value> method, const vnx::request_id_t& request_id);

private:
	hash_t state_hash;
	std::shared_ptr<DataBase> db;

	hash_uint_uint_table<addr_t, uint32_t, uint32_t, txio_entry_t> recv_log;	// [[address, height, counter] => entry]
	hash_uint_uint_table<addr_t, uint32_t, uint32_t, txio_entry_t> spend_log;	// [[address, height, counter] => entry]
	hash_uint_uint_table<addr_t, uint32_t, uint32_t, exec_entry_t> exec_log;	// [[address, height, counter] => entry]
	hash_uint_uint_table<hash_t, uint32_t, uint32_t, txio_entry_t> memo_log;	// [[hash(address | memo), height, counter] => entry]

	hash_table<addr_t, std::shared_ptr<const Contract>> contract_map;			// [address, contract]
	hash_uint_uint_table<hash_t, uint32_t, uint32_t, addr_t> contract_log;		// [[type hash, height, counter] => contract]
	hash_uint_uint_table<addr_t, uint32_t, uint32_t, std::pair<addr_t, hash_t>> deploy_map;	// [[sender, height, counter] => [contract, type]]
	hash_uint_uint_table<addr_t, uint32_t, uint32_t, std::pair<addr_t, hash_t>> owner_map;	// [[owner, height, counter] => [contract, type]]

	hash_uint_uint_table<addr_t, uint32_t, uint32_t, addr_t> offer_bid_map;			// [[currency, height, counter] => contract]
	hash_uint_uint_table<addr_t, uint32_t, uint32_t, addr_t> offer_ask_map;			// [[currency, height, counter] => contract]
	hash_uint_uint_table<hash_t, uint32_t, uint32_t, bool> trade_index;				// [hash(bid, ask), height, counter]
	uint_uint_table<uint32_t, uint32_t, trade_log_t> trade_log;						// [[height, counter] => info]

	balance_table_t<uint128> balance_table;										// [[address, currency] => balance]
	balance_table_t<std::array<uint128, 2>> swap_liquid_map;					// [[address, swap] => [amount, amount]]
	hash_table<addr_t, uint128> total_supply_map;								// [currency => supply]

	std::unordered_map<hash_t, tx_pool_t> tx_pool;									// [txid => transaction] (non-executed only)
	std::unordered_map<addr_t, uint64_t> tx_pool_fees;								// [address => total pending fees]
	std::unordered_map<hash_t, std::shared_ptr<fork_t>> fork_tree;					// [block hash => fork] (pending only)
	std::multimap<uint32_t, std::shared_ptr<fork_t>> fork_index;					// [height => fork] (pending only)
	std::map<uint32_t, std::shared_ptr<const BlockHeader>> history;					// [height => block header] (finalized only)

	std::multimap<uint32_t, std::shared_ptr<const VDF_Point>> verified_vdfs;		// [height => output]
	std::multimap<uint32_t, std::shared_ptr<const ProofOfTime>> pending_vdfs;		// [height => proof]

	std::unordered_map<hash_t, std::vector<proof_data_t>> proof_map;				// [challenge => best proofs]
	std::unordered_multimap<uint32_t, hash_t> challenge_map;						// [height => challenge]
	std::map<std::pair<uint32_t, hash_t>, hash_t> created_blocks;					// [[height, proof hash] => block hash]
	std::unordered_set<hash_t> purged_blocks;

	bool is_synced = false;
	bool update_pending = false;
	uint32_t min_pool_fee_ratio = 0;
	uint64_t mmx_address_count = 0;

	std::shared_ptr<vnx::File> block_chain;
	std::shared_ptr<vm::StorageDB> storage;

	hash_table<hash_t, uint32_t> hash_index;									// [block hash => height]
	hash_table<hash_t, tx_index_t> tx_index;									// [txid => index]
	uint_table<uint32_t, block_index_t> block_index;							// [height => index]
	uint_table<uint32_t, std::vector<hash_t>> tx_log;							// [height => txids]

	hash_multi_table<pubkey_t, addr_t> vplot_map;							// [farmer key => contract]
	hash_multi_table<pubkey_t, farmed_block_info_t> farmer_block_map;		// [farmer key => info]

	std::vector<std::pair<pubkey_t, uint32_t>> farmer_ranking;				// sorted by count DSC [farmer key => num. blocks]

	uint32_t sync_pos = 0;									// current sync height
	uint32_t sync_retry = 0;
	uint32_t synced_since = 0;								// height of last sync done
	int64_t sync_finish_ms = 0;								// when peak was reached
	double max_sync_pending = 0;
	std::set<uint32_t> sync_pending;						// set of heights
	vnx::optional<uint32_t> sync_peak;						// max height we can sync
	std::unordered_set<hash_t> fetch_pending;				// block hash

	std::vector<std::shared_ptr<fork_t>> pending_forks;
	std::vector<std::shared_ptr<const ProofResponse>> pending_proofs;
	std::unordered_map<hash_t, std::shared_ptr<const Transaction>> tx_queue;

	std::shared_mutex db_mutex;								// covers DB as well as history
	std::shared_ptr<vnx::ThreadPool> threads;
	std::shared_ptr<vnx::ThreadPool> api_threads;			// executed under shared db_mutex lock
	std::shared_ptr<vnx::Timer> stuck_timer;
	std::shared_ptr<vnx::Timer> update_timer;

	mutable std::mutex mutex;
	mutable std::shared_ptr<const NetworkInfo> network;
	mutable std::unordered_map<addr_t, std::shared_ptr<const Contract>> contract_cache;

	std::shared_ptr<const ChainParams> params;
	std::shared_ptr<RouterAsyncClient> router;
	std::shared_ptr<TimeLordAsyncClient> timelord;
	std::shared_ptr<vnx::addons::HttpInterface<Node>> http;

	mutable std::mutex vdf_mutex;
	std::unordered_set<uint32_t> vdf_verify_pending;		// height
	std::vector<std::shared_ptr<OCL_VDF>> opencl_vdf;
	std::shared_ptr<vnx::ThreadPool> vdf_threads;

	std::mutex fetch_mutex;
	int reward_vote = 0;
	std::set<std::string> pending_fetch;
	std::shared_ptr<vnx::ThreadPool> fetch_threads;

	friend class vnx::addons::HttpInterface<Node>;

};


template<typename T>
std::shared_ptr<const T> Node::get_contract_as(const addr_t& address, uint64_t* read_cost, const uint64_t gas_limit) const
{
	return std::dynamic_pointer_cast<const T>(get_contract_ex(address, read_cost, gas_limit));
}


} // mmx

#endif /* INCLUDE_MMX_NODE_H_ */
