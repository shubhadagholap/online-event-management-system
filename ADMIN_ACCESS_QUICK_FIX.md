# 🔐 Admin Access - Quick Fix

## Problem: "No token, authorization denied"

This means you need to login again to get a fresh authentication token.

---

## ✅ Quick Fix (2 minutes)

### Step 1: Clear Browser Data
1. Open browser (Chrome/Edge/Firefox)
2. Press **F12** (opens developer tools)
3. Click **Application** tab
4. Click **Clear storage** (left sidebar)
5. Click **Clear site data** button
6. Close the tab

### Step 2: Login Again
1. Open new tab
2. Go to: `http://localhost:3000/login`
3. Login as admin:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`
4. ✅ Fresh token generated!

### Step 3: Try Again
1. Go to the page where you want to delete
2. Click delete button
3. ✅ Should work now!

---

## 🗑️ What You Can Delete as Admin

### Full Delete Access
- ✅ **Users** - Delete any user with all their data
- ✅ **Events** - Delete any event with all related data
- ✅ **Payments** - Delete any payment record
- ✅ **Bookings** - Cancel any booking
- ✅ **Categories** - Delete any category
- ✅ **Announcements** - Delete any announcement

### How to Delete

#### Delete User
```
Manage Users → Find user → Delete → Confirm
```

#### Delete Event
```
Admin Events → Find event → Delete → Confirm
```

#### Delete Payment
```
Payments → Find payment → Delete → Confirm
```

---

## 🔧 Why This Happens

### Token Expiration
- Tokens expire after 7 days
- Browser cache can corrupt tokens
- Logout doesn't always clear token
- Solution: Clear cache and login again

### How Tokens Work
1. **Login** → Server generates JWT token
2. **Store** → Browser saves in localStorage
3. **Send** → Every request includes token
4. **Verify** → Server checks token validity
5. **Expire** → Token becomes invalid after 7 days

---

## 🆘 Still Not Working?

### Check Backend is Running
```bash
# Open browser and go to:
http://localhost:5000/api/health

# Should see:
{"status":"OK","message":"Event Management API is running"}
```

### Check You're Admin
```bash
# After login, open browser console (F12)
# Type:
JSON.parse(localStorage.getItem('user'))

# Should see:
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin"  ← Must be "admin"
}
```

### Check Token Exists
```bash
# In browser console (F12):
localStorage.getItem('token')

# Should see long string starting with:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Complete Fix Checklist

- [ ] Backend is running (port 5000)
- [ ] Frontend is running (port 3000)
- [ ] Cleared browser cache (F12 > Application > Clear storage)
- [ ] Logged out completely
- [ ] Closed browser tab
- [ ] Opened new tab
- [ ] Logged in as admin (admin@example.com / admin123)
- [ ] Token exists in localStorage
- [ ] User role is "admin"
- [ ] Tried delete again

---

## 🎯 Quick Commands

### Clear Cache (Browser Console)
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check Token (Browser Console)
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Test Backend (Command Line)
```bash
curl http://localhost:5000/api/health
```

---

## ✅ Summary

**Problem:** "No token, authorization denied"

**Solution:**
1. Clear browser cache (F12 > Application > Clear storage)
2. Login again (admin@example.com / admin123)
3. Try delete again

**Result:** ✅ Fresh token, full admin access!

---

## 📚 More Help

- **Complete Guide:** `ADMIN_DELETE_ACCESS_FIXED.md`
- **Admin Features:** `ADMIN_FEATURES_GUIDE.md`
- **All Credentials:** `ALL_USER_CREDENTIALS.md`
- **Login Issues:** `LOGIN_AND_DASHBOARD_FIXED.md`

---

**Run this for automated check:**
```bash
fix-admin-access.bat
```
