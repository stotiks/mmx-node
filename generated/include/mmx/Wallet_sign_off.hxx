
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_Wallet_sign_off_HXX_
#define INCLUDE_mmx_Wallet_sign_off_HXX_

#include <mmx/package.hxx>
#include <mmx/Transaction.hxx>
#include <mmx/txio_key_t.hxx>
#include <mmx/utxo_t.hxx>
#include <vnx/Value.h>


namespace mmx {

class MMX_EXPORT Wallet_sign_off : public ::vnx::Value {
public:
	
	uint32_t index = 0;
	std::shared_ptr<const ::mmx::Transaction> tx;
	vnx::bool_t cover_fee = 0;
	std::vector<std::pair<::mmx::txio_key_t, ::mmx::utxo_t>> utxo_list;
	
	typedef ::vnx::Value Super;
	
	static const vnx::Hash64 VNX_TYPE_HASH;
	static const vnx::Hash64 VNX_CODE_HASH;
	
	static constexpr uint64_t VNX_TYPE_ID = 0x232c89cf3ed4d5b1ull;
	
	Wallet_sign_off() {}
	
	vnx::Hash64 get_type_hash() const override;
	std::string get_type_name() const override;
	const vnx::TypeCode* get_type_code() const override;
	
	static std::shared_ptr<Wallet_sign_off> create();
	std::shared_ptr<vnx::Value> clone() const override;
	
	void read(vnx::TypeInput& _in, const vnx::TypeCode* _type_code, const uint16_t* _code) override;
	void write(vnx::TypeOutput& _out, const vnx::TypeCode* _type_code, const uint16_t* _code) const override;
	
	void read(std::istream& _in) override;
	void write(std::ostream& _out) const override;
	
	template<typename T>
	void accept_generic(T& _visitor) const;
	void accept(vnx::Visitor& _visitor) const override;
	
	vnx::Object to_object() const override;
	void from_object(const vnx::Object& object) override;
	
	vnx::Variant get_field(const std::string& name) const override;
	void set_field(const std::string& name, const vnx::Variant& value) override;
	
	friend std::ostream& operator<<(std::ostream& _out, const Wallet_sign_off& _value);
	friend std::istream& operator>>(std::istream& _in, Wallet_sign_off& _value);
	
	static const vnx::TypeCode* static_get_type_code();
	static std::shared_ptr<vnx::TypeCode> static_create_type_code();
	
};

template<typename T>
void Wallet_sign_off::accept_generic(T& _visitor) const {
	_visitor.template type_begin<Wallet_sign_off>(4);
	_visitor.type_field("index", 0); _visitor.accept(index);
	_visitor.type_field("tx", 1); _visitor.accept(tx);
	_visitor.type_field("cover_fee", 2); _visitor.accept(cover_fee);
	_visitor.type_field("utxo_list", 3); _visitor.accept(utxo_list);
	_visitor.template type_end<Wallet_sign_off>(4);
}


} // namespace mmx


namespace vnx {

} // vnx

#endif // INCLUDE_mmx_Wallet_sign_off_HXX_
