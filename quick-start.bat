@echo off
REM Quick Start Script for Health & Wellness App - Windows

echo.
echo =========================================
echo Health & Wellness App - Quick Start
echo =========================================
echo.

REM Get IP Address
echo Finding your computer's IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do set IP_ADDRESS=%%a
set IP_ADDRESS=%IP_ADDRESS:~1%

echo.
echo Your IP Address: %IP_ADDRESS%
echo.

echo Starting Backend server on port 5000...
cd backend
start cmd /k "npm start"

echo Waiting 3 seconds for backend to start...
timeout /t 3

echo.
echo Starting Frontend server on port 3000...
cd ../frontend
start cmd /k "npm start"

echo.
echo =========================================
echo ✅ SERVERS STARTED
echo =========================================
echo.
echo Access the app:
echo   - Local:     http://localhost:3000
echo   - Network:   http://%IP_ADDRESS%:3000
echo.
echo Share the network URL with other devices on the same Wi-Fi!
echo.
pause
