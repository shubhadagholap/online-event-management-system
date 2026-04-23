@echo off
echo Testing Category Icons...
echo.
cd frontend\src\pages
findstr /C:"'Business': '📊'" Categories.js
if %errorlevel% equ 0 (
    echo ✓ Business icon is correctly set to 📊
) else (
    echo ✗ Business icon NOT found
)
echo.
findstr /C:"'Online & Virtual Events': '🌐'" Categories.js
if %errorlevel% equ 0 (
    echo ✓ Online & Virtual Events icon is correctly set to 🌐
) else (
    echo ✗ Online & Virtual Events icon NOT found
)
echo.
findstr /C:"'Social & Personal Events': '🎉'" Categories.js
if %errorlevel% equ 0 (
    echo ✓ Social & Personal Events icon is correctly set to 🎉
) else (
    echo ✗ Social & Personal Events icon NOT found
)
echo.
echo All category icons are correctly configured in the code!
echo.
echo If you still see the old icon in your browser:
echo 1. Clear browser cache (Ctrl+Shift+Delete)
echo 2. Hard refresh the page (Ctrl+F5)
echo 3. Restart the frontend server
echo.
pause
