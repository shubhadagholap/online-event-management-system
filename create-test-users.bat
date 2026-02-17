@echo off
echo ========================================
echo Creating Test Users
echo ========================================
echo.
echo This will create 3 test accounts:
echo.
echo 1. Admin Account
echo    Email: admin@test.com
echo    Password: admin123
echo.
echo 2. Organizer Account
echo    Email: organizer@test.com
echo    Password: organizer123
echo.
echo 3. User Account
echo    Email: user@test.com
echo    Password: user123
echo.
pause

cd backend
node createTestUsers.js

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo You can now login at:
echo http://localhost:3000/login
echo.
pause
