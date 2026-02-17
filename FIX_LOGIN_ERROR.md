# Fix Login 401 Error

## Problem
You're getting a "Request failed with status code 401" error when trying to login. This means the authentication is failing.

## Cause
The 401 error happens when:
1. The user doesn't exist in the database
2. The password is incorrect
3. The password hash doesn't match

## Solution

### Quick Fix (Recommended)

**Run this command to create test users:**
```cmd
# Double-click this file:
create-test-users.bat
```

This will create 3 test accounts:
- **Admin:** admin@test.com / admin123
- **Organizer:** organizer@test.com / organizer123
- **User:** user@test.com / user123

### Manual Fix

If you want to create users manually:

#### Option 1: Register Through UI
1. Go to: http://localhost:3000/register
2. Fill in the registration form
3. Choose your role (user/organizer/admin)
4. Click Register
5. Then login with those credentials

#### Option 2: Use Database Script
```cmd
cd backend
node createTestUsers.js
```

#### Option 3: Direct SQL
```sql
-- First, generate a password hash using the generateHash.js script
cd backend
node generateHash.js yourpassword

-- Then insert user with the hash
INSERT INTO users (name, email, password, role) 
VALUES ('Your Name', 'your@email.com', 'PASTE_HASH_HERE', 'admin');
```

## Test Accounts Created

After running `create-test-users.bat`, you'll have:

### Admin Account
```
Email: admin@test.com
Password: admin123
Role: admin
```
**Can do:** Everything (manage all events, users, categories, bookings)

### Organizer Account
```
Email: organizer@test.com
Password: organizer123
Role: organizer
```
**Can do:** Create and manage own events, view event bookings

### User Account
```
Email: user@test.com
Password: user123
Role: user
```
**Can do:** Browse events, book events, view tickets

## Verify Users Exist

Check if users are in the database:

```sql
-- Check all users
SELECT id, name, email, role FROM users;

-- Check test users specifically
SELECT id, name, email, role FROM users WHERE email LIKE '%@test.com';
```

## Common Issues

### Issue 1: "User already exists"
**Solution:** The user is already in the database. Try logging in with the existing credentials or use a different email.

### Issue 2: Backend not running
**Solution:** Make sure backend is running:
```cmd
cd backend
npm run dev
```

### Issue 3: Database not connected
**Solution:** Check your `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_management
```

### Issue 4: Wrong password
**Solution:** 
- Use the test accounts created by the script
- Or register a new account
- Or reset password in database

## Step-by-Step Login Process

1. **Create test users:**
   ```cmd
   create-test-users.bat
   ```

2. **Start backend:**
   ```cmd
   cd backend
   npm run dev
   ```

3. **Start frontend:**
   ```cmd
   cd frontend
   npm start
   ```

4. **Login:**
   - Go to: http://localhost:3000/login
   - Email: admin@test.com
   - Password: admin123
   - Click Login

5. **Success!**
   - You should be redirected to home page
   - Your name appears in top-right corner
   - You can access admin features

## Debugging

### Check Backend Logs
Look at your backend terminal for errors:
```
Login error: [error message]
```

### Check Browser Console
Press F12 and look at Console tab:
```
AxiosError: Request failed with status code 401
```

### Check Network Tab
Press F12 → Network tab → Click on the failed request:
- **Status:** 401 Unauthorized
- **Response:** Should show error message

### Test Backend Directly
Use curl or Postman to test:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

Should return:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

## Password Hashing

If you need to create a password hash manually:

```cmd
cd backend
node generateHash.js yourpassword
```

This will output a bcrypt hash you can use in SQL:
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Name', 'email@test.com', '$2b$10$...hash...', 'admin');
```

## Complete Setup Script

For a fresh start with everything:

```cmd
# Run complete setup
SETUP_AND_START.bat
```

This will:
1. Add sample events
2. Add images
3. Create test users (if you add it to the script)
4. Start servers

## Quick Test

After creating test users, test each role:

### Test Admin:
1. Login: admin@test.com / admin123
2. Check: Admin menu appears
3. Go to: Admin → Dashboard
4. Try: Create an event

### Test Organizer:
1. Login: organizer@test.com / organizer123
2. Check: Organizer menu appears
3. Go to: Organizer → My Events
4. Try: Create an event

### Test User:
1. Login: user@test.com / user123
2. Check: My Account menu appears
3. Go to: Events
4. Try: Book an event

## Still Having Issues?

1. **Clear browser cache:**
   - Press Ctrl + Shift + Delete
   - Clear cached images and files
   - Reload page

2. **Clear localStorage:**
   - Press F12
   - Go to Application tab
   - Storage → Local Storage
   - Right-click → Clear
   - Reload page

3. **Restart servers:**
   - Stop both backend and frontend (Ctrl+C)
   - Start backend first
   - Then start frontend

4. **Check database:**
   ```sql
   -- Verify database exists
   SHOW DATABASES LIKE 'event_management';
   
   -- Verify users table exists
   SHOW TABLES LIKE 'users';
   
   -- Check users
   SELECT * FROM users;
   ```

5. **Recreate database:**
   ```cmd
   setup-database.bat
   ```

## Success Indicators

After successful login:
- ✅ Redirected to home page
- ✅ Your name appears in top-right
- ✅ Role-specific menu appears
- ✅ No error messages
- ✅ Can navigate to protected pages

## Next Steps

Once login works:
1. Test profile page
2. Browse events
3. Try booking an event
4. Test role-specific features
5. Create your own events (if organizer/admin)

## Need More Help?

Check these files:
- `TROUBLESHOOTING.md` - General troubleshooting
- `COMPLETE_FIX_GUIDE.md` - Complete system fixes
- `API_DOCUMENTATION.md` - API reference
- `QUICK_REFERENCE.md` - Quick commands
