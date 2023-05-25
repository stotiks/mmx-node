/*
 * VirtualPlot.cpp
 *
 *  Created on: Apr 13, 2022
 *      Author: mad
 */

#include <mmx/contract/VirtualPlot.hxx>
#include <mmx/write_bytes.h>


namespace mmx {
namespace contract {

vnx::bool_t VirtualPlot::is_valid() const
{
	return Super::is_valid() && farmer_key != bls_pubkey_t() && (!reward_address || *reward_address != addr_t());
}

hash_t VirtualPlot::calc_hash(const vnx::bool_t& full_hash) const
{
	std::vector<uint8_t> buffer;
	vnx::VectorOutputStream stream(&buffer);
	vnx::OutputBuffer out(&stream);

	write_bytes(out, get_type_hash());
	write_field(out, "version", 	version);
	write_field(out, "name", 		name);
	write_field(out, "symbol", 		symbol);
	write_field(out, "decimals", 	decimals);
	write_field(out, "binary", 		binary);
	write_field(out, "init_method", init_method);
	write_field(out, "init_args", 	init_args);
	write_field(out, "depends", 	depends);
	write_field(out, "farmer_key", 		farmer_key);
	write_field(out, "reward_address", 	reward_address);
	out.flush();

	return hash_t(buffer);
}

uint64_t VirtualPlot::calc_cost(std::shared_ptr<const ChainParams> params, const vnx::bool_t& is_read) const
{
	const auto num_bytes = 48 + (reward_address ? 32 : 0);

	return Super::calc_cost(params, is_read)
			+ num_bytes * (is_read ? params->min_txfee_read_byte : params->min_txfee_byte);
}

vnx::Variant VirtualPlot::read_field(const std::string& name) const
{
	if(name == "farmer_key") {
		return vnx::Variant(farmer_key.to_string());
	}
	if(name == "reward_address") {
		return reward_address ? vnx::Variant(reward_address->to_string()) : vnx::Variant(nullptr);
	}
	return Super::read_field(name);
}


} // contract
} // mmx
