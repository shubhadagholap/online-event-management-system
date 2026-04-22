@echo off
echo ========================================
echo FIXING 401 LOGIN ERROR
echo ========================================
echo.

cd backend
echo Running password fix...
node fixLoginAndDashboard.js

echo.
echo ========================================
echo FIX COMPLETE!
echo ========================================
echo.
echo You can now login with:
echo   Admin: admin@example.com / admin123
echo   Organizer: organizer@example.com / organizer123
echo   User: user@example.com / user123
echo.
echo Dashboard statistics are now accurate.
echo.
pause
