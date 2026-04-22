@echo off
echo ========================================
echo   FIXING BUSINESS CATEGORY ICON
echo ========================================
echo.
echo The Business category icon has been changed from 💼 to 📊
echo.
echo The code is correct, but your browser cache needs to be cleared.
echo.
echo QUICK FIX OPTIONS:
echo.
echo 1. Hard Refresh (Fastest)
echo    - Open http://localhost:3000/categories
echo    - Press Ctrl + Shift + R (or Ctrl + F5)
echo.
echo 2. Clear Browser Cache
echo    - Press Ctrl + Shift + Delete
echo    - Select "Cached images and files"
echo    - Click "Clear data"
echo.
echo 3. Open in Incognito Mode
echo    - Press Ctrl + Shift + N (Chrome)
echo    - Go to http://localhost:3000/categories
echo.
echo 4. Restart Frontend Server (This script will do it)
echo.
choice /C 4Q /N /M "Press 4 to restart frontend, Q to quit: "
if errorlevel 2 goto :end
if errorlevel 1 goto :restart

:restart
echo.
echo Restarting frontend server...
echo.
echo Please manually:
echo 1. Stop your current frontend server (Ctrl+C in the terminal)
echo 2. Run: cd frontend
echo 3. Run: npm start
echo 4. Open: http://localhost:3000/categories
echo 5. You should now see the chart icon 📊 for Business
echo.
goto :end

:end
echo.
echo ========================================
echo   VERIFICATION
echo ========================================
echo.
echo After clearing cache, you should see:
echo   Business Events: 📊 (chart icon)
echo   Online ^& Virtual Events: 🌐 (globe icon)
echo   Social ^& Personal Events: 🎉 (party icon)
echo.
pause
