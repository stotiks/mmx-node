
// AUTO GENERATED by vnxcppcodegen

#include <mmx/package.hxx>
#include <mmx/trade_entry_t.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/hash_t.hpp>

#include <vnx/vnx.h>


namespace mmx {


const vnx::Hash64 trade_entry_t::VNX_TYPE_HASH(0xed7d8e67cb8db394ull);
const vnx::Hash64 trade_entry_t::VNX_CODE_HASH(0xfc4e696729091610ull);

vnx::Hash64 trade_entry_t::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string trade_entry_t::get_type_name() const {
	return "mmx.trade_entry_t";
}

const vnx::TypeCode* trade_entry_t::get_type_code() const {
	return mmx::vnx_native_type_code_trade_entry_t;
}

std::shared_ptr<trade_entry_t> trade_entry_t::create() {
	return std::make_shared<trade_entry_t>();
}

std::shared_ptr<trade_entry_t> trade_entry_t::clone() const {
	return std::make_shared<trade_entry_t>(*this);
}

void trade_entry_t::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void trade_entry_t::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void trade_entry_t::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::vnx_native_type_code_trade_entry_t;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, height);
	_visitor.type_field(_type_code->fields[1], 1); vnx::accept(_visitor, time_stamp);
	_visitor.type_field(_type_code->fields[2], 2); vnx::accept(_visitor, address);
	_visitor.type_field(_type_code->fields[3], 3); vnx::accept(_visitor, txid);
	_visitor.type_field(_type_code->fields[4], 4); vnx::accept(_visitor, bid_currency);
	_visitor.type_field(_type_code->fields[5], 5); vnx::accept(_visitor, ask_currency);
	_visitor.type_field(_type_code->fields[6], 6); vnx::accept(_visitor, bid_amount);
	_visitor.type_field(_type_code->fields[7], 7); vnx::accept(_visitor, ask_amount);
	_visitor.type_field(_type_code->fields[8], 8); vnx::accept(_visitor, price);
	_visitor.type_end(*_type_code);
}

void trade_entry_t::write(std::ostream& _out) const {
	_out << "{";
	_out << "\"height\": "; vnx::write(_out, height);
	_out << ", \"time_stamp\": "; vnx::write(_out, time_stamp);
	_out << ", \"address\": "; vnx::write(_out, address);
	_out << ", \"txid\": "; vnx::write(_out, txid);
	_out << ", \"bid_currency\": "; vnx::write(_out, bid_currency);
	_out << ", \"ask_currency\": "; vnx::write(_out, ask_currency);
	_out << ", \"bid_amount\": "; vnx::write(_out, bid_amount);
	_out << ", \"ask_amount\": "; vnx::write(_out, ask_amount);
	_out << ", \"price\": "; vnx::write(_out, price);
	_out << "}";
}

void trade_entry_t::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object trade_entry_t::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.trade_entry_t";
	_object["height"] = height;
	_object["time_stamp"] = time_stamp;
	_object["address"] = address;
	_object["txid"] = txid;
	_object["bid_currency"] = bid_currency;
	_object["ask_currency"] = ask_currency;
	_object["bid_amount"] = bid_amount;
	_object["ask_amount"] = ask_amount;
	_object["price"] = price;
	return _object;
}

void trade_entry_t::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "address") {
			_entry.second.to(address);
		} else if(_entry.first == "ask_amount") {
			_entry.second.to(ask_amount);
		} else if(_entry.first == "ask_currency") {
			_entry.second.to(ask_currency);
		} else if(_entry.first == "bid_amount") {
			_entry.second.to(bid_amount);
		} else if(_entry.first == "bid_currency") {
			_entry.second.to(bid_currency);
		} else if(_entry.first == "height") {
			_entry.second.to(height);
		} else if(_entry.first == "price") {
			_entry.second.to(price);
		} else if(_entry.first == "time_stamp") {
			_entry.second.to(time_stamp);
		} else if(_entry.first == "txid") {
			_entry.second.to(txid);
		}
	}
}

vnx::Variant trade_entry_t::get_field(const std::string& _name) const {
	if(_name == "height") {
		return vnx::Variant(height);
	}
	if(_name == "time_stamp") {
		return vnx::Variant(time_stamp);
	}
	if(_name == "address") {
		return vnx::Variant(address);
	}
	if(_name == "txid") {
		return vnx::Variant(txid);
	}
	if(_name == "bid_currency") {
		return vnx::Variant(bid_currency);
	}
	if(_name == "ask_currency") {
		return vnx::Variant(ask_currency);
	}
	if(_name == "bid_amount") {
		return vnx::Variant(bid_amount);
	}
	if(_name == "ask_amount") {
		return vnx::Variant(ask_amount);
	}
	if(_name == "price") {
		return vnx::Variant(price);
	}
	return vnx::Variant();
}

void trade_entry_t::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "height") {
		_value.to(height);
	} else if(_name == "time_stamp") {
		_value.to(time_stamp);
	} else if(_name == "address") {
		_value.to(address);
	} else if(_name == "txid") {
		_value.to(txid);
	} else if(_name == "bid_currency") {
		_value.to(bid_currency);
	} else if(_name == "ask_currency") {
		_value.to(ask_currency);
	} else if(_name == "bid_amount") {
		_value.to(bid_amount);
	} else if(_name == "ask_amount") {
		_value.to(ask_amount);
	} else if(_name == "price") {
		_value.to(price);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const trade_entry_t& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, trade_entry_t& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* trade_entry_t::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> trade_entry_t::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.trade_entry_t";
	type_code->type_hash = vnx::Hash64(0xed7d8e67cb8db394ull);
	type_code->code_hash = vnx::Hash64(0xfc4e696729091610ull);
	type_code->is_native = true;
	type_code->native_size = sizeof(::mmx::trade_entry_t);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<vnx::Struct<trade_entry_t>>(); };
	type_code->fields.resize(9);
	{
		auto& field = type_code->fields[0];
		field.data_size = 4;
		field.name = "height";
		field.code = {3};
	}
	{
		auto& field = type_code->fields[1];
		field.data_size = 8;
		field.name = "time_stamp";
		field.code = {8};
	}
	{
		auto& field = type_code->fields[2];
		field.is_extended = true;
		field.name = "address";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[3];
		field.is_extended = true;
		field.name = "txid";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[4];
		field.is_extended = true;
		field.name = "bid_currency";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[5];
		field.is_extended = true;
		field.name = "ask_currency";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[6];
		field.data_size = 8;
		field.name = "bid_amount";
		field.code = {4};
	}
	{
		auto& field = type_code->fields[7];
		field.data_size = 8;
		field.name = "ask_amount";
		field.code = {4};
	}
	{
		auto& field = type_code->fields[8];
		field.data_size = 8;
		field.name = "price";
		field.code = {10};
	}
	type_code->build();
	return type_code;
}


} // namespace mmx


namespace vnx {

void read(TypeInput& in, ::mmx::trade_entry_t& value, const TypeCode* type_code, const uint16_t* code) {
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
			vnx::read_value(_buf + _field->offset, value.height, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[1]) {
			vnx::read_value(_buf + _field->offset, value.time_stamp, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[6]) {
			vnx::read_value(_buf + _field->offset, value.bid_amount, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[7]) {
			vnx::read_value(_buf + _field->offset, value.ask_amount, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[8]) {
			vnx::read_value(_buf + _field->offset, value.price, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			case 2: vnx::read(in, value.address, type_code, _field->code.data()); break;
			case 3: vnx::read(in, value.txid, type_code, _field->code.data()); break;
			case 4: vnx::read(in, value.bid_currency, type_code, _field->code.data()); break;
			case 5: vnx::read(in, value.ask_currency, type_code, _field->code.data()); break;
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::trade_entry_t& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::vnx_native_type_code_trade_entry_t;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::trade_entry_t>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	auto* const _buf = out.write(36);
	vnx::write_value(_buf + 0, value.height);
	vnx::write_value(_buf + 4, value.time_stamp);
	vnx::write_value(_buf + 12, value.bid_amount);
	vnx::write_value(_buf + 20, value.ask_amount);
	vnx::write_value(_buf + 28, value.price);
	vnx::write(out, value.address, type_code, type_code->fields[2].code.data());
	vnx::write(out, value.txid, type_code, type_code->fields[3].code.data());
	vnx::write(out, value.bid_currency, type_code, type_code->fields[4].code.data());
	vnx::write(out, value.ask_currency, type_code, type_code->fields[5].code.data());
}

void read(std::istream& in, ::mmx::trade_entry_t& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::trade_entry_t& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::trade_entry_t& value) {
	value.accept(visitor);
}

bool is_equivalent<::mmx::trade_entry_t>::operator()(const uint16_t* code, const TypeCode* type_code) {
	if(code[0] != CODE_STRUCT || !type_code) {
		return false;
	}
	type_code = type_code->depends[code[1]];
	return type_code->type_hash == ::mmx::trade_entry_t::VNX_TYPE_HASH && type_code->is_equivalent;
}

} // vnx
