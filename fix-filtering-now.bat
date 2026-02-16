@echo off
color 0C
echo ========================================
echo FIX CATEGORY FILTERING - Quick Fix
echo ========================================
echo.
echo This will:
echo 1. Check what's wrong
echo 2. Add categories if missing
echo 3. Add events with proper categories
echo 4. Show you the results
echo.
pause

echo.
echo Step 1: Checking current state...
echo ========================================
cd backend
call node debugCategories.js

echo.
echo.
echo Step 2: Adding sample data...
echo ========================================
call node addSampleEvents.js

echo.
echo.
echo Step 3: Verifying fix...
echo ========================================
call node debugCategories.js

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Now test:
echo 1. Go to: http://localhost:3000/categories
echo 2. Click "Business" or "Education"
echo 3. Should show filtered events
echo.
echo Or use dropdown:
echo 1. Go to: http://localhost:3000/events
echo 2. Select category from dropdown
echo 3. Should filter immediately
echo.
pause
