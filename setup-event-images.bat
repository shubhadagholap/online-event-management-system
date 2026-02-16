@echo off
echo ========================================
echo Setup Event Images
echo ========================================
echo.
echo This will help you set up event images for your application.
echo.
echo Step 1: Create Default Fallback Image
echo ========================================
echo.
echo Option A: Use HTML Generator (Recommended)
echo 1. Open create-default-image.html in your browser
echo 2. Click "Generate Image"
echo 3. Click "Download Image"
echo 4. Save as default-event.jpg
echo 5. Place in frontend\public\images\events\
echo.
echo Option B: Download from URL
echo Visit: https://via.placeholder.com/800x400/667eea/ffffff?text=Event+Image
echo Right-click and "Save Image As..." to frontend\public\images\events\default-event.jpg
echo.
pause
echo.
echo Step 2: Verify Directory Structure
echo ========================================
echo.

if not exist "frontend\public\images\events" (
    echo Creating images directory...
    mkdir "frontend\public\images\events"
    echo ✓ Directory created: frontend\public\images\events
) else (
    echo ✓ Directory exists: frontend\public\images\events
)

echo.
echo Step 3: Check for Default Image
echo ========================================
echo.

if exist "frontend\public\images\events\default-event.jpg" (
    echo ✓ Default image found: default-event.jpg
) else (
    echo ✗ Default image NOT found: default-event.jpg
    echo.
    echo Please create the default image using one of these methods:
    echo 1. Open create-default-image.html in browser
    echo 2. Download from: https://via.placeholder.com/800x400/667eea/ffffff?text=Event+Image
    echo 3. Use your own 800x400px image
    echo.
)

echo.
echo Step 4: Add Event Images (Optional)
echo ========================================
echo.
echo You can add custom images for your events:
echo.
echo 1. Place images in: frontend\public\images\events\
echo 2. Name them descriptively: rock-festival.jpg, tech-summit.jpg
echo 3. Update database:
echo    UPDATE events SET image_url = '/images/events/your-image.jpg' WHERE id = 1;
echo.
echo Or use the dummy data script which includes placeholder images:
echo    add-complete-dummy-data.bat
echo.
pause

echo.
echo Step 5: Test Images
echo ========================================
echo.
echo 1. Start backend:
echo    cd backend
echo    npm start
echo.
echo 2. Start frontend (new terminal):
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser:
echo    http://localhost:3000
echo.
echo 4. Check images display correctly on:
echo    - Home page (6 events)
echo    - Events page (all events)
echo    - Event details page
echo.
pause

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Create default-event.jpg if not done yet
echo 2. Add custom event images (optional)
echo 3. Run: add-complete-dummy-data.bat (adds events with images)
echo 4. Test in browser
echo.
echo Documentation:
echo - IMAGE_IMPLEMENTATION_GUIDE.md (Complete guide)
echo - frontend\public\images\events\README.md (Image specs)
echo - create-default-image.html (Generate default image)
echo.
echo Troubleshooting:
echo - Check browser console (F12) for errors
echo - Verify file paths in database
echo - Ensure default-event.jpg exists
echo - Hard refresh browser (Ctrl+Shift+R)
echo.
pause
