/*
 * Router.h
 *
 *  Created on: Dec 17, 2021
 *      Author: mad
 */

#ifndef INCLUDE_MMX_ROUTER_H_
#define INCLUDE_MMX_ROUTER_H_

#include <mmx/RouterBase.hxx>
#include <mmx/ReceiveNote.hxx>
#include <mmx/NodeAsyncClient.hxx>

#include <vnx/Buffer.hpp>
#include <vnx/Input.hpp>
#include <vnx/Output.hpp>
#include <vnx/ThreadPool.h>

#include <vnx/addons/HttpInterface.h>

#include <random>


namespace mmx {

class Router : public RouterBase {
public:
	Router(const std::string& _vnx_name);

protected:
	void init() override;

	void main() override;

	void discover() override;

	hash_t get_id() const override;

	node_info_t get_info() const override;

	std::pair<pubkey_t, signature_t> sign_msg(const hash_t& msg) const override;

	std::vector<std::string> get_peers(const uint32_t& max_count) const override;

	std::vector<std::string> get_known_peers() const override;

	std::vector<std::string> get_connected_peers() const override;

	std::shared_ptr<const PeerInfo> get_peer_info() const override;

	std::vector<std::pair<std::string, uint32_t>> get_farmer_credits() const override;

	void get_blocks_at_async(const uint32_t& height, const vnx::request_id_t& request_id) const override;

	void fetch_block_async(const hash_t& hash, const vnx::optional<std::string>& address, const vnx::request_id_t& request_id) const override;

	void fetch_block_at_async(const uint32_t& height, const std::string& address, const vnx::request_id_t& request_id) const override;

	void http_request_async(std::shared_ptr<const vnx::addons::HttpRequest> request, const std::string& sub_path,
							const vnx::request_id_t& request_id) const override;

	void http_request_chunk_async(	std::shared_ptr<const vnx::addons::HttpRequest> request, const std::string& sub_path,
									const int64_t& offset, const int64_t& max_bytes, const vnx::request_id_t& request_id) const override;

	void handle(std::shared_ptr<const Block> value);

	void handle(std::shared_ptr<const Transaction> value);

	void handle(std::shared_ptr<const ProofOfTime> value);

	void handle(std::shared_ptr<const ProofResponse> value);

private:
	struct send_item_t {
		bool reliable = false;
		hash_t hash;
		std::shared_ptr<const vnx::Value> value;
	};

	struct peer_t : Super::peer_t {
		bool is_synced = false;
		bool is_blocked = false;
		bool is_outbound = false;
		uint32_t height = 0;
		uint32_t credits = 0;
		uint64_t tx_credits = 0;
		int32_t ping_ms = 0;
		int64_t last_receive_ms = 0;
		int64_t connected_since_ms = 0;
		hash_t challenge;
		node_info_t info;
		std::string address;
		vnx::optional<hash_t> node_id;
		std::queue<hash_t> hash_queue;
		std::unordered_set<hash_t> sent_hashes;
		std::map<int64_t, send_item_t> send_queue;
	};

	struct hash_info_t {
		bool is_valid = false;
		bool is_rewarded = false;
		bool did_relay = false;
		bool did_notify = false;
		uint64_t received_from = -1;
	};

	struct sync_job_t {
		bool is_done = false;
		uint32_t height = 0;
		int64_t start_time_ms = 0;
		std::unordered_set<uint64_t> failed;
		std::unordered_set<uint64_t> pending;
		std::unordered_set<uint64_t> succeeded;
		std::unordered_map<uint32_t, uint64_t> request_map;				// [request id, client]
		std::unordered_map<hash_t, std::shared_ptr<const Block>> blocks;
	};

	struct fetch_job_t {
		bool is_done = false;
		vnx::optional<hash_t> hash;
		vnx::optional<uint32_t> height;
		vnx::optional<std::string> from_peer;
		int64_t start_time_ms = 0;
		std::unordered_set<uint64_t> failed;
		std::unordered_set<uint64_t> pending;
		std::unordered_map<uint32_t, uint64_t> request_map;				// [request id, client]
	};

	void send();

	void update();

	bool process(std::shared_ptr<const Return> ret = nullptr);

	void connect();

	void query();

	void save_data();

	void add_peer(const std::string& address, const int sock);

	void ban_peer(uint64_t client, const std::string& reason);

	void connect_task(const std::string& peer) noexcept;

	void print_stats() override;

	uint32_t send_request(std::shared_ptr<peer_t> peer, std::shared_ptr<const vnx::Value> method, bool reliable = true);

	uint32_t send_request(uint64_t client, std::shared_ptr<const vnx::Value> method, bool reliable = true);

	void on_vdf(uint64_t client, std::shared_ptr<const ProofOfTime> proof);

	void on_block(uint64_t client, std::shared_ptr<const Block> block);

	void on_proof(uint64_t client, std::shared_ptr<const ProofResponse> response);

	void on_transaction(uint64_t client, std::shared_ptr<const Transaction> tx);

	void on_recv_note(uint64_t client, std::shared_ptr<const ReceiveNote> note);

	void recv_notify(const hash_t& msg_hash, const uint64_t* source);

	void relay(uint64_t source, std::shared_ptr<const vnx::Value> msg, const hash_t& msg_hash, const std::set<node_type_e>& filter);

	void broadcast(std::shared_ptr<const vnx::Value> msg, const hash_t& msg_hash, const std::set<node_type_e>& filter, bool reliable = true);

	void send_to(std::vector<std::shared_ptr<peer_t>> peers, std::shared_ptr<const vnx::Value> msg, const hash_t& msg_hash, bool reliable);

	bool send_to(uint64_t client, std::shared_ptr<const vnx::Value> msg, bool reliable = true);

	bool send_to(std::shared_ptr<peer_t> peer, std::shared_ptr<const vnx::Value> msg, bool reliable = true);

	void send_all(std::shared_ptr<const vnx::Value> msg, const std::set<node_type_e>& filter, bool reliable = true);

	template<typename R, typename T>
	void send_result(uint64_t client, uint32_t id, const T& value);

	void on_error(uint64_t client, uint32_t id, const vnx::exception& ex);

	void on_request(uint64_t client, std::shared_ptr<const Request> msg);

	void on_return(uint64_t client, std::shared_ptr<const Return> msg);

	void on_msg(uint64_t client, std::shared_ptr<const vnx::Value> msg);

	void on_pause(uint64_t client) override;

	void on_resume(uint64_t client) override;

	void on_connect(uint64_t client, const std::string& address) override;

	void on_disconnect(uint64_t client) override;

	std::shared_ptr<Super::peer_t> get_peer_base(uint64_t client) const override;

	std::shared_ptr<peer_t> get_peer(uint64_t client) const;

	std::shared_ptr<peer_t> find_peer(uint64_t client) const;

	bool relay_msg_hash(const hash_t& hash, uint32_t credits = 0);

	bool receive_msg_hash(const hash_t& hash, uint64_t client);

private:
	bool is_connected = false;

	hash_t node_id;
	skey_t node_sk;
	pubkey_t node_key;
	std::set<std::string> peer_set;
	std::set<std::string> self_addrs;
	std::set<std::string> connecting_peers;

	std::set<uint64_t> synced_peers;
	std::unordered_map<uint64_t, std::shared_ptr<peer_t>> peer_map;

	std::queue<hash_t> hash_queue;
	std::unordered_map<hash_t, hash_info_t> hash_info;

	std::map<hash_t, uint32_t> farmer_credits;

	mutable std::unordered_map<vnx::request_id_t, std::shared_ptr<sync_job_t>> sync_jobs;
	mutable std::unordered_map<vnx::request_id_t, std::shared_ptr<fetch_job_t>> fetch_jobs;

	struct {
		uint32_t height = -1;
		hash_t our_hash;
		std::unordered_map<hash_t, size_t> hash_count;
		std::unordered_map<uint32_t, uint64_t> request_map;
	} fork_check;

	vnx::ThreadPool* connect_threads = nullptr;
	std::shared_ptr<NodeAsyncClient> node;
	std::shared_ptr<const ChainParams> params;

	mutable std::default_random_engine rand_engine;

	uint32_t next_request_id = 0;
	uint32_t verified_peak_height = 0;
	int64_t last_query_ms = 0;

	size_t tx_counter = 0;
	size_t vdf_counter = 0;
	size_t block_counter = 0;
	size_t proof_counter = 0;
	size_t upload_counter = 0;

	size_t drop_counter = 0;
	size_t tx_drop_counter = 0;
	size_t vdf_drop_counter = 0;
	size_t proof_drop_counter = 0;
	size_t block_drop_counter = 0;

	std::shared_ptr<vnx::addons::HttpInterface<Router>> http;

	friend class vnx::addons::HttpInterface<Router>;

};


} // mmx

#endif /* INCLUDE_MMX_ROUTER_H_ */
