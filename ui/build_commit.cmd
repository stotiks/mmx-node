@echo off

set CURRENT_DIR=%~dp0
set WORKTREE_DIR=%CURRENT_DIR%..\..\!ui_dist
set WORKTREE_UI_DIR=%WORKTREE_DIR%\ui

git worktree remove "%WORKTREE_DIR%" --force

git worktree add --detach "%WORKTREE_DIR%" HEAD
if %ERRORLEVEL% neq 0 goto :end

cd "%WORKTREE_UI_DIR%"
call build.cmd
if %ERRORLEVEL% neq 0 goto :end

git add -A
git commit -m "UI: build"
if %ERRORLEVEL% neq 0 goto :end

cd "%CURRENT_DIR%"
for /f %%i in ('git -C "%WORKTREE_DIR%" rev-parse HEAD') do git merge %%i

:end
git worktree remove "%WORKTREE_DIR%"
