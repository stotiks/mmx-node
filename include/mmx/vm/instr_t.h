/*
 * instr_t.h
 *
 *  Created on: Apr 21, 2022
 *      Author: mad
 */

#ifndef INCLUDE_MMX_VM_INSTR_T_H_
#define INCLUDE_MMX_VM_INSTR_T_H_

#include <cstdint>
#include <string>


namespace mmx {
namespace vm {

static constexpr uint8_t OPFLAG_REF_A = (1 << 0);
static constexpr uint8_t OPFLAG_REF_B = (1 << 1);
static constexpr uint8_t OPFLAG_REF_C = (1 << 2);
static constexpr uint8_t OPFLAG_REF_D = (1 << 3);
static constexpr uint8_t OPFLAG_HARD_FAIL = (1 << 4);
static constexpr uint8_t OPFLAG_CATCH_OVERFLOW = (1 << 5);

enum opcode_e : uint8_t {

	OP_NOP,
	OP_CLR,			// dst
	OP_COPY,		// dst, src
	OP_CLONE,		// dst, src
	OP_JUMP,		// dst
	OP_JUMPI,		// dst, cond
	OP_CALL,		// dst, stack_ptr
	OP_RET,

	OP_ADD,			// dst, lhs, rhs
	OP_SUB,			// dst, lhs, rhs
	OP_MUL,			// dst, lhs, rhs
	OP_DIV,			// dst, lhs, rhs
	OP_MOD,			// dst, lhs, rhs

	OP_NOT,			// dst, src
	OP_XOR,			// dst, lhs, rhs
	OP_AND,			// dst, lhs, rhs
	OP_OR,			// dst, lhs, rhs
	OP_MIN,			// dst, lhs, rhs
	OP_MAX,			// dst, lhs, rhs
	OP_SHL,			// dst, src, count
	OP_SHR,			// dst, src, count

	OP_CMP_EQ,		// dst, lhs, rhs
	OP_CMP_NEQ,		// dst, lhs, rhs
	OP_CMP_LT,		// dst, lhs, rhs
	OP_CMP_GT,		// dst, lhs, rhs
	OP_CMP_LTE,		// dst, lhs, rhs
	OP_CMP_GTE,		// dst, lhs, rhs

	OP_TYPE,		// dst, addr
	OP_SIZE,		// dst, addr
	OP_GET,			// dst, addr, key
	OP_SET,			// addr, key, src
	OP_ERASE,		// addr, key

	OP_PUSH_BACK,	// dst, src
	OP_POP_BACK,	// dst, src

	OP_CONV,		// dst, src, dflags, sflags
	OP_CONCAT,		// dst, src
	OP_MEMCPY,		// dst, src, count, offset
	OP_SHA256,		// dst, src

	OP_LOG,			// level, message
	OP_SEND,		// addr, amount, currency
	OP_MINT,		// addr, amount
	OP_EVENT,		// name, data
	OP_FAIL,		// message

};

enum convtype_e {

	CONVTYPE_DEFAULT = 0,
	CONVTYPE_BIN,
	CONVTYPE_OCT,
	CONVTYPE_DEC,
	CONVTYPE_HEX,
	CONVTYPE_BOOL,
	CONVTYPE_UINT,
	CONVTYPE_STRING,
	CONVTYPE_BINARY,
	CONVTYPE_ARRAY,
	CONVTYPE_ADDRESS,

};

struct instr_t {

	opcode_e code = OP_NOP;

	uint8_t flags = 0;

	uint32_t a = 0;
	uint32_t b = 0;
	uint32_t c = 0;
	uint32_t d = 0;

	instr_t() = default;
	instr_t(opcode_e code, uint8_t flags = 0,
			uint32_t a = 0, uint32_t b = 0, uint32_t c = 0, uint32_t d = 0)
		:	code(code), flags(flags), a(a), b(b), c(c), d(c)
	{
	}

};

struct opcode_info_t {

	std::string name;

	uint32_t nargs = 0;

};

const opcode_info_t& get_opcode_info(opcode_e code);



} // vm
} // mmx

#endif /* INCLUDE_MMX_VM_INSTR_T_H_ */
