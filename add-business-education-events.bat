@echo off
echo ========================================
echo Adding Business and Education Events
echo ========================================
echo.
echo This will add:
echo - 5 Business events
echo - 6 Education events
echo - All with proper images
echo.
pause

cd backend
node addSampleEvents.js

echo.
echo ========================================
echo Done! Check your events page
echo ========================================
echo.
echo New events added in:
echo - Business category
echo - Education category
echo.
pause
