@echo off
echo ========================================
echo CERTIFICATE SYSTEM SETUP
echo ========================================
echo.

cd backend

echo Step 1: Creating confirmed bookings...
node createConfirmedBookings.js

echo.
echo Step 2: Testing certificate generation...
node testCertificateGeneration.js

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo To generate certificates:
echo 1. Make sure backend is running (node server.js)
echo 2. Login as: organizer@example.com / organizer123
echo 3. Go to Certificates page
echo 4. Click "Auto-Generate Certificates" button
echo.
echo Or use the API directly:
echo   POST http://localhost:5000/api/certificates/organizer/auto-generate
echo   Headers: Authorization: Bearer YOUR_TOKEN
echo   Body: { "event_id": 1 }
echo.
pause
