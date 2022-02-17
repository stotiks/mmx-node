
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_spend_options_t_HXX_
#define INCLUDE_mmx_spend_options_t_HXX_

#include <vnx/Type.h>
#include <mmx/package.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/txio_key_t.hxx>


namespace mmx {

struct MMX_EXPORT spend_options_t {
	
	
	uint32_t min_confirm = 1;
	uint32_t split_output = 1;
	vnx::bool_t over_spend = true;
	vnx::bool_t pending_change = true;
	vnx::optional<::mmx::addr_t> change_addr;
	std::vector<::mmx::txio_key_t> exclude;
	
	static const vnx::Hash64 VNX_TYPE_HASH;
	static const vnx::Hash64 VNX_CODE_HASH;
	
	static constexpr uint64_t VNX_TYPE_ID = 0x37f7c6d377362e95ull;
	
	spend_options_t() {}
	
	vnx::Hash64 get_type_hash() const;
	std::string get_type_name() const;
	const vnx::TypeCode* get_type_code() const;
	
	static std::shared_ptr<spend_options_t> create();
	std::shared_ptr<spend_options_t> clone() const;
	
	void read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code);
	void write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const;
	
	void read(std::istream& _in);
	void write(std::ostream& _out) const;
	
	template<typename T>
	void accept_generic(T& _visitor) const;
	void accept(vnx::Visitor& _visitor) const;
	
	vnx::Object to_object() const;
	void from_object(const vnx::Object& object);
	
	vnx::Variant get_field(const std::string& name) const;
	void set_field(const std::string& name, const vnx::Variant& value);
	
	friend std::ostream& operator<<(std::ostream& _out, const spend_options_t& _value);
	friend std::istream& operator>>(std::istream& _in, spend_options_t& _value);
	
	static const vnx::TypeCode* static_get_type_code();
	static std::shared_ptr<vnx::TypeCode> static_create_type_code();
	
};

template<typename T>
void spend_options_t::accept_generic(T& _visitor) const {
	_visitor.template type_begin<spend_options_t>(6);
	_visitor.type_field("min_confirm", 0); _visitor.accept(min_confirm);
	_visitor.type_field("split_output", 1); _visitor.accept(split_output);
	_visitor.type_field("over_spend", 2); _visitor.accept(over_spend);
	_visitor.type_field("pending_change", 3); _visitor.accept(pending_change);
	_visitor.type_field("change_addr", 4); _visitor.accept(change_addr);
	_visitor.type_field("exclude", 5); _visitor.accept(exclude);
	_visitor.template type_end<spend_options_t>(6);
}


} // namespace mmx


namespace vnx {

template<>
struct is_equivalent<::mmx::spend_options_t> {
	bool operator()(const uint16_t* code, const TypeCode* type_code);
};

} // vnx

#endif // INCLUDE_mmx_spend_options_t_HXX_
