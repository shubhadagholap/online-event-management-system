@echo off
color 0A
echo ========================================
echo Event Management System - Complete Setup
echo ========================================
echo.
echo This will:
echo 1. Create test user accounts
echo 2. Add sample events with images
echo 3. Add images to existing events  
echo 4. Setup complete system
echo 5. Start both servers
echo.
echo Make sure you have:
echo - MySQL running
echo - Database created
echo - npm packages installed
echo.
pause

echo.
echo ========================================
echo Step 1: Creating Test Users
echo ========================================
cd backend
call node createTestUsers.js

echo.
echo ========================================
echo Step 2: Adding Complete Dummy Data
echo ========================================
call node addCompleteDummyData.js

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Test Accounts Created:
echo - Admin: admin@test.com / admin123
echo - Organizer: organizer@test.com / organizer123
echo - User: user@test.com / user123
echo.
echo Starting servers...
echo Backend will start on http://localhost:5000
echo Frontend will start on http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop servers
echo.
pause

echo.
echo Starting Backend Server...
start cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login with:
echo - admin@test.com / admin123
echo - organizer@test.com / organizer123
echo - user@test.com / user123
echo.
echo Your browser should open automatically.
echo If not, visit: http://localhost:3000/login
echo.
pause
