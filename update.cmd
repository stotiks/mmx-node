@ECHO OFF

git pull && git submodule update --init --recursive && make_release.cmd