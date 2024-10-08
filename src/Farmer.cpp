/*
 * Farmer.cpp
 *
 *  Created on: Dec 12, 2021
 *      Author: mad
 */

#include <mmx/Farmer.h>
#include <mmx/Transaction.hxx>
#include <mmx/ProofOfSpaceOG.hxx>
#include <mmx/utils.h>


namespace mmx {

Farmer::Farmer(const std::string& _vnx_name)
	:	FarmerBase(_vnx_name)
{
}

void Farmer::init()
{
	pipe = vnx::open_pipe(vnx_name, this, 1000);
	pipe->pause();

	vnx::open_pipe(vnx_get_id(), this, 1000);

	subscribe(input_info, 1000);
	subscribe(input_proofs, 10000);
	subscribe(input_partials, 10000);
}

void Farmer::main()
{
	if(reward_addr) {
		if(*reward_addr == addr_t()) {
			reward_addr = nullptr;
		} else {
			log(INFO) << "Reward address: " << reward_addr->to_string();
		}
	}
	params = get_params();

	wallet = std::make_shared<WalletAsyncClient>(wallet_server);
	wallet->vnx_set_non_blocking(true);
	add_async_client(wallet);

	set_timer_millis(60 * 1000, std::bind(&Farmer::update, this));

	update();

	Super::main();
}

vnx::Hash64 Farmer::get_mac_addr() const
{
	return vnx_get_id();
}

uint64_t Farmer::get_partial_diff(const addr_t& plot_nft) const
{
	// TODO
	return 1;
}

std::map<addr_t, uint64_t> Farmer::get_partial_diffs(const std::vector<addr_t>& plot_nfts) const
{
	std::map<addr_t, uint64_t> out;
	for(const auto& addr : plot_nfts) {
		out[addr] = get_partial_diff(addr);
	}
	return out;
}

std::vector<pubkey_t> Farmer::get_farmer_keys() const
{
	std::vector<pubkey_t> out;
	for(const auto& entry : key_map) {
		out.push_back(entry.first);
	}
	return out;
}

std::shared_ptr<const FarmInfo> Farmer::get_farm_info() const
{
	auto info = FarmInfo::create();
	for(const auto& entry : info_map) {
		if(auto value = std::dynamic_pointer_cast<const FarmInfo>(entry.second->value)) {
			if(value->harvester) {
				auto& entry = info->harvester_bytes[*value->harvester];
				entry.first += value->total_bytes;
				entry.second += value->total_bytes_effective;
			}
			for(const auto& entry : value->plot_count) {
				info->plot_count[entry.first] += entry.second;
			}
			for(const auto& dir : value->plot_dirs) {
				info->plot_dirs.push_back((value->harvester ? *value->harvester + ":" : "") + dir);
			}
			for(const auto& entry : value->pool_info) {
				auto& dst = info->pool_info[entry.first];
				const auto prev_count = dst.plot_count;
				dst = entry.second;
				dst.plot_count += prev_count;
				dst.partial_diff = get_partial_diff(dst.contract);
			}
			info->total_bytes += value->total_bytes;
			info->total_bytes_effective += value->total_bytes_effective;
			info->total_balance += value->total_balance;
		}
	}
	return info;
}

void Farmer::update()
{
	vnx::open_flow(vnx::get_pipe(node_server), vnx::get_pipe(vnx_get_id()));

	wallet->get_all_farmer_keys(
		[this](const std::vector<std::pair<skey_t, pubkey_t>>& list) {
			for(const auto& keys : list) {
				if(key_map.emplace(keys.second, keys.first).second) {
					log(INFO) << "Got Farmer Key: " << keys.second;
				}
			}
			pipe->resume();
		},
		[this](const vnx::exception& ex) {
			log(WARN) << "Failed to get keys from wallet: " << ex.what();
		});

	if(!reward_addr) {
		wallet->get_all_accounts(
			[this](const std::vector<account_info_t>& accounts) {
				if(!reward_addr) {
					for(const auto& entry : accounts) {
						if(entry.address) {
							reward_addr = entry.address;
							break;
						}
					}
					if(reward_addr) {
						log(INFO) << "Reward address: " << reward_addr->to_string();
					} else {
						log(WARN) << "Failed to get reward address from wallet: no wallet available";
					}
				}
			},
			[this](const vnx::exception& ex) {
				log(WARN) << "Failed to get reward address from wallet: " << ex.what();
			});
	}

	const auto now = vnx::get_sync_time_micros();
	for(auto iter = info_map.begin(); iter != info_map.end();) {
		if((now - iter->second->recv_time) / 1000000 > harvester_timeout) {
			iter = info_map.erase(iter);
		} else {
			iter++;
		}
	}
}

void Farmer::handle(std::shared_ptr<const FarmInfo> value)
{
	if(auto sample = vnx_sample) {
		if(value->harvester_id) {
			info_map[*value->harvester_id] = sample;
		} else if(value->harvester) {
			info_map[hash_t(*value->harvester)] = sample;
		}
	}
}

void Farmer::handle(std::shared_ptr<const ProofResponse> value) try
{
	if(!value->is_valid()) {
		throw std::logic_error("invalid proof");
	}
	const skey_t farmer_sk = get_skey(value->proof->farmer_key);

	auto out = vnx::clone(value);
	out->farmer_sig = signature_t::sign(farmer_sk, value->hash);
	out->content_hash = out->calc_hash(true);
	publish(out, output_proofs);
}
catch(const std::exception& ex) {
	log(WARN) << "Failed to sign proof from harvester '" << value->harvester << "' due to: " << ex.what();
}

void Farmer::handle(std::shared_ptr<const Partial> value) try
{
	if(!value->proof) {
		return;
	}
	auto out = vnx::clone(value);
	if(reward_addr) {
		out->account = *reward_addr;
	} else {
		log(WARN) << "Using plot NFT owner as fallback payout address: " << out->account.to_string();
	}
	out->hash = out->calc_hash();

	const auto farmer_sk = get_skey(value->proof->farmer_key);
	out->farmer_sig = signature_t::sign(farmer_sk, out->hash);

	// TODO: send request

	publish(out, output_partials);
}
catch(const std::exception& ex) {
	log(WARN) << "Failed to process partial from harvester '" << value->harvester << "' due to: " << ex.what();
}

skey_t Farmer::get_skey(const pubkey_t& pubkey) const
{
	auto iter = key_map.find(pubkey);
	if(iter == key_map.end()) {
		throw std::logic_error("unknown farmer key: " + pubkey.to_string());
	}
	return iter->second;
}

std::shared_ptr<const BlockHeader>
Farmer::sign_block(std::shared_ptr<const BlockHeader> block) const
{
	if(!block) {
		throw std::logic_error("!block");
	}
	if(!block->proof) {
		throw std::logic_error("!proof");
	}
	const auto farmer_sk = get_skey(block->proof->farmer_key);

	auto out = vnx::clone(block);
	out->nonce = vnx::rand64();

	if(!out->reward_addr || std::dynamic_pointer_cast<const ProofOfSpaceOG>(block->proof)) {
		out->reward_addr = reward_addr;
	}
	out->hash = out->calc_hash().first;
	out->farmer_sig = signature_t::sign(farmer_sk, out->hash);
	out->content_hash = out->calc_hash().second;
	return out;
}


} // mmx
