@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22 or later is required. Install Node.js and run this file again.
  pause
  exit /b 1
)
node -e "if (!(Number(process.versions.node.split('.')[0]) >= 22)) process.exit(1)"
if errorlevel 1 (
  echo Node.js 22 or later is required.
  pause
  exit /b 1
)
call npm.cmd ci --ignore-scripts --no-audit --no-fund
if errorlevel 1 goto failed
call npm.cmd run build
if errorlevel 1 goto failed
call node_modules\.bin\vite.cmd preview --host 127.0.0.1 --port 4170 --strictPort --open
if errorlevel 1 goto failed
exit /b 0
:failed
echo Application startup failed. Review the error above and retry.
pause
exit /b 1
