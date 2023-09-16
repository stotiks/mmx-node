
// AUTO GENERATED by vnxcppcodegen

#include <mmx/contract/package.hxx>
#include <mmx/contract/PubKey.hxx>
#include <mmx/ChainParams.hxx>
#include <mmx/Contract.hxx>
#include <mmx/Contract_calc_cost.hxx>
#include <mmx/Contract_calc_cost_return.hxx>
#include <mmx/Contract_calc_hash.hxx>
#include <mmx/Contract_calc_hash_return.hxx>
#include <mmx/Contract_get_owner.hxx>
#include <mmx/Contract_get_owner_return.hxx>
#include <mmx/Contract_is_locked.hxx>
#include <mmx/Contract_is_locked_return.hxx>
#include <mmx/Contract_is_valid.hxx>
#include <mmx/Contract_is_valid_return.hxx>
#include <mmx/Contract_num_bytes.hxx>
#include <mmx/Contract_num_bytes_return.hxx>
#include <mmx/Contract_read_field.hxx>
#include <mmx/Contract_read_field_return.hxx>
#include <mmx/Contract_validate.hxx>
#include <mmx/Contract_validate_return.hxx>
#include <mmx/Solution.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/contract/PubKey_calc_cost.hxx>
#include <mmx/contract/PubKey_calc_cost_return.hxx>
#include <mmx/contract/PubKey_calc_hash.hxx>
#include <mmx/contract/PubKey_calc_hash_return.hxx>
#include <mmx/contract/PubKey_get_owner.hxx>
#include <mmx/contract/PubKey_get_owner_return.hxx>
#include <mmx/contract/PubKey_is_valid.hxx>
#include <mmx/contract/PubKey_is_valid_return.hxx>
#include <mmx/contract/PubKey_num_bytes.hxx>
#include <mmx/contract/PubKey_num_bytes_return.hxx>
#include <mmx/contract/PubKey_read_field.hxx>
#include <mmx/contract/PubKey_read_field_return.hxx>
#include <mmx/contract/PubKey_validate.hxx>
#include <mmx/contract/PubKey_validate_return.hxx>
#include <mmx/hash_t.hpp>
#include <vnx/Variant.hpp>

#include <vnx/vnx.h>


namespace mmx {
namespace contract {


const vnx::Hash64 PubKey::VNX_TYPE_HASH(0x9b3cd508d7f41423ull);
const vnx::Hash64 PubKey::VNX_CODE_HASH(0xd94be3121579efceull);

vnx::Hash64 PubKey::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string PubKey::get_type_name() const {
	return "mmx.contract.PubKey";
}

const vnx::TypeCode* PubKey::get_type_code() const {
	return mmx::contract::vnx_native_type_code_PubKey;
}

std::shared_ptr<PubKey> PubKey::create() {
	return std::make_shared<PubKey>();
}

std::shared_ptr<vnx::Value> PubKey::clone() const {
	return std::make_shared<PubKey>(*this);
}

void PubKey::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void PubKey::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void PubKey::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::contract::vnx_native_type_code_PubKey;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, version);
	_visitor.type_field(_type_code->fields[1], 1); vnx::accept(_visitor, address);
	_visitor.type_end(*_type_code);
}

void PubKey::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.contract.PubKey\"";
	_out << ", \"version\": "; vnx::write(_out, version);
	_out << ", \"address\": "; vnx::write(_out, address);
	_out << "}";
}

void PubKey::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object PubKey::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.contract.PubKey";
	_object["version"] = version;
	_object["address"] = address;
	return _object;
}

void PubKey::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "address") {
			_entry.second.to(address);
		} else if(_entry.first == "version") {
			_entry.second.to(version);
		}
	}
}

vnx::Variant PubKey::get_field(const std::string& _name) const {
	if(_name == "version") {
		return vnx::Variant(version);
	}
	if(_name == "address") {
		return vnx::Variant(address);
	}
	return vnx::Variant();
}

void PubKey::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "version") {
		_value.to(version);
	} else if(_name == "address") {
		_value.to(address);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const PubKey& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, PubKey& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* PubKey::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> PubKey::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.contract.PubKey";
	type_code->type_hash = vnx::Hash64(0x9b3cd508d7f41423ull);
	type_code->code_hash = vnx::Hash64(0xd94be3121579efceull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->native_size = sizeof(::mmx::contract::PubKey);
	type_code->parents.resize(1);
	type_code->parents[0] = ::mmx::Contract::static_get_type_code();
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<PubKey>(); };
	type_code->methods.resize(15);
	type_code->methods[0] = ::mmx::Contract_calc_cost::static_get_type_code();
	type_code->methods[1] = ::mmx::Contract_calc_hash::static_get_type_code();
	type_code->methods[2] = ::mmx::Contract_get_owner::static_get_type_code();
	type_code->methods[3] = ::mmx::Contract_is_locked::static_get_type_code();
	type_code->methods[4] = ::mmx::Contract_is_valid::static_get_type_code();
	type_code->methods[5] = ::mmx::Contract_num_bytes::static_get_type_code();
	type_code->methods[6] = ::mmx::Contract_read_field::static_get_type_code();
	type_code->methods[7] = ::mmx::Contract_validate::static_get_type_code();
	type_code->methods[8] = ::mmx::contract::PubKey_calc_cost::static_get_type_code();
	type_code->methods[9] = ::mmx::contract::PubKey_calc_hash::static_get_type_code();
	type_code->methods[10] = ::mmx::contract::PubKey_get_owner::static_get_type_code();
	type_code->methods[11] = ::mmx::contract::PubKey_is_valid::static_get_type_code();
	type_code->methods[12] = ::mmx::contract::PubKey_num_bytes::static_get_type_code();
	type_code->methods[13] = ::mmx::contract::PubKey_read_field::static_get_type_code();
	type_code->methods[14] = ::mmx::contract::PubKey_validate::static_get_type_code();
	type_code->fields.resize(2);
	{
		auto& field = type_code->fields[0];
		field.data_size = 4;
		field.name = "version";
		field.code = {3};
	}
	{
		auto& field = type_code->fields[1];
		field.is_extended = true;
		field.name = "address";
		field.code = {11, 32, 1};
	}
	type_code->build();
	return type_code;
}

std::shared_ptr<vnx::Value> PubKey::vnx_call_switch(std::shared_ptr<const vnx::Value> _method) {
	switch(_method->get_type_hash()) {
		case 0xb23d047adf8b2612ull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_calc_cost>(_method);
			auto _return_value = ::mmx::Contract_calc_cost_return::create();
			_return_value->_ret_0 = calc_cost(_args->params);
			return _return_value;
		}
		case 0x622fcf1cba1952edull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_calc_hash>(_method);
			auto _return_value = ::mmx::Contract_calc_hash_return::create();
			_return_value->_ret_0 = calc_hash(_args->full_hash);
			return _return_value;
		}
		case 0x8fe2c64fdc8f0680ull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_get_owner>(_method);
			auto _return_value = ::mmx::Contract_get_owner_return::create();
			_return_value->_ret_0 = get_owner();
			return _return_value;
		}
		case 0x9b7981d03b3aeab6ull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_is_locked>(_method);
			auto _return_value = ::mmx::Contract_is_locked_return::create();
			_return_value->_ret_0 = is_locked(_args->height);
			return _return_value;
		}
		case 0xe3adf9b29a723217ull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_is_valid>(_method);
			auto _return_value = ::mmx::Contract_is_valid_return::create();
			_return_value->_ret_0 = is_valid();
			return _return_value;
		}
		case 0x4599864a67f75305ull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_num_bytes>(_method);
			auto _return_value = ::mmx::Contract_num_bytes_return::create();
			_return_value->_ret_0 = num_bytes(_args->total);
			return _return_value;
		}
		case 0xeff036bd3bb1c0ull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_read_field>(_method);
			auto _return_value = ::mmx::Contract_read_field_return::create();
			_return_value->_ret_0 = read_field(_args->name);
			return _return_value;
		}
		case 0xc2126a44901c8d52ull: {
			auto _args = std::static_pointer_cast<const ::mmx::Contract_validate>(_method);
			auto _return_value = ::mmx::Contract_validate_return::create();
			validate(_args->solution, _args->txid);
			return _return_value;
		}
		case 0x502d1edce44719b3ull: {
			auto _args = std::static_pointer_cast<const ::mmx::contract::PubKey_calc_cost>(_method);
			auto _return_value = ::mmx::contract::PubKey_calc_cost_return::create();
			_return_value->_ret_0 = calc_cost(_args->params);
			return _return_value;
		}
		case 0x803fd5ba81d56d4cull: {
			auto _args = std::static_pointer_cast<const ::mmx::contract::PubKey_calc_hash>(_method);
			auto _return_value = ::mmx::contract::PubKey_calc_hash_return::create();
			_return_value->_ret_0 = calc_hash(_args->full_hash);
			return _return_value;
		}
		case 0x6df2dce9e7433921ull: {
			auto _args = std::static_pointer_cast<const ::mmx::contract::PubKey_get_owner>(_method);
			auto _return_value = ::mmx::contract::PubKey_get_owner_return::create();
			_return_value->_ret_0 = get_owner();
			return _return_value;
		}
		case 0xe97fdd91c060e967ull: {
			auto _args = std::static_pointer_cast<const ::mmx::contract::PubKey_is_valid>(_method);
			auto _return_value = ::mmx::contract::PubKey_is_valid_return::create();
			_return_value->_ret_0 = is_valid();
			return _return_value;
		}
		case 0xa7899cec5c3b6ca4ull: {
			auto _args = std::static_pointer_cast<const ::mmx::contract::PubKey_num_bytes>(_method);
			auto _return_value = ::mmx::contract::PubKey_num_bytes_return::create();
			_return_value->_ret_0 = num_bytes(_args->total);
			return _return_value;
		}
		case 0x8178b9776d46e140ull: {
			auto _args = std::static_pointer_cast<const ::mmx::contract::PubKey_read_field>(_method);
			auto _return_value = ::mmx::contract::PubKey_read_field_return::create();
			_return_value->_ret_0 = read_field(_args->name);
			return _return_value;
		}
		case 0xc8c04e67ca0e5622ull: {
			auto _args = std::static_pointer_cast<const ::mmx::contract::PubKey_validate>(_method);
			auto _return_value = ::mmx::contract::PubKey_validate_return::create();
			validate(_args->solution, _args->txid);
			return _return_value;
		}
	}
	return nullptr;
}


} // namespace mmx
} // namespace contract


namespace vnx {

void read(TypeInput& in, ::mmx::contract::PubKey& value, const TypeCode* type_code, const uint16_t* code) {
	if(code) {
		switch(code[0]) {
			case CODE_OBJECT:
			case CODE_ALT_OBJECT: {
				Object tmp;
				vnx::read(in, tmp, type_code, code);
				value.from_object(tmp);
				return;
			}
			case CODE_DYNAMIC:
			case CODE_ALT_DYNAMIC:
				vnx::read_dynamic(in, value);
				return;
		}
	}
	if(!type_code) {
		vnx::skip(in, type_code, code);
		return;
	}
	if(code) {
		switch(code[0]) {
			case CODE_STRUCT: type_code = type_code->depends[code[1]]; break;
			case CODE_ALT_STRUCT: type_code = type_code->depends[vnx::flip_bytes(code[1])]; break;
			default: {
				vnx::skip(in, type_code, code);
				return;
			}
		}
	}
	const char* const _buf = in.read(type_code->total_field_size);
	if(type_code->is_matched) {
		if(const auto* const _field = type_code->field_map[0]) {
			vnx::read_value(_buf + _field->offset, value.version, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			case 1: vnx::read(in, value.address, type_code, _field->code.data()); break;
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::contract::PubKey& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::contract::vnx_native_type_code_PubKey;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::contract::PubKey>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	char* const _buf = out.write(4);
	vnx::write_value(_buf + 0, value.version);
	vnx::write(out, value.address, type_code, type_code->fields[1].code.data());
}

void read(std::istream& in, ::mmx::contract::PubKey& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::contract::PubKey& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::contract::PubKey& value) {
	value.accept(visitor);
}

} // vnx
