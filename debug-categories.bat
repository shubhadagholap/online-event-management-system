@echo off
echo ========================================
echo Category Filtering Debug Tool
echo ========================================
echo.
echo This will check:
echo - If categories exist
echo - If events are assigned to categories
echo - Business and Education category details
echo - Provide test URLs
echo.
pause

cd backend
node debugCategories.js

echo.
pause
