@echo off
echo ========================================
echo TESTING CERTIFICATE ENDPOINT
echo ========================================
echo.

echo Checking if backend is running...
curl -s http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Backend server is not running!
    echo Please start it with: cd backend ^&^& node server.js
    pause
    exit /b 1
)

echo.
echo.
echo Backend is running!
echo.
echo ========================================
echo CERTIFICATE SYSTEM STATUS
echo ========================================
echo.

cd backend
node testCertificateGeneration.js

echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.
echo 1. Login to frontend as organizer:
echo    Email: organizer@example.com
echo    Password: organizer123
echo.
echo 2. Go to Certificates page
echo.
echo 3. Click "Auto-Generate Certificates"
echo.
echo 4. Select an event and generate!
echo.
pause
