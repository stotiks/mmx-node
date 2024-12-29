
// AUTO GENERATED by vnxcppcodegen

#include <mmx/package.hxx>
#include <mmx/ProofOfTime.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/hash_t.hpp>
#include <mmx/pubkey_t.hpp>
#include <mmx/signature_t.hpp>
#include <vnx/Value.h>

#include <vnx/vnx.h>


namespace mmx {


const vnx::Hash64 ProofOfTime::VNX_TYPE_HASH(0xa84a63942b8e5c6aull);
const vnx::Hash64 ProofOfTime::VNX_CODE_HASH(0x969604802b05b4cdull);

vnx::Hash64 ProofOfTime::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string ProofOfTime::get_type_name() const {
	return "mmx.ProofOfTime";
}

const vnx::TypeCode* ProofOfTime::get_type_code() const {
	return mmx::vnx_native_type_code_ProofOfTime;
}

std::shared_ptr<ProofOfTime> ProofOfTime::create() {
	return std::make_shared<ProofOfTime>();
}

std::shared_ptr<vnx::Value> ProofOfTime::clone() const {
	return std::make_shared<ProofOfTime>(*this);
}

void ProofOfTime::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void ProofOfTime::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void ProofOfTime::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::vnx_native_type_code_ProofOfTime;
	_visitor.type_begin(*_type_code);
	_visitor.type_field(_type_code->fields[0], 0); vnx::accept(_visitor, version);
	_visitor.type_field(_type_code->fields[1], 1); vnx::accept(_visitor, hash);
	_visitor.type_field(_type_code->fields[2], 2); vnx::accept(_visitor, vdf_height);
	_visitor.type_field(_type_code->fields[3], 3); vnx::accept(_visitor, start);
	_visitor.type_field(_type_code->fields[4], 4); vnx::accept(_visitor, num_iters);
	_visitor.type_field(_type_code->fields[5], 5); vnx::accept(_visitor, segment_size);
	_visitor.type_field(_type_code->fields[6], 6); vnx::accept(_visitor, input);
	_visitor.type_field(_type_code->fields[7], 7); vnx::accept(_visitor, prev);
	_visitor.type_field(_type_code->fields[8], 8); vnx::accept(_visitor, reward_addr);
	_visitor.type_field(_type_code->fields[9], 9); vnx::accept(_visitor, segments);
	_visitor.type_field(_type_code->fields[10], 10); vnx::accept(_visitor, timelord_key);
	_visitor.type_field(_type_code->fields[11], 11); vnx::accept(_visitor, timelord_sig);
	_visitor.type_field(_type_code->fields[12], 12); vnx::accept(_visitor, content_hash);
	_visitor.type_end(*_type_code);
}

void ProofOfTime::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.ProofOfTime\"";
	_out << ", \"version\": "; vnx::write(_out, version);
	_out << ", \"hash\": "; vnx::write(_out, hash);
	_out << ", \"vdf_height\": "; vnx::write(_out, vdf_height);
	_out << ", \"start\": "; vnx::write(_out, start);
	_out << ", \"num_iters\": "; vnx::write(_out, num_iters);
	_out << ", \"segment_size\": "; vnx::write(_out, segment_size);
	_out << ", \"input\": "; vnx::write(_out, input);
	_out << ", \"prev\": "; vnx::write(_out, prev);
	_out << ", \"reward_addr\": "; vnx::write(_out, reward_addr);
	_out << ", \"segments\": "; vnx::write(_out, segments);
	_out << ", \"timelord_key\": "; vnx::write(_out, timelord_key);
	_out << ", \"timelord_sig\": "; vnx::write(_out, timelord_sig);
	_out << ", \"content_hash\": "; vnx::write(_out, content_hash);
	_out << "}";
}

void ProofOfTime::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object ProofOfTime::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.ProofOfTime";
	_object["version"] = version;
	_object["hash"] = hash;
	_object["vdf_height"] = vdf_height;
	_object["start"] = start;
	_object["num_iters"] = num_iters;
	_object["segment_size"] = segment_size;
	_object["input"] = input;
	_object["prev"] = prev;
	_object["reward_addr"] = reward_addr;
	_object["segments"] = segments;
	_object["timelord_key"] = timelord_key;
	_object["timelord_sig"] = timelord_sig;
	_object["content_hash"] = content_hash;
	return _object;
}

void ProofOfTime::from_object(const vnx::Object& _object) {
	for(const auto& _entry : _object.field) {
		if(_entry.first == "content_hash") {
			_entry.second.to(content_hash);
		} else if(_entry.first == "hash") {
			_entry.second.to(hash);
		} else if(_entry.first == "input") {
			_entry.second.to(input);
		} else if(_entry.first == "num_iters") {
			_entry.second.to(num_iters);
		} else if(_entry.first == "prev") {
			_entry.second.to(prev);
		} else if(_entry.first == "reward_addr") {
			_entry.second.to(reward_addr);
		} else if(_entry.first == "segment_size") {
			_entry.second.to(segment_size);
		} else if(_entry.first == "segments") {
			_entry.second.to(segments);
		} else if(_entry.first == "start") {
			_entry.second.to(start);
		} else if(_entry.first == "timelord_key") {
			_entry.second.to(timelord_key);
		} else if(_entry.first == "timelord_sig") {
			_entry.second.to(timelord_sig);
		} else if(_entry.first == "vdf_height") {
			_entry.second.to(vdf_height);
		} else if(_entry.first == "version") {
			_entry.second.to(version);
		}
	}
}

vnx::Variant ProofOfTime::get_field(const std::string& _name) const {
	if(_name == "version") {
		return vnx::Variant(version);
	}
	if(_name == "hash") {
		return vnx::Variant(hash);
	}
	if(_name == "vdf_height") {
		return vnx::Variant(vdf_height);
	}
	if(_name == "start") {
		return vnx::Variant(start);
	}
	if(_name == "num_iters") {
		return vnx::Variant(num_iters);
	}
	if(_name == "segment_size") {
		return vnx::Variant(segment_size);
	}
	if(_name == "input") {
		return vnx::Variant(input);
	}
	if(_name == "prev") {
		return vnx::Variant(prev);
	}
	if(_name == "reward_addr") {
		return vnx::Variant(reward_addr);
	}
	if(_name == "segments") {
		return vnx::Variant(segments);
	}
	if(_name == "timelord_key") {
		return vnx::Variant(timelord_key);
	}
	if(_name == "timelord_sig") {
		return vnx::Variant(timelord_sig);
	}
	if(_name == "content_hash") {
		return vnx::Variant(content_hash);
	}
	return vnx::Variant();
}

void ProofOfTime::set_field(const std::string& _name, const vnx::Variant& _value) {
	if(_name == "version") {
		_value.to(version);
	} else if(_name == "hash") {
		_value.to(hash);
	} else if(_name == "vdf_height") {
		_value.to(vdf_height);
	} else if(_name == "start") {
		_value.to(start);
	} else if(_name == "num_iters") {
		_value.to(num_iters);
	} else if(_name == "segment_size") {
		_value.to(segment_size);
	} else if(_name == "input") {
		_value.to(input);
	} else if(_name == "prev") {
		_value.to(prev);
	} else if(_name == "reward_addr") {
		_value.to(reward_addr);
	} else if(_name == "segments") {
		_value.to(segments);
	} else if(_name == "timelord_key") {
		_value.to(timelord_key);
	} else if(_name == "timelord_sig") {
		_value.to(timelord_sig);
	} else if(_name == "content_hash") {
		_value.to(content_hash);
	}
}

/// \private
std::ostream& operator<<(std::ostream& _out, const ProofOfTime& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, ProofOfTime& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* ProofOfTime::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> ProofOfTime::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.ProofOfTime";
	type_code->type_hash = vnx::Hash64(0xa84a63942b8e5c6aull);
	type_code->code_hash = vnx::Hash64(0x969604802b05b4cdull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->native_size = sizeof(::mmx::ProofOfTime);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<ProofOfTime>(); };
	type_code->fields.resize(13);
	{
		auto& field = type_code->fields[0];
		field.data_size = 4;
		field.name = "version";
		field.code = {3};
	}
	{
		auto& field = type_code->fields[1];
		field.is_extended = true;
		field.name = "hash";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[2];
		field.data_size = 4;
		field.name = "vdf_height";
		field.code = {3};
	}
	{
		auto& field = type_code->fields[3];
		field.data_size = 8;
		field.name = "start";
		field.code = {4};
	}
	{
		auto& field = type_code->fields[4];
		field.data_size = 8;
		field.name = "num_iters";
		field.code = {4};
	}
	{
		auto& field = type_code->fields[5];
		field.data_size = 4;
		field.name = "segment_size";
		field.code = {3};
	}
	{
		auto& field = type_code->fields[6];
		field.is_extended = true;
		field.name = "input";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[7];
		field.is_extended = true;
		field.name = "prev";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[8];
		field.is_extended = true;
		field.name = "reward_addr";
		field.code = {11, 32, 1};
	}
	{
		auto& field = type_code->fields[9];
		field.is_extended = true;
		field.name = "segments";
		field.code = {12, 11, 32, 1};
	}
	{
		auto& field = type_code->fields[10];
		field.is_extended = true;
		field.name = "timelord_key";
		field.code = {11, 33, 1};
	}
	{
		auto& field = type_code->fields[11];
		field.is_extended = true;
		field.name = "timelord_sig";
		field.code = {11, 64, 1};
	}
	{
		auto& field = type_code->fields[12];
		field.is_extended = true;
		field.name = "content_hash";
		field.code = {11, 32, 1};
	}
	type_code->build();
	return type_code;
}

std::shared_ptr<vnx::Value> ProofOfTime::vnx_call_switch(std::shared_ptr<const vnx::Value> _method) {
	switch(_method->get_type_hash()) {
	}
	return nullptr;
}


} // namespace mmx


namespace vnx {

void read(TypeInput& in, ::mmx::ProofOfTime& value, const TypeCode* type_code, const uint16_t* code) {
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
			vnx::read_value(_buf + _field->offset, value.version, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[2]) {
			vnx::read_value(_buf + _field->offset, value.vdf_height, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[3]) {
			vnx::read_value(_buf + _field->offset, value.start, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[4]) {
			vnx::read_value(_buf + _field->offset, value.num_iters, _field->code.data());
		}
		if(const auto* const _field = type_code->field_map[5]) {
			vnx::read_value(_buf + _field->offset, value.segment_size, _field->code.data());
		}
	}
	for(const auto* _field : type_code->ext_fields) {
		switch(_field->native_index) {
			case 1: vnx::read(in, value.hash, type_code, _field->code.data()); break;
			case 6: vnx::read(in, value.input, type_code, _field->code.data()); break;
			case 7: vnx::read(in, value.prev, type_code, _field->code.data()); break;
			case 8: vnx::read(in, value.reward_addr, type_code, _field->code.data()); break;
			case 9: vnx::read(in, value.segments, type_code, _field->code.data()); break;
			case 10: vnx::read(in, value.timelord_key, type_code, _field->code.data()); break;
			case 11: vnx::read(in, value.timelord_sig, type_code, _field->code.data()); break;
			case 12: vnx::read(in, value.content_hash, type_code, _field->code.data()); break;
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::ProofOfTime& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::vnx_native_type_code_ProofOfTime;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::ProofOfTime>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
	auto* const _buf = out.write(28);
	vnx::write_value(_buf + 0, value.version);
	vnx::write_value(_buf + 4, value.vdf_height);
	vnx::write_value(_buf + 8, value.start);
	vnx::write_value(_buf + 16, value.num_iters);
	vnx::write_value(_buf + 24, value.segment_size);
	vnx::write(out, value.hash, type_code, type_code->fields[1].code.data());
	vnx::write(out, value.input, type_code, type_code->fields[6].code.data());
	vnx::write(out, value.prev, type_code, type_code->fields[7].code.data());
	vnx::write(out, value.reward_addr, type_code, type_code->fields[8].code.data());
	vnx::write(out, value.segments, type_code, type_code->fields[9].code.data());
	vnx::write(out, value.timelord_key, type_code, type_code->fields[10].code.data());
	vnx::write(out, value.timelord_sig, type_code, type_code->fields[11].code.data());
	vnx::write(out, value.content_hash, type_code, type_code->fields[12].code.data());
}

void read(std::istream& in, ::mmx::ProofOfTime& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::ProofOfTime& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::ProofOfTime& value) {
	value.accept(visitor);
}

} // vnx
