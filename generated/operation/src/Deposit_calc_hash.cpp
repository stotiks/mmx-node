
// AUTO GENERATED by vnxcppcodegen

#include <mmx/operation/package.hxx>
#include <mmx/operation/Deposit_calc_hash.hxx>
#include <mmx/operation/Deposit_calc_hash_return.hxx>
#include <vnx/Value.h>

#include <vnx/vnx.h>


namespace mmx {
namespace operation {


const vnx::Hash64 Deposit_calc_hash::VNX_TYPE_HASH(0xf3578512360fc2f4ull);
const vnx::Hash64 Deposit_calc_hash::VNX_CODE_HASH(0x8008b459862ecf48ull);

vnx::Hash64 Deposit_calc_hash::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string Deposit_calc_hash::get_type_name() const {
	return "mmx.operation.Deposit.calc_hash";
}

const vnx::TypeCode* Deposit_calc_hash::get_type_code() const {
	return mmx::operation::vnx_native_type_code_Deposit_calc_hash;
}

std::shared_ptr<Deposit_calc_hash> Deposit_calc_hash::create() {
	return std::make_shared<Deposit_calc_hash>();
}

std::shared_ptr<vnx::Value> Deposit_calc_hash::clone() const {
	return std::make_shared<Deposit_calc_hash>(*this);
}

void Deposit_calc_hash::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void Deposit_calc_hash::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void Deposit_calc_hash::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::operation::vnx_native_type_code_Deposit_calc_hash;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, full_hash);
	_visitor.type_end(*_type_code);
}

void Deposit_calc_hash::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.operation.Deposit.calc_hash\"";
	_out << ", \"full_hash\": "; vnx::write(_out, full_hash);
	_out << "}";
}

void Deposit_calc_hash::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object Deposit_calc_hash::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.operation.Deposit.calc_hash";
	_object["full_hash"] = full_hash;
	return _object;
}

void Deposit_calc_hash::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "full_hash") {
			_entry.second.to(full_hash);
		}
	}
}

vnx::Variant Deposit_calc_hash::get_field(const std::string& _name) const {
	if(_name == "full_hash") {
		return vnx::Variant(full_hash);
	}
	return vnx::Variant();
}

void Deposit_calc_hash::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "full_hash") {
		_value.to(full_hash);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const Deposit_calc_hash& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, Deposit_calc_hash& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* Deposit_calc_hash::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> Deposit_calc_hash::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.operation.Deposit.calc_hash";
	type_code->type_hash = vnx::Hash64(0xf3578512360fc2f4ull);
	type_code->code_hash = vnx::Hash64(0x8008b459862ecf48ull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->is_method = true;
	type_code->native_size = sizeof(::mmx::operation::Deposit_calc_hash);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<Deposit_calc_hash>(); };
	type_code->is_const = true;
	type_code->return_type = ::mmx::operation::Deposit_calc_hash_return::static_get_type_code();
	type_code->fields.resize(1);
	{
		auto& field = type_code->fields[0];
		field.data_size = 1;
		field.name = "full_hash";
		field.code = {31};
	}
	type_code->build();
	return type_code;
}


} // namespace mmx
} // namespace operation


namespace vnx {

void read(TypeInput& in, ::mmx::operation::Deposit_calc_hash& value, const TypeCode* type_code, const uint16_t* code) {
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
			vnx::read_value(_buf + _field->offset, value.full_hash, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::operation::Deposit_calc_hash& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::operation::vnx_native_type_code_Deposit_calc_hash;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::operation::Deposit_calc_hash>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	char* const _buf = out.write(1);
	vnx::write_value(_buf + 0, value.full_hash);
}

void read(std::istream& in, ::mmx::operation::Deposit_calc_hash& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::operation::Deposit_calc_hash& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::operation::Deposit_calc_hash& value) {
	value.accept(visitor);
}

} // vnx
