
// AUTO GENERATED by vnxcppcodegen

#include <mmx/solution/package.hxx>
#include <mmx/solution/PlotNFT_is_valid.hxx>
#include <mmx/solution/PlotNFT_is_valid_return.hxx>
#include <vnx/Value.h>

#include <vnx/vnx.h>


namespace mmx {
namespace solution {


const vnx::Hash64 PlotNFT_is_valid::VNX_TYPE_HASH(0x4e06d4ed20b1116full);
const vnx::Hash64 PlotNFT_is_valid::VNX_CODE_HASH(0x99453be225cc729cull);

vnx::Hash64 PlotNFT_is_valid::get_type_hash() const {
	return VNX_TYPE_HASH;
}

std::string PlotNFT_is_valid::get_type_name() const {
	return "mmx.solution.PlotNFT.is_valid";
}

const vnx::TypeCode* PlotNFT_is_valid::get_type_code() const {
	return mmx::solution::vnx_native_type_code_PlotNFT_is_valid;
}

std::shared_ptr<PlotNFT_is_valid> PlotNFT_is_valid::create() {
	return std::make_shared<PlotNFT_is_valid>();
}

std::shared_ptr<vnx::Value> PlotNFT_is_valid::clone() const {
	return std::make_shared<PlotNFT_is_valid>(*this);
}

void PlotNFT_is_valid::read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) {
	vnx::read(_in, *this, _type_code, _code);
}

void PlotNFT_is_valid::write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const {
	vnx::write(_out, *this, _type_code, _code);
}

void PlotNFT_is_valid::accept(vnx::Visitor& _visitor) const {
	const vnx::TypeCode* _type_code = mmx::solution::vnx_native_type_code_PlotNFT_is_valid;
	_visitor.type_begin(*_type_code);
	_visitor.type_end(*_type_code);
}

void PlotNFT_is_valid::write(std::ostream& _out) const {
	_out << "{\"__type\": \"mmx.solution.PlotNFT.is_valid\"";
	_out << "}";
}

void PlotNFT_is_valid::read(std::istream& _in) {
	if(auto _json = vnx::read_json(_in)) {
		from_object(_json->to_object());
	}
}

vnx::Object PlotNFT_is_valid::to_object() const {
	vnx::Object _object;
	_object["__type"] = "mmx.solution.PlotNFT.is_valid";
	return _object;
}

void PlotNFT_is_valid::from_object(const vnx::Object& _object) {
}

vnx::Variant PlotNFT_is_valid::get_field(const std::string& _name) const {
	return vnx::Variant();
}

void PlotNFT_is_valid::set_field(const std::string& _name, const vnx::Variant& _value) {
}

/// \private
std::ostream& operator<<(std::ostream& _out, const PlotNFT_is_valid& _value) {
	_value.write(_out);
	return _out;
}

/// \private
std::istream& operator>>(std::istream& _in, PlotNFT_is_valid& _value) {
	_value.read(_in);
	return _in;
}

const vnx::TypeCode* PlotNFT_is_valid::static_get_type_code() {
	const vnx::TypeCode* type_code = vnx::get_type_code(VNX_TYPE_HASH);
	if(!type_code) {
		type_code = vnx::register_type_code(static_create_type_code());
	}
	return type_code;
}

std::shared_ptr<vnx::TypeCode> PlotNFT_is_valid::static_create_type_code() {
	auto type_code = std::make_shared<vnx::TypeCode>();
	type_code->name = "mmx.solution.PlotNFT.is_valid";
	type_code->type_hash = vnx::Hash64(0x4e06d4ed20b1116full);
	type_code->code_hash = vnx::Hash64(0x99453be225cc729cull);
	type_code->is_native = true;
	type_code->is_class = true;
	type_code->is_method = true;
	type_code->native_size = sizeof(::mmx::solution::PlotNFT_is_valid);
	type_code->create_value = []() -> std::shared_ptr<vnx::Value> { return std::make_shared<PlotNFT_is_valid>(); };
	type_code->is_const = true;
	type_code->return_type = ::mmx::solution::PlotNFT_is_valid_return::static_get_type_code();
	type_code->build();
	return type_code;
}


} // namespace mmx
} // namespace solution


namespace vnx {

void read(TypeInput& in, ::mmx::solution::PlotNFT_is_valid& value, const TypeCode* type_code, const uint16_t* code) {
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
			default: vnx::skip(in, type_code, _field->code.data());
		}
	}
}

void write(TypeOutput& out, const ::mmx::solution::PlotNFT_is_valid& value, const TypeCode* type_code, const uint16_t* code) {
	if(code && code[0] == CODE_OBJECT) {
		vnx::write(out, value.to_object(), nullptr, code);
		return;
	}
	if(!type_code || (code && code[0] == CODE_ANY)) {
		type_code = mmx::solution::vnx_native_type_code_PlotNFT_is_valid;
		out.write_type_code(type_code);
		vnx::write_class_header<::mmx::solution::PlotNFT_is_valid>(out);
	}
	else if(code && code[0] == CODE_STRUCT) {
		type_code = type_code->depends[code[1]];
	}
}

void read(std::istream& in, ::mmx::solution::PlotNFT_is_valid& value) {
	value.read(in);
}

void write(std::ostream& out, const ::mmx::solution::PlotNFT_is_valid& value) {
	value.write(out);
}

void accept(Visitor& visitor, const ::mmx::solution::PlotNFT_is_valid& value) {
	value.accept(visitor);
}

} // vnx
