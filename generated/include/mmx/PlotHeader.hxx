
// AUTO GENERATED by vnxcppcodegen

#ifndef INCLUDE_mmx_PlotHeader_HXX_
#define INCLUDE_mmx_PlotHeader_HXX_

#include <mmx/package.hxx>
#include <mmx/addr_t.hpp>
#include <mmx/hash_t.hpp>
#include <mmx/pubkey_t.hpp>
#include <vnx/Value.h>


namespace mmx {

class MMX_EXPORT PlotHeader : public ::vnx::Value {
public:
	
	int32_t version = 0;
	int32_t ksize = 0;
	int32_t xbits = 0;
	vnx::bool_t has_meta = 0;
	::mmx::hash_t seed;
	::mmx::hash_t plot_id;
	::mmx::pubkey_t farmer_key;
	vnx::optional<::mmx::addr_t> contract;
	uint64_t plot_size = 0;
	int32_t park_size_x = 0;
	int32_t park_size_y = 0;
	int32_t park_size_pd = 0;
	int32_t park_size_meta = 0;
	int32_t park_bytes_x = 0;
	int32_t park_bytes_y = 0;
	int32_t park_bytes_pd = 0;
	int32_t park_bytes_meta = 0;
	uint64_t num_entries_y = 0;
	uint64_t table_offset_x = -1;
	uint64_t table_offset_y = -1;
	uint64_t table_offset_meta = -1;
	std::vector<uint64_t> table_offset_pd;
	
	typedef ::vnx::Value Super;
	
	static const vnx::Hash64 VNX_TYPE_HASH;
	static const vnx::Hash64 VNX_CODE_HASH;
	
	static constexpr uint64_t VNX_TYPE_ID = 0x299c5790983c47b6ull;
	
	PlotHeader() {}
	
	vnx::Hash64 get_type_hash() const override;
	std::string get_type_name() const override;
	const vnx::TypeCode* get_type_code() const override;
	
	static std::shared_ptr<PlotHeader> create();
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
	
	friend std::ostream& operator<<(std::ostream& _out, const PlotHeader& _value);
	friend std::istream& operator>>(std::istream& _in, PlotHeader& _value);
	
	static const vnx::TypeCode* static_get_type_code();
	static std::shared_ptr<vnx::TypeCode> static_create_type_code();
	
protected:
	std::shared_ptr<vnx::Value> vnx_call_switch(std::shared_ptr<const vnx::Value> _method) override;
	
};

template<typename T>
void PlotHeader::accept_generic(T& _visitor) const {
	_visitor.template type_begin<PlotHeader>(22);
	_visitor.type_field("version", 0); _visitor.accept(version);
	_visitor.type_field("ksize", 1); _visitor.accept(ksize);
	_visitor.type_field("xbits", 2); _visitor.accept(xbits);
	_visitor.type_field("has_meta", 3); _visitor.accept(has_meta);
	_visitor.type_field("seed", 4); _visitor.accept(seed);
	_visitor.type_field("plot_id", 5); _visitor.accept(plot_id);
	_visitor.type_field("farmer_key", 6); _visitor.accept(farmer_key);
	_visitor.type_field("contract", 7); _visitor.accept(contract);
	_visitor.type_field("plot_size", 8); _visitor.accept(plot_size);
	_visitor.type_field("park_size_x", 9); _visitor.accept(park_size_x);
	_visitor.type_field("park_size_y", 10); _visitor.accept(park_size_y);
	_visitor.type_field("park_size_pd", 11); _visitor.accept(park_size_pd);
	_visitor.type_field("park_size_meta", 12); _visitor.accept(park_size_meta);
	_visitor.type_field("park_bytes_x", 13); _visitor.accept(park_bytes_x);
	_visitor.type_field("park_bytes_y", 14); _visitor.accept(park_bytes_y);
	_visitor.type_field("park_bytes_pd", 15); _visitor.accept(park_bytes_pd);
	_visitor.type_field("park_bytes_meta", 16); _visitor.accept(park_bytes_meta);
	_visitor.type_field("num_entries_y", 17); _visitor.accept(num_entries_y);
	_visitor.type_field("table_offset_x", 18); _visitor.accept(table_offset_x);
	_visitor.type_field("table_offset_y", 19); _visitor.accept(table_offset_y);
	_visitor.type_field("table_offset_meta", 20); _visitor.accept(table_offset_meta);
	_visitor.type_field("table_offset_pd", 21); _visitor.accept(table_offset_pd);
	_visitor.template type_end<PlotHeader>(22);
}


} // namespace mmx


namespace vnx {

} // vnx

#endif // INCLUDE_mmx_PlotHeader_HXX_
