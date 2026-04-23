@echo off
echo ========================================
echo Testing All CSV Exports
echo ========================================
echo.
echo Make sure your backend server is running on port 5000!
echo.
pause
cd backend
node testAllCSVExports.js
echo.
pause
