@echo off
echo ========================================
echo NPM Install Fix Script
echo ========================================
echo.

echo Step 1: Cleaning npm cache...
npm cache clean --force
echo.

echo Step 2: Installing frontend dependencies...
cd frontend
echo Current directory: %CD%
echo.

echo Removing old node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo.

echo Installing with increased timeout and legacy peer deps...
npm install --legacy-peer-deps --fetch-timeout=60000 --fetch-retries=5
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo Frontend installation successful!
    echo ========================================
    echo.
    
    echo Step 3: Installing backend dependencies...
    cd ..\backend
    echo Current directory: %CD%
    echo.
    
    if exist node_modules rmdir /s /q node_modules
    if exist package-lock.json del package-lock.json
    echo.
    
    npm install
    echo.
    
    if %ERRORLEVEL% EQU 0 (
        echo ========================================
        echo Backend installation successful!
        echo ========================================
        echo.
        echo All dependencies installed successfully!
        echo.
        echo Next steps:
        echo 1. Setup database: mysql -u root -p event_management ^< database/schema.sql
        echo 2. Configure backend/.env with your MySQL password
        echo 3. Start backend: cd backend ^&^& npm start
        echo 4. Start frontend: cd frontend ^&^& npm start
        echo.
    ) else (
        echo Backend installation failed!
        echo Check TROUBLESHOOTING.md for solutions.
    )
) else (
    echo Frontend installation failed!
    echo.
    echo Trying alternative method...
    echo.
    npm install --legacy-peer-deps --fetch-timeout=120000 --fetch-retries=10 --verbose
    
    if %ERRORLEVEL% EQU 0 (
        echo Installation successful with alternative method!
    ) else (
        echo Installation still failing.
        echo Please check TROUBLESHOOTING.md for manual solutions.
    )
)

cd ..
pause
