@echo off
echo ========================================
echo TESTING DASHBOARD FIX
echo ========================================
echo.

cd backend

echo Checking dashboard statistics...
node checkDashboardStats.js

echo.
echo ========================================
echo VERIFICATION
echo ========================================
echo.
echo The dashboard should now show:
echo   Total Users: 9 (was showing 4)
echo   - Admins: 2
echo   - Organizers: 3
echo   - Regular Users: 4
echo.
echo To verify in browser:
echo   1. Login as admin: admin@example.com / admin123
echo   2. Go to Admin Dashboard
echo   3. Check "Total Users" card
echo   4. Should show: 9 users
echo.
echo If still showing old count:
echo   1. Logout
echo   2. Clear browser cache (F12 ^> Application ^> Clear storage)
echo   3. Login again
echo   4. Check dashboard
echo.
pause
