@echo off
echo ========================================
echo FIX HOME PAGE IMAGES - ONE CLICK
echo ========================================
echo.
echo This will:
echo 1. Add 40+ events with images
echo 2. Verify data was added
echo 3. Show you what to do next
echo.
pause

echo.
echo Step 1: Adding dummy data...
echo ========================================
cd backend
call node addCompleteDummyData.js

echo.
echo.
echo Step 2: Verifying data...
echo ========================================
call node -e "const mysql = require('mysql2/promise'); const check = async () => { const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'event_management' }); const [events] = await conn.execute('SELECT COUNT(*) as total FROM events WHERE status=\"upcoming\"'); const [images] = await conn.execute('SELECT COUNT(*) as total FROM events WHERE image_url IS NOT NULL'); console.log(''); console.log('Upcoming Events:', events[0].total); console.log('Events with Images:', images[0].total); console.log(''); if (events[0].total > 0 && images[0].total > 0) { console.log('SUCCESS! Data is ready.'); } else { console.log('WARNING: No data found. Check MySQL connection.'); } await conn.end(); }; check().catch(e => console.error('Error:', e.message));"

cd ..

echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.
echo 1. Make sure backend is running:
echo    cd backend
echo    npm start
echo.
echo 2. Make sure frontend is running:
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser:
echo    http://localhost:3000
echo.
echo 4. You should see:
echo    - 6 event cards with images
echo    - Purple placeholder images
echo    - Category badges
echo    - Prices and details
echo.
echo If images still don't show:
echo - Check browser console (F12)
echo - Hard refresh: Ctrl+Shift+R
echo - Clear browser cache
echo.
echo ========================================
echo Read: IMAGE_FIX_CHECKLIST.md
echo ========================================
echo.
pause
