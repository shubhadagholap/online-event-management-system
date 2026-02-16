@echo off
echo ========================================
echo Add Complete Dummy Data with Images
echo ========================================
echo.
echo This will add:
echo - 10 Categories with descriptions
echo - 40+ Events across all categories
echo - Reliable placeholder images (no broken links)
echo - Proper data for all pages
echo.
pause

cd backend
node addCompleteDummyData.js

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo All pages now have dummy data:
echo - Home page: Featured events
echo - Events page: All events with images
echo - Categories page: All categories
echo - Event details: Full information
echo - Admin dashboard: Statistics
echo.
echo All images use reliable placeholders.
echo No broken image links!
echo.
pause
