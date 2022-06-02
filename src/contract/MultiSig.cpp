/*
 * MultiSig.cpp
 *
 *  Created on: Jan 15, 2022
 *      Author: mad
 */

#include <mmx/contract/MultiSig.hxx>
#include <mmx/solution/MultiSig.hxx>
#include <mmx/solution/PubKey.hxx>
#include <mmx/write_bytes.h>


namespace mmx {
namespace contract {

vnx::bool_t MultiSig::is_valid() const
{
	return Super::is_valid() && num_required > 0 && owners.size() >= num_required && owners.size() <= MAX_OWNERS;
}

hash_t MultiSig::calc_hash(const vnx::bool_t& full_hash) const
{
	std::vector<uint8_t> buffer;
	vnx::VectorOutputStream stream(&buffer);
	vnx::OutputBuffer out(&stream);

	write_bytes(out, get_type_hash());
	write_field(out, "version", version);
	write_field(out, "owners", owners);
	out.flush();

	return hash_t(buffer);
}

uint64_t MultiSig::calc_cost(std::shared_ptr<const ChainParams> params) const
{
	return 32 * owners.size() * params->min_txfee_byte;
}

std::vector<txout_t> MultiSig::validate(std::shared_ptr<const Operation> operation, std::shared_ptr<const Context> context) const
{
	if(auto solution = std::dynamic_pointer_cast<const solution::PubKey>(operation->solution))
	{
		if(num_required != 1) {
			throw std::logic_error("invalid solution");
		}
		const auto addr = solution->pubkey.get_addr();

		for(const auto& owner : owners) {
			if(addr == owner) {
				if(!solution->signature.verify(solution->pubkey, context->txid)) {
					throw std::logic_error("invalid signature");
				}
				return {};
			}
		}
		throw std::logic_error("no such owner");
	}
	if(auto solution = std::dynamic_pointer_cast<const solution::MultiSig>(operation->solution))
	{
		if(solution->solutions.size() != owners.size()) {
			throw std::logic_error("solutions count mismatch");
		}
		uint32_t count = 0;
		for(size_t i = 0; i < owners.size(); ++i)
		{
			if(const auto& sol = solution->solutions[i])
			{
				if(auto solution = std::dynamic_pointer_cast<const solution::PubKey>(sol))
				{
					if(solution->pubkey.get_addr() != owners[i]) {
						throw std::logic_error("invalid pubkey at index " + std::to_string(i));
					}
					if(!solution->signature.verify(solution->pubkey, context->txid)) {
						throw std::logic_error("invalid signature at index " + std::to_string(i));
					}
					count++;
				}
			}
		}
		if(count < num_required) {
			throw std::logic_error("insufficient signatures: " + std::to_string(count) + " < " + std::to_string(num_required));
		}
		return {};
	}
	throw std::logic_error("invalid solution");
}

void MultiSig::add_owner(const addr_t& address)
{
	owners.push_back(address);
}

void MultiSig::rem_owner(const addr_t& address)
{
	while(true) {
		auto iter = std::find(owners.begin(), owners.end(), address);
		if(iter != owners.end()) {
			owners.erase(iter);
		} else {
			break;
		}
	}
}

void MultiSig::set_num_required(const uint32_t& count)
{
	num_required = count;
}


} // contract
} // mmx
