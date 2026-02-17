@echo off
echo ========================================
echo Event Management System - Database Setup
echo ========================================
echo.

echo This script will help you set up the database.
echo.
echo Prerequisites:
echo - MySQL must be installed and running
echo - You need to know your MySQL root password
echo.

set /p MYSQL_PASSWORD="Enter your MySQL root password: "
echo.

echo Step 1: Creating database...
mysql -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS event_management;"

if %ERRORLEVEL% EQU 0 (
    echo ✓ Database created successfully!
    echo.
    
    echo Step 2: Importing schema...
    mysql -u root -p%MYSQL_PASSWORD% event_management < database\schema.sql
    
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Schema imported successfully!
        echo.
        
        echo Step 3: Verifying data...
        echo.
        echo Users in database:
        mysql -u root -p%MYSQL_PASSWORD% event_management -e "SELECT id, name, email, role FROM users;"
        echo.
        echo Events in database:
        mysql -u root -p%MYSQL_PASSWORD% event_management -e "SELECT id, title, date, location FROM events;"
        echo.
        echo Categories in database:
        mysql -u root -p%MYSQL_PASSWORD% event_management -e "SELECT id, name FROM categories;"
        echo.
        
        echo ========================================
        echo Database setup complete!
        echo ========================================
        echo.
        echo Next steps:
        echo 1. Update backend/.env with your MySQL password
        echo 2. Start backend: cd backend ^&^& npm start
        echo 3. Open frontend: frontend-cdn/app.html
        echo.
        echo Test credentials:
        echo - Admin: admin@example.com / admin123
        echo - Organizer: organizer@example.com / organizer123
        echo - User: user@example.com / user123
        echo.
        echo Note: You need to generate proper password hashes!
        echo Run: cd backend ^&^& node generateHash.js
        echo Then update the users in database with new hashes.
        echo.
    ) else (
        echo ✗ Failed to import schema!
        echo Check database/schema.sql file exists.
    )
) else (
    echo ✗ Failed to create database!
    echo Check MySQL is running and password is correct.
)

pause
