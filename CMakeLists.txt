cmake_minimum_required(VERSION 3.13)
project(mmx-node C CXX ASM)

include(FetchContent)

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

set(CMAKE_CXX_STANDARD 17)

if(MSVC)
	include(GenerateExportHeader)
	include_directories(${CMAKE_CURRENT_BINARY_DIR})
	
	add_compile_definitions(TARGET_FILENAME=$(TargetName)$(TargetExt))
	add_compile_options(/openmp /EHsc /MP)

	set(MSVC_DEBUG_OPTIONS /Od /FS)
	set(MSVC_RELEASE_OPTIONS /W1 /O2)

	add_compile_options( 
		"$<$<CONFIG:Debug>:${MSVC_DEBUG_OPTIONS}>"
		"$<$<CONFIG:RelWithDebInfo>:${MSVC_RELEASE_OPTIONS}>"
		"$<$<CONFIG:Release>:${MSVC_RELEASE_OPTIONS}>"
		"$<$<CONFIG:MinSizeRel>:${MSVC_RELEASE_OPTIONS}>"
    )
	
	find_library(secp256k1_LIBRARY secp256k1 HINTS ${secp256k1_LIBRARIES})
else()
	message(STATUS "CMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}")

	find_package(OpenMP REQUIRED)
	find_library(JEMALLOC_LIB NAMES jemalloc)
	
	add_compile_options(-Wall -Wno-unused-function -Wno-parentheses -Wno-unused-local-typedefs -Wno-unknown-pragmas)
	
	if(WITH_COVERAGE)
		message(STATUS "Enabling -O0 -coverage")
		add_compile_options(-O0 --coverage)
		add_link_options(-lgcov --coverage)
	endif()
	
	set_source_files_properties(src/vm/Compiler.cpp PROPERTIES COMPILE_FLAGS -Wno-unused-but-set-variable)

	find_library(secp256k1_LIBRARY NAMES secp256k1 PATHS "${CMAKE_CURRENT_SOURCE_DIR}/lib/secp256k1/.libs" NO_DEFAULT_PATH)
	
	if(ENABLE_MEM_SANITIZE)
		message(STATUS "Compiling with -fsanitize=address")
		add_compile_options(-fsanitize=address)
		set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -fsanitize=address")
		set(DISABLE_OPENCL 1)
	elseif(ENABLE_THREAD_SANITIZE)
		message(STATUS "Compiling with -fsanitize=thread")
		add_compile_options(-fsanitize=thread)
		set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -fsanitize=thread")
		set(DISABLE_OPENCL 1)
	endif()
endif()

include(cmake/build_version_json.cmake)

add_library(secp256k1 INTERFACE IMPORTED)
set_target_properties(secp256k1 PROPERTIES INTERFACE_LINK_LIBRARIES ${secp256k1_LIBRARY})

get_filename_component(secp256k1_IMPORT_PREFIX "${secp256k1_LIBRARY}" PATH)
get_filename_component(secp256k1_IMPORT_PREFIX "${secp256k1_IMPORT_PREFIX}" PATH)

set_target_properties(secp256k1 PROPERTIES
		INTERFACE_INCLUDE_DIRECTORIES "${secp256k1_IMPORT_PREFIX}/include"
)

file(GLOB secp256k1_LIBRARY_FILES ${secp256k1_LIBRARY}*)

set(LIBBECH32_BUILD_TESTS OFF CACHE BOOL "LIBBECH32_BUILD_TESTS")
set(LIBBECH32_BUILD_EXAMPLES OFF CACHE BOOL "LIBBECH32_BUILD_EXAMPLES")
set(DIRENT_BUILD_TESTS OFF CACHE STRING "DIRENT_BUILD_TESTS")
set(VNX_BUILD_TOOLS ON CACHE STRING "VNX_BUILD_TOOLS")
set(MMX_BUILD_TOOLS ON CACHE STRING "MMX_BUILD_TOOLS")
set(MMX_BUILD_TESTS ON CACHE STRING "MMX_BUILD_TESTS")
set(NODE_INSTALL_PATH "." CACHE STRING "Where to install scripts")

add_subdirectory(vnx-base)