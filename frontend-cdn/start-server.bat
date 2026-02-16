@echo off
echo Starting Event Management System (CDN Version)
echo.
echo Frontend will be available at: http://localhost:3000
echo.
echo Make sure backend is running on port 5000!
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 3000
