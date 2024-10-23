
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_Contract_HXX_
#define INCLUDE_mmx_Contract_HXX_

#include <mmx/package.hxx>
#include <mmx/ChainParams.hxx>
#include <mmx/Solution.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/hash_t.hpp>
#include <vnx/Value.h>
#include <vnx/Variant.hpp>


namespace mmx {

class MMX_EXPORT Contract : public ::vnx::Value {
public:
	
	uint32_t version = 0;
	
	typedef ::vnx::Value Super;
	
	static const vnx::Hash64 VNX_TYPE_HASH;
	static const vnx::Hash64 VNX_CODE_HASH;
	
	static constexpr uint64_t VNX_TYPE_ID = 0x26b896ae8c415285ull;
	
	Contract() {}
	
	vnx::Hash64 get_type_hash() const override;
	std::string get_type_name() const override;
	const vnx::TypeCode* get_type_code() const override;
	
	virtual vnx::bool_t is_valid() const;
	virtual ::mmx::hash_t calc_hash(const vnx::bool_t& full_hash = 0) const;
	virtual uint64_t num_bytes() const;
	virtual uint64_t calc_cost(std::shared_ptr<const ::mmx::ChainParams> params = nullptr) const;
	virtual vnx::optional<::mmx::addr_t> get_owner() const;
	virtual void validate(std::shared_ptr<const ::mmx::Solution> solution = nullptr, const ::mmx::hash_t& txid = ::mmx::hash_t()) const;
	virtual ::vnx::Variant read_field(const std::string& name = "") const;
	
	static std::shared_ptr<Contract> create();
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
	
	friend std::ostream& operator<<(std::ostream& _out, const Contract& _value);
	friend std::istream& operator>>(std::istream& _in, Contract& _value);
	
	static const vnx::TypeCode* static_get_type_code();
	static std::shared_ptr<vnx::TypeCode> static_create_type_code();
	
protected:
	std::shared_ptr<vnx::Value> vnx_call_switch(std::shared_ptr<const vnx::Value> _method) override;
	
};

template<typename T>
void Contract::accept_generic(T& _visitor) const {
	_visitor.template type_begin<Contract>(1);
	_visitor.type_field("version", 0); _visitor.accept(version);
	_visitor.template type_end<Contract>(1);
}


} // namespace mmx


namespace vnx {

} // vnx

#endif // INCLUDE_mmx_Contract_HXX_
