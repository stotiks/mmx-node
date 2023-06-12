@ECHO OFF
TITLE MMX Make Release Script

IF "%CMAKE_BUILD_PRESET%"=="" (
	SET CMAKE_BUILD_PRESET=windows-release
)

cmake --preset %CMAKE_BUILD_PRESET% && ^
cmake --build --preset %CMAKE_BUILD_PRESET%
