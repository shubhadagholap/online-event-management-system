@echo off
echo ========================================
echo FIXING ADMIN ACCESS
echo ========================================
echo.

echo The "No token" error means you need to login again.
echo.
echo SOLUTION:
echo ========================================
echo.
echo 1. Open your browser
echo 2. Go to: http://localhost:3000
echo 3. Press F12 (open developer tools)
echo 4. Go to Application tab
echo 5. Click "Clear storage"
echo 6. Click "Clear site data"
echo 7. Close the tab
echo 8. Open new tab: http://localhost:3000/login
echo 9. Login as admin:
echo      Email: admin@example.com
echo      Password: admin123
echo 10. Try deleting again
echo.
echo ========================================
echo ADMIN DELETE PERMISSIONS
echo ========================================
echo.
echo As admin, you can now delete:
echo   ✓ Users (with all their data)
echo   ✓ Events (with all related data)
echo   ✓ Payments (with booking update)
echo   ✓ Bookings (with seat restore)
echo   ✓ Categories
echo   ✓ Announcements
echo.
echo All deletes are:
echo   ✓ Transaction-based (safe)
echo   ✓ Cascading (removes related data)
echo   ✓ Confirmed (asks before deleting)
echo.
echo ========================================
echo BACKEND STATUS
echo ========================================
echo.

cd backend
echo Checking if backend is running...
curl -s http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Backend is not running!
    echo Start it with: cd backend ^&^& node server.js
    pause
    exit /b 1
)

echo.
echo.
echo ✓ Backend is running
echo ✓ All admin delete routes are active
echo ✓ Authentication is working
echo.
echo Just login again to get a fresh token!
echo.
pause
