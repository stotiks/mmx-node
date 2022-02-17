
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_utxo_entry_t_HXX_
#define INCLUDE_mmx_utxo_entry_t_HXX_

#include <vnx/Type.h>
#include <mmx/package.hxx>
#include <mmx/txio_key_t.hxx>
#include <mmx/utxo_t.hxx>


namespace mmx {

struct MMX_EXPORT utxo_entry_t {
	
	
	::mmx::txio_key_t key;
	::mmx::utxo_t output;
	
	static const vnx::Hash64 VNX_TYPE_HASH;
	static const vnx::Hash64 VNX_CODE_HASH;
	
	static constexpr uint64_t VNX_TYPE_ID = 0xa992908400336c9aull;
	
	utxo_entry_t() {}
	
	vnx::Hash64 get_type_hash() const;
	std::string get_type_name() const;
	const vnx::TypeCode* get_type_code() const;
	
	static ::mmx::utxo_entry_t create_ex(const ::mmx::txio_key_t& key = ::mmx::txio_key_t(), const ::mmx::utxo_t& output = ::mmx::utxo_t());
	
	static std::shared_ptr<utxo_entry_t> create();
	std::shared_ptr<utxo_entry_t> clone() const;
	
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
	
	friend std::ostream& operator<<(std::ostream& _out, const utxo_entry_t& _value);
	friend std::istream& operator>>(std::istream& _in, utxo_entry_t& _value);
	
	static const vnx::TypeCode* static_get_type_code();
	static std::shared_ptr<vnx::TypeCode> static_create_type_code();
	
};

template<typename T>
void utxo_entry_t::accept_generic(T& _visitor) const {
	_visitor.template type_begin<utxo_entry_t>(2);
	_visitor.type_field("key", 0); _visitor.accept(key);
	_visitor.type_field("output", 1); _visitor.accept(output);
	_visitor.template type_end<utxo_entry_t>(2);
}


} // namespace mmx


namespace vnx {

template<>
struct is_equivalent<::mmx::utxo_entry_t> {
	bool operator()(const uint16_t* code, const TypeCode* type_code);
};

} // vnx

#endif // INCLUDE_mmx_utxo_entry_t_HXX_
