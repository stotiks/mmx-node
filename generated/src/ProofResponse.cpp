
// AUTO GENERATED by vnxcppcodegen

#include <mmx/package.hxx>
#include <mmx/ProofResponse.hxx>
#include <mmx/Challenge.hxx>
#include <mmx/ProofOfSpace.hxx>
#include <mmx/ProofResponse_calc_hash.hxx>
#include <mmx/ProofResponse_calc_hash_return.hxx>
#include <mmx/ProofResponse_is_valid.hxx>
#include <mmx/ProofResponse_is_valid_return.hxx>
#include <mmx/ProofResponse_validate.hxx>
#include <mmx/ProofResponse_validate_return.hxx>
#include <mmx/bls_signature_t.hpp>
#include <mmx/hash_t.hpp>
#include <vnx/Hash64.hpp>
#include <vnx/Value.h>

#include <vnx/vnx.h>


namespace mmx {


const vnx::Hash64 ProofResponse::VNX_TYPE_HASH(0x816e898b36befae0ull);
const vnx::Hash64 ProofResponse::VNX_CODE_HASH(0x3caf955822fdae28ull);

vnx::Hash64 ProofResponse::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string ProofResponse::get_type_name() const {
	return "mmx.ProofResponse";
}

const vnx::TypeCode* ProofResponse::get_type_code() const {
	return mmx::vnx_native_type_code_ProofResponse;
}

std::shared_ptr<ProofResponse> ProofResponse::create() {
	return std::make_shared<ProofResponse>();
}

std::shared_ptr<vnx::Value> ProofResponse::clone() const {
	return std::make_shared<ProofResponse>(*this);
}

void ProofResponse::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void ProofResponse::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void ProofResponse::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::vnx_native_type_code_ProofResponse;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, hash);
	_visitor.type_field(_type_code->fields[1], 1); vnx::accept(_visitor, request);
	_visitor.type_field(_type_code->fields[2], 2); vnx::accept(_visitor, proof);
	_visitor.type_field(_type_code->fields[3], 3); vnx::accept(_visitor, farmer_sig);
	_visitor.type_field(_type_code->fields[4], 4); vnx::accept(_visitor, farmer_addr);
	_visitor.type_field(_type_code->fields[5], 5); vnx::accept(_visitor, harvester);
	_visitor.type_field(_type_code->fields[6], 6); vnx::accept(_visitor, lookup_time_ms);
	_visitor.type_field(_type_code->fields[7], 7); vnx::accept(_visitor, content_hash);
	_visitor.type_end(*_type_code);
}

void ProofResponse::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.ProofResponse\"";
	_out << ", \"hash\": "; vnx::write(_out, hash);
	_out << ", \"request\": "; vnx::write(_out, request);
	_out << ", \"proof\": "; vnx::write(_out, proof);
	_out << ", \"farmer_sig\": "; vnx::write(_out, farmer_sig);
	_out << ", \"farmer_addr\": "; vnx::write(_out, farmer_addr);
	_out << ", \"harvester\": "; vnx::write(_out, harvester);
	_out << ", \"lookup_time_ms\": "; vnx::write(_out, lookup_time_ms);
	_out << ", \"content_hash\": "; vnx::write(_out, content_hash);
	_out << "}";
}

void ProofResponse::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object ProofResponse::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.ProofResponse";
	_object["hash"] = hash;
	_object["request"] = request;
	_object["proof"] = proof;
	_object["farmer_sig"] = farmer_sig;
	_object["farmer_addr"] = farmer_addr;
	_object["harvester"] = harvester;
	_object["lookup_time_ms"] = lookup_time_ms;
	_object["content_hash"] = content_hash;
	return _object;
}

void ProofResponse::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "content_hash") {
			_entry.second.to(content_hash);
		} else if(_entry.first == "farmer_addr") {
			_entry.second.to(farmer_addr);
		} else if(_entry.first == "farmer_sig") {
			_entry.second.to(farmer_sig);
		} else if(_entry.first == "harvester") {
			_entry.second.to(harvester);
		} else if(_entry.first == "hash") {
			_entry.second.to(hash);
		} else if(_entry.first == "lookup_time_ms") {
			_entry.second.to(lookup_time_ms);
		} else if(_entry.first == "proof") {
			_entry.second.to(proof);
		} else if(_entry.first == "request") {
			_entry.second.to(request);
		}
	}
}

vnx::Variant ProofResponse::get_field(const std::string& _name) const {
	if(_name == "hash") {
		return vnx::Variant(hash);
	}
	if(_name == "request") {
		return vnx::Variant(request);
	}
	if(_name == "proof") {
		return vnx::Variant(proof);
	}
	if(_name == "farmer_sig") {
		return vnx::Variant(farmer_sig);
	}
	if(_name == "farmer_addr") {
		return vnx::Variant(farmer_addr);
	}
	if(_name == "harvester") {
		return vnx::Variant(harvester);
	}
	if(_name == "lookup_time_ms") {
		return vnx::Variant(lookup_time_ms);
	}
	if(_name == "content_hash") {
		return vnx::Variant(content_hash);
	}
	return vnx::Variant();
}

void ProofResponse::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "hash") {
		_value.to(hash);
	} else if(_name == "request") {
		_value.to(request);
	} else if(_name == "proof") {
		_value.to(proof);
	} else if(_name == "farmer_sig") {
		_value.to(farmer_sig);
	} else if(_name == "farmer_addr") {
		_value.to(farmer_addr);
	} else if(_name == "harvester") {
		_value.to(harvester);
	} else if(_name == "lookup_time_ms") {
		_value.to(lookup_time_ms);
	} else if(_name == "content_hash") {
		_value.to(content_hash);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const ProofResponse& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, ProofResponse& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* ProofResponse::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> ProofResponse::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.ProofResponse";
	type_code->type_hash = vnx::Hash64(0x816e898b36befae0ull);
	type_code->code_hash = vnx::Hash64(0x3caf955822fdae28ull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->native_size = sizeof(::mmx::ProofResponse);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<ProofResponse>(); };
	type_code->methods.resize(3);
	type_code->methods[0] = ::mmx::ProofResponse_calc_hash::static_get_type_code();
	type_code->methods[1] = ::mmx::ProofResponse_is_valid::static_get_type_code();
	type_code->methods[2] = ::mmx::ProofResponse_validate::static_get_type_code();
	type_code->fields.resize(8);
	{
		auto& field = type_code->fields[0];
		field.is_extended = true;
		field.name = "hash";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[1];
		field.is_extended = true;
		field.name = "request";
		field.code = {16};
	}
	{
		auto& field = type_code->fields[2];
		field.is_extended = true;
		field.name = "proof";
		field.code = {16};
	}
	{
		auto& field = type_code->fields[3];
		field.is_extended = true;
		field.name = "farmer_sig";
		field.code = {11, 96, 1};
	}
	{
		auto& field = type_code->fields[4];
		field.is_extended = true;
		field.name = "farmer_addr";
		field.code = {4};
	}
	{
		auto& field = type_code->fields[5];
		field.is_extended = true;
		field.name = "harvester";
		field.code = {32};
	}
	{
		auto& field = type_code->fields[6];
		field.data_size = 8;
		field.name = "lookup_time_ms";
		field.code = {8};
	}
	{
		auto& field = type_code->fields[7];
		field.is_extended = true;
		field.name = "content_hash";
		field.code = {11, 32, 1};
	}
	type_code->build();
	return type_code;
}

std::shared_ptr<vnx::Value> ProofResponse::vnx_call_switch(std::shared_ptr<const vnx::Value> _method) {
	switch(_method->get_type_hash()) {
		case 0x4f34bfc7bf487289ull: {
			auto _args = std::static_pointer_cast<const ::mmx::ProofResponse_calc_hash>(_method);
			auto _return_value = ::mmx::ProofResponse_calc_hash_return::create();
			_return_value->_ret_0 = calc_hash(_args->full_hash);
			return _return_value;
		}
		case 0xc52089d6664814f3ull: {
			auto _args = std::static_pointer_cast<const ::mmx::ProofResponse_is_valid>(_method);
			auto _return_value = ::mmx::ProofResponse_is_valid_return::create();
			_return_value->_ret_0 = is_valid();
			return _return_value;
		}
		case 0xe49f1a206c26abb6ull: {
			auto _args = std::static_pointer_cast<const ::mmx::ProofResponse_validate>(_method);
			auto _return_value = ::mmx::ProofResponse_validate_return::create();
			validate();
			return _return_value;
		}
	}
	return nullptr;
}


} // namespace mmx


namespace vnx {

void read(TypeInput& in, ::mmx::ProofResponse& value, const TypeCode* type_code, const uint16_t* code) {
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
		if(const auto* const _field = type_code->field_map[6]) {
			vnx::read_value(_buf + _field->offset, value.lookup_time_ms, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			case 0: vnx::read(in, value.hash, type_code, _field->code.data()); break;
			case 1: vnx::read(in, value.request, type_code, _field->code.data()); break;
			case 2: vnx::read(in, value.proof, type_code, _field->code.data()); break;
			case 3: vnx::read(in, value.farmer_sig, type_code, _field->code.data()); break;
			case 4: vnx::read(in, value.farmer_addr, type_code, _field->code.data()); break;
			case 5: vnx::read(in, value.harvester, type_code, _field->code.data()); break;
			case 7: vnx::read(in, value.content_hash, type_code, _field->code.data()); break;
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::ProofResponse& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::vnx_native_type_code_ProofResponse;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::ProofResponse>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	char* const _buf = out.write(8);
	vnx::write_value(_buf + 0, value.lookup_time_ms);
	vnx::write(out, value.hash, type_code, type_code->fields[0].code.data());
	vnx::write(out, value.request, type_code, type_code->fields[1].code.data());
	vnx::write(out, value.proof, type_code, type_code->fields[2].code.data());
	vnx::write(out, value.farmer_sig, type_code, type_code->fields[3].code.data());
	vnx::write(out, value.farmer_addr, type_code, type_code->fields[4].code.data());
	vnx::write(out, value.harvester, type_code, type_code->fields[5].code.data());
	vnx::write(out, value.content_hash, type_code, type_code->fields[7].code.data());
}

void read(std::istream& in, ::mmx::ProofResponse& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::ProofResponse& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::ProofResponse& value) {
	value.accept(visitor);
}

} // vnx
