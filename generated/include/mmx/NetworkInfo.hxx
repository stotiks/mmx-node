
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_NetworkInfo_HXX_
#define INCLUDE_mmx_NetworkInfo_HXX_

#include <mmx/package.hxx>
#include <vnx/Value.h>


namespace mmx {

class VNX_EXPORT NetworkInfo : public ::vnx::Value {
public:
	
	uint32_t height = 0;
	uint64_t time_diff = 0;
	uint64_t space_diff = 0;
	uint64_t block_reward = 0;
	uint64_t total_space = 0;
	uint64_t total_supply = 0;
	uint64_t utxo_count = 0;
	uint64_t address_count = 0;
	
	typedef ::vnx::Value Super;
	
	VNX_EXPORT static const vnx::Hash64 VNX_TYPE_HASH;
	VNX_EXPORT static const vnx::Hash64 VNX_CODE_HASH;
	
	static constexpr uint64_t VNX_TYPE_ID = 0xd984018819746101ull;
	
	NetworkInfo() {}
	
	vnx::Hash64 get_type_hash() const override;
	std::string get_type_name() const override;
	const vnx::TypeCode* get_type_code() const override;
	
	static std::shared_ptr<NetworkInfo> create();
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
	
	friend std::ostream& operator<<(std::ostream& _out, const NetworkInfo& _value);
	friend std::istream& operator>>(std::istream& _in, NetworkInfo& _value);
	
	static const vnx::TypeCode* static_get_type_code();
	static std::shared_ptr<vnx::TypeCode> static_create_type_code();
	
};

template<typename T>
void NetworkInfo::accept_generic(T& _visitor) const {
	_visitor.template type_begin<NetworkInfo>(8);
	_visitor.type_field("height", 0); _visitor.accept(height);
	_visitor.type_field("time_diff", 1); _visitor.accept(time_diff);
	_visitor.type_field("space_diff", 2); _visitor.accept(space_diff);
	_visitor.type_field("block_reward", 3); _visitor.accept(block_reward);
	_visitor.type_field("total_space", 4); _visitor.accept(total_space);
	_visitor.type_field("total_supply", 5); _visitor.accept(total_supply);
	_visitor.type_field("utxo_count", 6); _visitor.accept(utxo_count);
	_visitor.type_field("address_count", 7); _visitor.accept(address_count);
	_visitor.template type_end<NetworkInfo>(8);
}


} // namespace mmx


namespace vnx {

} // vnx

#endif // INCLUDE_mmx_NetworkInfo_HXX_
