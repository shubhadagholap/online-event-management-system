# Fix 401 Login Error - Quick Solution

## The Problem
You're getting "Request failed with status code 401" when trying to login.

## The Solution (30 seconds)

### Step 1: Create Test Users
```cmd
# Double-click this file:
create-test-users.bat
```

### Step 2: Login
Go to: http://localhost:3000/login

Use one of these accounts:
- **Email:** admin@test.com **Password:** admin123
- **Email:** organizer@test.com **Password:** organizer123  
- **Email:** user@test.com **Password:** user123

### Step 3: Done!
You should now be logged in successfully.

---

## Alternative: Register New Account

If you prefer to create your own account:

1. Go to: http://localhost:3000/register
2. Fill in your details
3. Choose a role (user/organizer/admin)
4. Click Register
5. Login with your new credentials

---

## Still Not Working?

### Check 1: Backend Running?
```cmd
cd backend
npm run dev
```
Should show: "Server running on port 5000"

### Check 2: Database Connected?
Look at backend terminal - should NOT show database errors

### Check 3: Users Exist?
```sql
SELECT * FROM users;
```
Should show at least one user

---

## Complete Fresh Start

If nothing works, run this:
```cmd
# This does EVERYTHING:
SETUP_AND_START.bat
```

This will:
1. ✅ Create test users
2. ✅ Add sample events
3. ✅ Start servers
4. ✅ Open browser

Then login with: **admin@test.com / admin123**

---

## Test Accounts Reference

| Role | Email | Password | Can Do |
|------|-------|----------|--------|
| Admin | admin@test.com | admin123 | Everything |
| Organizer | organizer@test.com | organizer123 | Create events |
| User | user@test.com | user123 | Book events |

---

**That's it! You should be able to login now.** 🎉
