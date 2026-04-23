@echo off
echo ========================================
echo   TESTING 401 ERROR FIX
echo ========================================
echo.
echo This will test if the login system is working properly.
echo.
echo Step 1: Testing backend connection...
cd backend
node diagnose-login.js
echo.
echo ========================================
echo   MANUAL TESTING STEPS
echo ========================================
echo.
echo 1. Make sure both servers are running:
echo    - Backend: cd backend ^&^& node server.js
echo    - Frontend: cd frontend ^&^& npm start
echo.
echo 2. Open browser: http://localhost:3000
echo.
echo 3. Try to login with:
echo    Email: admin@example.com
echo    Password: admin123
echo.
echo 4. If login works, the 401 error is fixed!
echo.
echo 5. Check Business category icon:
echo    - Visit: http://localhost:3000/categories
echo    - Business should show: 📅 (calendar icon)
echo    - Press Ctrl+Shift+R to clear cache if needed
echo.
pause
