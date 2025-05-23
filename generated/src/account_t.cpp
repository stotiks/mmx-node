
// AUTO GENERATED by vnxcppcodegen

#include <mmx/package.hxx>
#include <mmx/account_t.hxx>

#include <vnx/vnx.h>


namespace mmx {


const vnx::Hash64 account_t::VNX_TYPE_HASH(0xc0c163f453729a7ull);
const vnx::Hash64 account_t::VNX_CODE_HASH(0xee2c18587edeb7a4ull);

vnx::Hash64 account_t::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string account_t::get_type_name() const {
	return "mmx.account_t";
}

const vnx::TypeCode* account_t::get_type_code() const {
	return mmx::vnx_native_type_code_account_t;
}

std::shared_ptr<account_t> account_t::create() {
	return std::make_shared<account_t>();
}

std::shared_ptr<account_t> account_t::clone() const {
	return std::make_shared<account_t>(*this);
}

void account_t::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void account_t::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void account_t::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::vnx_native_type_code_account_t;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, index);
	_visitor.type_field(_type_code->fields[1], 1); vnx::accept(_visitor, num_addresses);
	_visitor.type_field(_type_code->fields[2], 2); vnx::accept(_visitor, name);
	_visitor.type_field(_type_code->fields[3], 3); vnx::accept(_visitor, key_file);
	_visitor.type_field(_type_code->fields[4], 4); vnx::accept(_visitor, finger_print);
	_visitor.type_field(_type_code->fields[5], 5); vnx::accept(_visitor, with_passphrase);
	_visitor.type_field(_type_code->fields[6], 6); vnx::accept(_visitor, is_hidden);
	_visitor.type_end(*_type_code);
}

void account_t::write(std::ostream& _out) const {
	_out << "{";
	_out << "\"index\": "; vnx::write(_out, index);
	_out << ", \"num_addresses\": "; vnx::write(_out, num_addresses);
	_out << ", \"name\": "; vnx::write(_out, name);
	_out << ", \"key_file\": "; vnx::write(_out, key_file);
	_out << ", \"finger_print\": "; vnx::write(_out, finger_print);
	_out << ", \"with_passphrase\": "; vnx::write(_out, with_passphrase);
	_out << ", \"is_hidden\": "; vnx::write(_out, is_hidden);
	_out << "}";
}

void account_t::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object account_t::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.account_t";
	_object["index"] = index;
	_object["num_addresses"] = num_addresses;
	_object["name"] = name;
	_object["key_file"] = key_file;
	_object["finger_print"] = finger_print;
	_object["with_passphrase"] = with_passphrase;
	_object["is_hidden"] = is_hidden;
	return _object;
}

void account_t::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "finger_print") {
			_entry.second.to(finger_print);
		} else if(_entry.first == "index") {
			_entry.second.to(index);
		} else if(_entry.first == "is_hidden") {
			_entry.second.to(is_hidden);
		} else if(_entry.first == "key_file") {
			_entry.second.to(key_file);
		} else if(_entry.first == "name") {
			_entry.second.to(name);
		} else if(_entry.first == "num_addresses") {
			_entry.second.to(num_addresses);
		} else if(_entry.first == "with_passphrase") {
			_entry.second.to(with_passphrase);
		}
	}
}

vnx::Variant account_t::get_field(const std::string& _name) const {
	if(_name == "index") {
		return vnx::Variant(index);
	}
	if(_name == "num_addresses") {
		return vnx::Variant(num_addresses);
	}
	if(_name == "name") {
		return vnx::Variant(name);
	}
	if(_name == "key_file") {
		return vnx::Variant(key_file);
	}
	if(_name == "finger_print") {
		return vnx::Variant(finger_print);
	}
	if(_name == "with_passphrase") {
		return vnx::Variant(with_passphrase);
	}
	if(_name == "is_hidden") {
		return vnx::Variant(is_hidden);
	}
	return vnx::Variant();
}

void account_t::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "index") {
		_value.to(index);
	} else if(_name == "num_addresses") {
		_value.to(num_addresses);
	} else if(_name == "name") {
		_value.to(name);
	} else if(_name == "key_file") {
		_value.to(key_file);
	} else if(_name == "finger_print") {
		_value.to(finger_print);
	} else if(_name == "with_passphrase") {
		_value.to(with_passphrase);
	} else if(_name == "is_hidden") {
		_value.to(is_hidden);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const account_t& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, account_t& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* account_t::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> account_t::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.account_t";
	type_code->type_hash = vnx::Hash64(0xc0c163f453729a7ull);
	type_code->code_hash = vnx::Hash64(0xee2c18587edeb7a4ull);
	type_code->is_native = true;
	type_code->native_size = sizeof(::mmx::account_t);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<vnx::Struct<account_t>>(); };
	type_code->fields.resize(7);
	{
		auto& field = type_code->fields[0];
		field.data_size = 4;
		field.name = "index";
		field.code = {3};
	}
	{
		auto& field = type_code->fields[1];
		field.data_size = 4;
		field.name = "num_addresses";
		field.value = vnx::to_string(1);
		field.code = {3};
	}
	{
		auto& field = type_code->fields[2];
		field.is_extended = true;
		field.name = "name";
		field.code = {32};
	}
	{
		auto& field = type_code->fields[3];
		field.is_extended = true;
		field.name = "key_file";
		field.code = {32};
	}
	{
		auto& field = type_code->fields[4];
		field.is_extended = true;
		field.name = "finger_print";
		field.code = {32};
	}
	{
		auto& field = type_code->fields[5];
		field.data_size = 1;
		field.name = "with_passphrase";
		field.code = {31};
	}
	{
		auto& field = type_code->fields[6];
		field.data_size = 1;
		field.name = "is_hidden";
		field.code = {31};
	}
	type_code->build();
	return type_code;
}


} // namespace mmx


namespace vnx {

void read(TypeInput& in, ::mmx::account_t& value, const TypeCode* type_code, const uint16_t* code) {
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
		if(const auto* const _field = type_code->field_map[1]) {
			vnx::read_value(_buf + _field->offset, value.num_addresses, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[5]) {
			vnx::read_value(_buf + _field->offset, value.with_passphrase, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[6]) {
			vnx::read_value(_buf + _field->offset, value.is_hidden, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			case 2: vnx::read(in, value.name, type_code, _field->code.data()); break;
			case 3: vnx::read(in, value.key_file, type_code, _field->code.data()); break;
			case 4: vnx::read(in, value.finger_print, type_code, _field->code.data()); break;
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::account_t& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::vnx_native_type_code_account_t;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::account_t>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	auto* const _buf = out.write(10);
	vnx::write_value(_buf + 0, value.index);
	vnx::write_value(_buf + 4, value.num_addresses);
	vnx::write_value(_buf + 8, value.with_passphrase);
	vnx::write_value(_buf + 9, value.is_hidden);
	vnx::write(out, value.name, type_code, type_code->fields[2].code.data());
	vnx::write(out, value.key_file, type_code, type_code->fields[3].code.data());
	vnx::write(out, value.finger_print, type_code, type_code->fields[4].code.data());
}

void read(std::istream& in, ::mmx::account_t& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::account_t& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::account_t& value) {
	value.accept(visitor);
}

bool is_equivalent<::mmx::account_t>::operator()(const uint16_t* code, const TypeCode* type_code) {
	if(code[0] != CODE_STRUCT || !type_code) {
		return false;
	}
	type_code = type_code->depends[code[1]];
	return type_code->type_hash == ::mmx::account_t::VNX_TYPE_HASH && type_code->is_equivalent;
}

} // vnx
