@ECHO OFF
TITLE Run MMX Exchange Server Script

CALL .\activate.cmd

mmx_exch_server -c config\%NETWORK%\ %MMX_HOME%\config\local\ %*