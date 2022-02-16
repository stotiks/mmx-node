
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_stxo_t_HXX_
#define INCLUDE_mmx_stxo_t_HXX_

#include <mmx/package.hxx>
#include <mmx/txio_key_t.hxx>
#include <mmx/utxo_t.hxx>


namespace mmx {

struct VNX_EXPORT stxo_t : ::mmx::utxo_t {
	
	
	::mmx::txio_key_t spent;
	
	typedef ::mmx::utxo_t Super;
	
	VNX_EXPORT static const vnx::Hash64 VNX_TYPE_HASH;
	VNX_EXPORT static const vnx::Hash64 VNX_CODE_HASH;
	
	static constexpr uint64_t VNX_TYPE_ID = 0x615a84cdd47c1938ull;
	
	stxo_t() {}
	
	vnx::Hash64 get_type_hash() const;
	std::string get_type_name() const;
	const vnx::TypeCode* get_type_code() const;
	
	static ::mmx::stxo_t create_ex(const ::mmx::utxo_t& utxo = ::mmx::utxo_t(), const ::mmx::txio_key_t& spent = ::mmx::txio_key_t());
	
	static std::shared_ptr<stxo_t> create();
	std::shared_ptr<stxo_t> clone() const;
	
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
	
	friend std::ostream& operator<<(std::ostream& _out, const stxo_t& _value);
	friend std::istream& operator>>(std::istream& _in, stxo_t& _value);
	
	static const vnx::TypeCode* static_get_type_code();
	static std::shared_ptr<vnx::TypeCode> static_create_type_code();
	
};

template<typename T>
void stxo_t::accept_generic(T& _visitor) const {
	_visitor.template type_begin<stxo_t>(5);
	_visitor.type_field("address", 0); _visitor.accept(address);
	_visitor.type_field("contract", 1); _visitor.accept(contract);
	_visitor.type_field("amount", 2); _visitor.accept(amount);
	_visitor.type_field("height", 3); _visitor.accept(height);
	_visitor.type_field("spent", 4); _visitor.accept(spent);
	_visitor.template type_end<stxo_t>(5);
}


} // namespace mmx


namespace vnx {

template<>
struct is_equivalent<::mmx::stxo_t> {
	bool operator()(const uint16_t* code, const TypeCode* type_code);
};

} // vnx

#endif // INCLUDE_mmx_stxo_t_HXX_
