/*
 * Binary.cpp
 *
 *  Created on: Sep 7, 2022
 *      Author: mad
 */


#include <mmx/contract/PubKey.hxx>
#include <mmx/contract/Binary.hxx>
#include <mmx/operation/Execute.hxx>
#include <mmx/write_bytes.h>


namespace mmx {
namespace contract {

bool Binary::is_valid() const
{
	for(const auto& entry : methods) {
		const auto& method = entry.second;
		if(method.is_payable && method.is_const) {
			return false;
		}
	}
	return Super::is_valid();
}

hash_t Binary::calc_hash(const vnx::bool_t& full_hash) const
{
	std::vector<uint8_t> buffer;
	vnx::VectorOutputStream stream(&buffer);
	vnx::OutputBuffer out(&stream);

	write_bytes(out, get_type_hash());
	write_field(out, "version", 	version);
	write_field(out, "name", 		name);
	write_field(out, "fields", 		fields);
	write_field(out, "methods", 	methods);
	write_field(out, "constant", 	constant);
	write_field(out, "binary", 		binary);
	write_field(out, "source", 		source);
	write_field(out, "compiler", 	compiler);
	out.flush();

	return hash_t(buffer);
}

uint64_t Binary::calc_cost(std::shared_ptr<const ChainParams> params) const
{
	uint64_t payload = 0;
	for(const auto& entry : fields) {
		payload += 4 + entry.first.size() + 4;
	}
	for(const auto& entry : methods) {
		payload += 4 + entry.first.size() + entry.second.num_bytes();
	}
	payload += constant.size() + binary.size();

	return Super::calc_cost(params) + payload * params->min_txfee_byte;
}


} // contract
} // mmx