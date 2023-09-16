
// AUTO GENERATED by vnxcppcodegen

#include <mmx/contract/package.hxx>
#include <mmx/contract/Binary_num_bytes.hxx>
#include <mmx/contract/Binary_num_bytes_return.hxx>
#include <vnx/Value.h>

#include <vnx/vnx.h>


namespace mmx {
namespace contract {


const vnx::Hash64 Binary_num_bytes::VNX_TYPE_HASH(0xf3677c6845a332b8ull);
const vnx::Hash64 Binary_num_bytes::VNX_CODE_HASH(0x94abd3b7971a6d9dull);

vnx::Hash64 Binary_num_bytes::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string Binary_num_bytes::get_type_name() const {
	return "mmx.contract.Binary.num_bytes";
}

const vnx::TypeCode* Binary_num_bytes::get_type_code() const {
	return mmx::contract::vnx_native_type_code_Binary_num_bytes;
}

std::shared_ptr<Binary_num_bytes> Binary_num_bytes::create() {
	return std::make_shared<Binary_num_bytes>();
}

std::shared_ptr<vnx::Value> Binary_num_bytes::clone() const {
	return std::make_shared<Binary_num_bytes>(*this);
}

void Binary_num_bytes::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void Binary_num_bytes::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void Binary_num_bytes::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::contract::vnx_native_type_code_Binary_num_bytes;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, total);
	_visitor.type_end(*_type_code);
}

void Binary_num_bytes::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.contract.Binary.num_bytes\"";
	_out << ", \"total\": "; vnx::write(_out, total);
	_out << "}";
}

void Binary_num_bytes::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object Binary_num_bytes::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.contract.Binary.num_bytes";
	_object["total"] = total;
	return _object;
}

void Binary_num_bytes::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "total") {
			_entry.second.to(total);
		}
	}
}

vnx::Variant Binary_num_bytes::get_field(const std::string& _name) const {
	if(_name == "total") {
		return vnx::Variant(total);
	}
	return vnx::Variant();
}

void Binary_num_bytes::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "total") {
		_value.to(total);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const Binary_num_bytes& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, Binary_num_bytes& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* Binary_num_bytes::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> Binary_num_bytes::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.contract.Binary.num_bytes";
	type_code->type_hash = vnx::Hash64(0xf3677c6845a332b8ull);
	type_code->code_hash = vnx::Hash64(0x94abd3b7971a6d9dull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->is_method = true;
	type_code->native_size = sizeof(::mmx::contract::Binary_num_bytes);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<Binary_num_bytes>(); };
	type_code->is_const = true;
	type_code->return_type = ::mmx::contract::Binary_num_bytes_return::static_get_type_code();
	type_code->fields.resize(1);
	{
		auto& field = type_code->fields[0];
		field.data_size = 1;
		field.name = "total";
		field.value = vnx::to_string(true);
		field.code = {31};
	}
	type_code->build();
	return type_code;
}


} // namespace mmx
} // namespace contract


namespace vnx {

void read(TypeInput& in, ::mmx::contract::Binary_num_bytes& value, const TypeCode* type_code, const uint16_t* code) {
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
			vnx::read_value(_buf + _field->offset, value.total, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::contract::Binary_num_bytes& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::contract::vnx_native_type_code_Binary_num_bytes;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::contract::Binary_num_bytes>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	char* const _buf = out.write(1);
	vnx::write_value(_buf + 0, value.total);
}

void read(std::istream& in, ::mmx::contract::Binary_num_bytes& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::contract::Binary_num_bytes& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::contract::Binary_num_bytes& value) {
	value.accept(visitor);
}

} // vnx
