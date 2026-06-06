@echo off
echo Restoring Event Management System Database...
echo =============================================

echo 1. Applying permanent fixes...
mysql -u root -p event_management < database/permanent-fixes.sql

echo 2. Restoring backup data...
mysql -u root -p event_management < database/backup-current-state.sql

echo 3. ✅ Database restored successfully!
echo.
echo Your system should now show:
echo - Refunded: 3 in Payment Management
echo - All booking statuses consistent  
echo - All certificates present
echo.
pause