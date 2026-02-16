@echo off
echo ========================================
echo Complete Event Management System Setup
echo ========================================
echo.
echo This will:
echo 1. Add sample events with images
echo 2. Add images to existing events
echo 3. Setup complete system
echo.
pause

echo.
echo Step 1: Adding sample events...
echo ========================================
cd backend
node addSampleEvents.js

echo.
echo Step 2: Adding images to existing events...
echo ========================================
node addImagesToEvents.js

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your system is now ready with:
echo - Sample events with images
echo - All existing events have images
echo - Admin dashboard is functional
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& npm run dev
echo 2. Start frontend: cd frontend ^&^& npm start
echo 3. Login as admin at http://localhost:3000/login
echo 4. Go to Admin Dashboard to manage events
echo.
pause
