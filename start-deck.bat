@echo off
rem Starts the deck with live reload. Leave this window open while editing or presenting.
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. You can still open index.html directly. & pause & exit /b)
start "" http://localhost:5300
node scripts\serve.mjs
