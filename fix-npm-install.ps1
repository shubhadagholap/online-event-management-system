# NPM Install Fix Script (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NPM Install Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host ""

Write-Host "Step 2: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

Write-Host "Removing old node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
}
Write-Host ""

Write-Host "Installing with increased timeout and legacy peer deps..." -ForegroundColor Yellow
npm install --legacy-peer-deps --fetch-timeout=60000 --fetch-retries=5

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Frontend installation successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Step 3: Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location ..\backend
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
    Write-Host ""
    
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    }
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    }
    Write-Host ""
    
    npm install
    Write-Host ""
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Backend installation successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "All dependencies installed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Setup database: mysql -u root -p event_management < database/schema.sql" -ForegroundColor White
        Write-Host "2. Configure backend/.env with your MySQL password" -ForegroundColor White
        Write-Host "3. Start backend: cd backend && npm start" -ForegroundColor White
        Write-Host "4. Start frontend: cd frontend && npm start" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "Backend installation failed!" -ForegroundColor Red
        Write-Host "Check TROUBLESHOOTING.md for solutions." -ForegroundColor Yellow
    }
} else {
    Write-Host "Frontend installation failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    Write-Host ""
    npm install --legacy-peer-deps --fetch-timeout=120000 --fetch-retries=10 --verbose
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Installation successful with alternative method!" -ForegroundColor Green
    } else {
        Write-Host "Installation still failing." -ForegroundColor Red
        Write-Host "Please check TROUBLESHOOTING.md for manual solutions." -ForegroundColor Yellow
    }
}

Set-Location ..
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
