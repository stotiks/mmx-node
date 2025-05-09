
// AUTO GENERATED by vnxcppcodegen

#include <mmx/package.hxx>
#include <mmx/KeyFile.hxx>
#include <mmx/hash_t.hpp>
#include <vnx/Value.h>

#include <vnx/vnx.h>


namespace mmx {


const vnx::Hash64 KeyFile::VNX_TYPE_HASH(0xdf868931a939cba1ull);
const vnx::Hash64 KeyFile::VNX_CODE_HASH(0x35062c98e95706b2ull);

vnx::Hash64 KeyFile::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string KeyFile::get_type_name() const {
	return "mmx.KeyFile";
}

const vnx::TypeCode* KeyFile::get_type_code() const {
	return mmx::vnx_native_type_code_KeyFile;
}

std::shared_ptr<KeyFile> KeyFile::create() {
	return std::make_shared<KeyFile>();
}

std::shared_ptr<vnx::Value> KeyFile::clone() const {
	return std::make_shared<KeyFile>(*this);
}

void KeyFile::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void KeyFile::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void KeyFile::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::vnx_native_type_code_KeyFile;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, seed_value);
	_visitor.type_field(_type_code->fields[1], 1); vnx::accept(_visitor, finger_print);
	_visitor.type_end(*_type_code);
}

void KeyFile::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.KeyFile\"";
	_out << ", \"seed_value\": "; vnx::write(_out, seed_value);
	_out << ", \"finger_print\": "; vnx::write(_out, finger_print);
	_out << "}";
}

void KeyFile::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object KeyFile::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.KeyFile";
	_object["seed_value"] = seed_value;
	_object["finger_print"] = finger_print;
	return _object;
}

void KeyFile::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "finger_print") {
			_entry.second.to(finger_print);
		} else if(_entry.first == "seed_value") {
			_entry.second.to(seed_value);
		}
	}
}

vnx::Variant KeyFile::get_field(const std::string& _name) const {
	if(_name == "seed_value") {
		return vnx::Variant(seed_value);
	}
	if(_name == "finger_print") {
		return vnx::Variant(finger_print);
	}
	return vnx::Variant();
}

void KeyFile::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "seed_value") {
		_value.to(seed_value);
	} else if(_name == "finger_print") {
		_value.to(finger_print);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const KeyFile& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, KeyFile& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* KeyFile::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> KeyFile::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.KeyFile";
	type_code->type_hash = vnx::Hash64(0xdf868931a939cba1ull);
	type_code->code_hash = vnx::Hash64(0x35062c98e95706b2ull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->native_size = sizeof(::mmx::KeyFile);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<KeyFile>(); };
	type_code->fields.resize(2);
	{
		auto& field = type_code->fields[0];
		field.is_extended = true;
		field.name = "seed_value";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[1];
		field.is_extended = true;
		field.name = "finger_print";
		field.code = {33, 32};
	}
	type_code->build();
	return type_code;
}

std::shared_ptr<vnx::Value> KeyFile::vnx_call_switch(std::shared_ptr<const vnx::Value> _method) {
	switch(_method->get_type_hash()) {
	}
	return nullptr;
}


} // namespace mmx


namespace vnx {

void read(TypeInput& in, ::mmx::KeyFile& value, const TypeCode* type_code, const uint16_t* code) {
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
	in.read(type_code->total_field_size);
	if(type_code->is_matched) {
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			case 0: vnx::read(in, value.seed_value, type_code, _field->code.data()); break;
			case 1: vnx::read(in, value.finger_print, type_code, _field->code.data()); break;
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::KeyFile& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::vnx_native_type_code_KeyFile;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::KeyFile>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	vnx::write(out, value.seed_value, type_code, type_code->fields[0].code.data());
	vnx::write(out, value.finger_print, type_code, type_code->fields[1].code.data());
}

void read(std::istream& in, ::mmx::KeyFile& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::KeyFile& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::KeyFile& value) {
	value.accept(visitor);
}

} // vnx
