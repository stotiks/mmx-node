/*
 * PubKey.cpp
 *
 *  Created on: Dec 10, 2021
 *      Author: mad
 */

#include <mmx/contract/PubKey.hxx>
#include <mmx/solution/PubKey.hxx>
#include <mmx/write_bytes.h>


namespace mmx {
namespace contract {

vnx::bool_t PubKey::is_valid() const
{
	return Super::is_valid() && address != addr_t();
}

hash_t PubKey::calc_hash(const vnx::bool_t& full_hash) const
{
	std::vector<uint8_t> buffer;
	vnx::VectorOutputStream stream(&buffer);
	vnx::OutputBuffer out(&stream);

	write_bytes(out, get_type_hash());
	write_field(out, "version", version);
	write_field(out, "address", address);
	out.flush();

	return hash_t(buffer);
}

uint64_t PubKey::calc_cost(std::shared_ptr<const ChainParams> params) const {
	return 0;
}

std::vector<addr_t> PubKey::get_dependency() const {
	return {};
}

vnx::optional<addr_t> PubKey::get_owner() const {
	return address;
}

std::vector<txout_t> PubKey::validate(std::shared_ptr<const Operation> operation, std::shared_ptr<const Context> context) const
{
	if(auto solution = std::dynamic_pointer_cast<const solution::PubKey>(operation->solution))
	{
		if(solution->pubkey.get_addr() != address) {
			throw std::logic_error("invalid pubkey");
		}
		if(!solution->signature.verify(solution->pubkey, context->txid)) {
			throw std::logic_error("invalid signature");
		}
		return {};
	}
	throw std::logic_error("invalid solution");
}


} // contract
} // mmx
