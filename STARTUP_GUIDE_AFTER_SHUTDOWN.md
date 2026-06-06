# 🚀 Startup Guide After Shutdown

## Issue
After laptop shutdown, all database changes disappear because MySQL data is not persistent. This guide provides **permanent solutions**.

## 🔥 QUICK FIX (1 Click)

**Double-click this file:** `QUICK_FIX_AFTER_RESTART.bat`

This will automatically restore:
- ✅ Refunded payment counts (shows "Refunded: 3" instead of "Refunded: 0")
- ✅ All booking status consistency fixes
- ✅ All missing certificates
- ✅ AI & ML event proper cancellation/refund
- ✅ QR code functionality

## 🛠️ Manual Fix Options

### Option 1: Node.js Script
```bash
cd backend
node applyPermanentFixes.js
```

### Option 2: SQL Script
```bash
mysql -u root -p event_management < database/permanent-fixes.sql
```

### Option 3: Restore from Backup
```bash
mysql -u root -p event_management < database/backup-current-state.sql
```

## 📋 Complete Startup Sequence

1. **Apply fixes** (use any option above)
2. **Start backend**:
   ```bash
   cd backend
   npm start
   ```
3. **Start frontend** (in new terminal):
   ```bash
   cd frontend  
   npm start
   ```
4. **Verify fixes**:
   - Open Payment Management → Should show "Refunded: 3"
   - Check booking tables → All statuses consistent
   - Test QR code generation

## 🔧 What Gets Fixed

### Database Issues Fixed:
- **Status Consistency**: All cancelled events have cancelled/refunded bookings
- **Payment Records**: 3 refunded payments properly recorded  
- **Missing Certificates**: All confirmed bookings have certificates
- **AI & ML Event**: Properly cancelled with refunded payment

### Frontend Issues Fixed:
- **Payment Counter**: Shows "Refunded: 3" instead of "Refunded: 0"
- **Cache Busting**: Fresh data loaded on every refresh
- **QR Integration**: Full UPI payment QR code functionality

## 🎯 Expected Results After Fix

### Payment Management Dashboard:
- Total: 22
- Completed: 19  
- Pending: 0
- Failed: 0
- **Refunded: 3** ✅ (instead of 0)

### Booking Status Examples:
- Jyoti - AI & ML: Event=cancelled, Booking=cancelled, Payment=refunded ✅
- Tech Summit 2026: All statuses consistent ✅
- Ultimate Esports Battle: All statuses consistent ✅

### Certificate Status:
- Confirmed Bookings: 20
- Total Certificates: 20 ✅ (perfect match)

## 🚨 Troubleshooting

### If Quick Fix doesn't work:
1. **Check MySQL is running**
2. **Verify database connection** in backend/.env
3. **Run manually**: `cd backend && node applyPermanentFixes.js`
4. **Clear browser cache** (Ctrl+F5) after applying fixes

### If Payment counter still shows 0:
1. **Hard refresh** browser (Ctrl+F5)
2. **Restart frontend** development server
3. **Check browser console** for API errors

### If QR codes don't work:
1. **Verify** backend/routes/qrRoutes.js exists
2. **Check** QR dependencies installed: `npm list qrcode`
3. **Restart** backend server

## 📁 Important Files Created

- `QUICK_FIX_AFTER_RESTART.bat` - One-click fix
- `database/permanent-fixes.sql` - SQL fix script  
- `database/backup-current-state.sql` - Full database backup
- `backend/applyPermanentFixes.js` - Node.js fix script

## 💡 Prevention

To avoid this issue in future:
1. **Use persistent MySQL setup** (not temporary/in-memory)
2. **Configure MySQL** to save data to disk permanently
3. **Run fix script** after every restart until MySQL is persistent

---
**Note**: These fixes restore the exact working state with all QR code functionality and corrected counters.