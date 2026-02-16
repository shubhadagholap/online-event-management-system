@echo off
echo ========================================
echo Verify Images and Events
echo ========================================
echo.
echo This will check:
echo - How many events exist
echo - How many have images
echo - Which categories have events
echo.
pause

cd backend
node -e "const mysql = require('mysql2/promise'); const checkData = async () => { const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'event_management' }); console.log('\n=== EVENTS CHECK ===\n'); const [events] = await conn.execute('SELECT COUNT(*) as total FROM events'); console.log('Total Events:', events[0].total); const [upcoming] = await conn.execute('SELECT COUNT(*) as total FROM events WHERE status=\"upcoming\"'); console.log('Upcoming Events:', upcoming[0].total); const [withImages] = await conn.execute('SELECT COUNT(*) as total FROM events WHERE image_url IS NOT NULL'); console.log('Events with Images:', withImages[0].total); console.log('\n=== SAMPLE EVENTS ===\n'); const [samples] = await conn.execute('SELECT title, status, image_url FROM events LIMIT 5'); samples.forEach((e, i) => { console.log(`${i+1}. ${e.title}`); console.log(`   Status: ${e.status}`); console.log(`   Image: ${e.image_url ? 'YES' : 'NO'}`); console.log(''); }); console.log('\n=== CATEGORIES ===\n'); const [cats] = await conn.execute('SELECT c.name, COUNT(e.id) as event_count FROM categories c LEFT JOIN events e ON c.id = e.category_id GROUP BY c.id, c.name'); cats.forEach(c => { console.log(`${c.name}: ${c.event_count} events`); }); await conn.end(); }; checkData().catch(console.error);"

echo.
echo ========================================
echo Check Complete!
echo ========================================
echo.
echo If you see:
echo - 40+ total events: Good!
echo - 40+ upcoming events: Good!
echo - 40+ events with images: Good!
echo.
echo If numbers are low or zero:
echo - Run: add-complete-dummy-data.bat
echo.
pause
