/*
 * StorageRAM.cpp
 *
 *  Created on: Apr 30, 2022
 *      Author: mad
 */

#include <mmx/vm/StorageRAM.h>


namespace mmx {
namespace vm {

StorageRAM::~StorageRAM()
{
	clear();
}

std::unique_ptr<var_t> StorageRAM::read(const addr_t& contract, const uint64_t src) const
{
	std::lock_guard lock(mutex);

	auto iter = memory.find(std::make_pair(contract, src));
	if(iter != memory.end()) {
		return clone(iter->second.get());
	}
	return nullptr;
}

std::unique_ptr<var_t> StorageRAM::read(const addr_t& contract, const uint64_t src, const uint64_t key) const
{
	std::lock_guard lock(mutex);

	auto iter = entries.find(std::make_tuple(contract, src, key));
	if(iter != entries.end()) {
		return clone(iter->second.get());
	}
	return nullptr;
}

void StorageRAM::write(const addr_t& contract, const uint64_t dst, const var_t& value)
{
	const auto key = std::make_pair(contract, dst);

	std::lock_guard lock(mutex);

	auto& var = memory[key];
	if(var) {
		if(var->flags & FLAG_KEY) {
			throw std::logic_error("cannot overwrite key");
		}
	}
	var = clone(value);

	if(value.flags & FLAG_KEY) {
		key_map[contract][var.get()] = dst;
	}
}

void StorageRAM::write(const addr_t& contract, const uint64_t dst, const uint64_t key, const var_t& value)
{
	const auto mapkey = std::make_tuple(contract, dst, key);

	std::lock_guard lock(mutex);

	entries[mapkey] = clone(value);
}

uint64_t StorageRAM::lookup(const addr_t& contract, const var_t& value) const
{
	std::lock_guard lock(mutex);

	auto iter = key_map.find(contract);
	if(iter != key_map.end()) {
		const auto& map = iter->second;
		auto iter2 = map.find(&value);
		if(iter2 != map.end()) {
			return iter2->second;
		}
	}
	return 0;
}

void StorageRAM::clear()
{
	std::lock_guard lock(mutex);

	key_map.clear();
	memory.clear();
	entries.clear();
	balance_map.clear();
}

void StorageRAM::set_balance(const addr_t& contract, const addr_t& currency, const uint128& amount)
{
	std::lock_guard lock(mutex);

	balance_map[contract][currency] = amount;
}

std::unique_ptr<uint128> StorageRAM::get_balance(const addr_t& contract, const addr_t& currency)
{
	std::lock_guard lock(mutex);

	auto iter = balance_map.find(contract);
	if(iter != balance_map.end()) {
		const auto& map = iter->second;
		auto iter2 = map.find(currency);
		if(iter2 != map.end()) {
			return std::make_unique<uint128>(iter2->second);
		}
	}
	return nullptr;
}

void StorageRAM::dump_memory(std::ostream& out) const
{
	auto dump_entries = [this, &out](const addr_t& address)
	{
		for(auto iter = entries.lower_bound(std::make_tuple(address, 0, 0)); iter != entries.upper_bound(std::make_tuple(address, -1, -1)); ++iter)
		{
			out << "[" << to_hex(std::get<1>(iter->first)) << "]"
					<< "[" << to_hex(std::get<2>(iter->first)) << "] " << to_string(iter->second.get());
			if(auto var = iter->second.get()) {
				out << "\t\t(vf: " << to_bin(var->flags) << ")";
			}
			out << std::endl;
		}
	};

	const addr_t* curr_addr = nullptr;

	for(auto iter = memory.begin(); iter != memory.end(); ++iter)
	{
		if(!curr_addr || iter->first.first != *curr_addr) {
			if(curr_addr) {
				dump_entries(*curr_addr);
			}
			curr_addr = &iter->first.first;
			out << "[" << curr_addr->to_string() << "]" << std::endl;
		}
		out << "[" << to_hex(iter->first.second) << "] " << to_string(iter->second.get());
		if(auto var = iter->second.get()) {
			out << "\t\t(vf: " << to_bin(var->flags) << ") (rc: " << var->ref_count << ")";
		}
		out << std::endl;
	}
	if(curr_addr) {
		dump_entries(*curr_addr);
	}
}


} // vm
} // mmx
