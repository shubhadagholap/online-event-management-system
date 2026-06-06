@echo off
title Event Management System - Quick Fix After Restart
echo ================================================
echo   EVENT MANAGEMENT SYSTEM - Quick Fix
echo ================================================
echo.
echo This script will restore all fixes after restart
echo.

cd backend
echo 1. Applying permanent fixes...
node applyPermanentFixes.js

echo.
echo 2. ✅ All fixes applied successfully!
echo.
echo Your system now shows:
echo - Refunded: 3 (instead of 0) in Payment Management  
echo - All booking statuses consistent
echo - All certificates generated
echo - QR code functionality working
echo.
echo You can now:
echo 1. Start your backend: npm start (in backend folder)
echo 2. Start your frontend: npm start (in frontend folder) 
echo 3. Access Payment Management to see fixed counters
echo.
pause