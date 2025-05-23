
// AUTO GENERATED by vnxcppcodegen

#include <mmx/package.hxx>
#include <mmx/Wallet_offer_withdraw.hxx>
#include <mmx/Wallet_offer_withdraw_return.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/spend_options_t.hxx>
#include <vnx/Value.h>

#include <vnx/vnx.h>


namespace mmx {


const vnx::Hash64 Wallet_offer_withdraw::VNX_TYPE_HASH(0x790a334fbf5dd1e6ull);
const vnx::Hash64 Wallet_offer_withdraw::VNX_CODE_HASH(0x4ab2d90a638d2787ull);

vnx::Hash64 Wallet_offer_withdraw::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string Wallet_offer_withdraw::get_type_name() const {
	return "mmx.Wallet.offer_withdraw";
}

const vnx::TypeCode* Wallet_offer_withdraw::get_type_code() const {
	return mmx::vnx_native_type_code_Wallet_offer_withdraw;
}

std::shared_ptr<Wallet_offer_withdraw> Wallet_offer_withdraw::create() {
	return std::make_shared<Wallet_offer_withdraw>();
}

std::shared_ptr<vnx::Value> Wallet_offer_withdraw::clone() const {
	return std::make_shared<Wallet_offer_withdraw>(*this);
}

void Wallet_offer_withdraw::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void Wallet_offer_withdraw::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void Wallet_offer_withdraw::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::vnx_native_type_code_Wallet_offer_withdraw;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, index);
	_visitor.type_field(_type_code->fields[1], 1); vnx::accept(_visitor, address);
	_visitor.type_field(_type_code->fields[2], 2); vnx::accept(_visitor, options);
	_visitor.type_end(*_type_code);
}

void Wallet_offer_withdraw::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.Wallet.offer_withdraw\"";
	_out << ", \"index\": "; vnx::write(_out, index);
	_out << ", \"address\": "; vnx::write(_out, address);
	_out << ", \"options\": "; vnx::write(_out, options);
	_out << "}";
}

void Wallet_offer_withdraw::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object Wallet_offer_withdraw::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.Wallet.offer_withdraw";
	_object["index"] = index;
	_object["address"] = address;
	_object["options"] = options;
	return _object;
}

void Wallet_offer_withdraw::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "address") {
			_entry.second.to(address);
		} else if(_entry.first == "index") {
			_entry.second.to(index);
		} else if(_entry.first == "options") {
			_entry.second.to(options);
		}
	}
}

vnx::Variant Wallet_offer_withdraw::get_field(const std::string& _name) const {
	if(_name == "index") {
		return vnx::Variant(index);
	}
	if(_name == "address") {
		return vnx::Variant(address);
	}
	if(_name == "options") {
		return vnx::Variant(options);
	}
	return vnx::Variant();
}

void Wallet_offer_withdraw::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "index") {
		_value.to(index);
	} else if(_name == "address") {
		_value.to(address);
	} else if(_name == "options") {
		_value.to(options);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const Wallet_offer_withdraw& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, Wallet_offer_withdraw& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* Wallet_offer_withdraw::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> Wallet_offer_withdraw::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.Wallet.offer_withdraw";
	type_code->type_hash = vnx::Hash64(0x790a334fbf5dd1e6ull);
	type_code->code_hash = vnx::Hash64(0x4ab2d90a638d2787ull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->is_method = true;
	type_code->native_size = sizeof(::mmx::Wallet_offer_withdraw);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<Wallet_offer_withdraw>(); };
	type_code->depends.resize(1);
	type_code->depends[0] = ::mmx::spend_options_t::static_get_type_code();
	type_code->is_const = true;
	type_code->return_type = ::mmx::Wallet_offer_withdraw_return::static_get_type_code();
	type_code->fields.resize(3);
	{
		auto& field = type_code->fields[0];
		field.data_size = 4;
		field.name = "index";
		field.code = {3};
	}
	{
		auto& field = type_code->fields[1];
		field.is_extended = true;
		field.name = "address";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[2];
		field.is_extended = true;
		field.name = "options";
		field.code = {19, 0};
	}
	type_code->permission = "mmx.permission_e.SPENDING";
	type_code->build();
	return type_code;
}


} // namespace mmx


namespace vnx {

void read(TypeInput& in, ::mmx::Wallet_offer_withdraw& value, const TypeCode* type_code, const uint16_t* code) {
	TypeInput::recursion_t tag(in);
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
	const auto* const _buf = in.read(type_code->total_field_size);
	if(type_code->is_matched) {
		if(const auto* const _field = type_code->field_map[0]) {
			vnx::read_value(_buf + _field->offset, value.index, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			case 1: vnx::read(in, value.address, type_code, _field->code.data()); break;
			case 2: vnx::read(in, value.options, type_code, _field->code.data()); break;
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::Wallet_offer_withdraw& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::vnx_native_type_code_Wallet_offer_withdraw;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::Wallet_offer_withdraw>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	auto* const _buf = out.write(4);
	vnx::write_value(_buf + 0, value.index);
	vnx::write(out, value.address, type_code, type_code->fields[1].code.data());
	vnx::write(out, value.options, type_code, type_code->fields[2].code.data());
}

void read(std::istream& in, ::mmx::Wallet_offer_withdraw& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::Wallet_offer_withdraw& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::Wallet_offer_withdraw& value) {
	value.accept(visitor);
}

} // vnx
