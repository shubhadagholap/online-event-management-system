# Debug Login - Step by Step

## 🔍 Quick Diagnosis

Run these checks in order:

### ✅ Check 1: Backend Running?
```cmd
# Visit this URL in browser:
http://localhost:5000/api/health
```

**Expected:** `{"status":"OK","message":"Event Management API is running"}`  
**If fails:** Backend is not running. Run: `cd backend && npm run dev`

---

### ✅ Check 2: Database Connected?

Look at your backend terminal. You should see:
```
✓ Server is running on port 5000
✓ API available at http://localhost:5000/api
✓ MySQL Database connected successfully
```

**If you see database error:** Check your `.env` file and MySQL service

---

### ✅ Check 3: Users Exist?

Run this SQL query:
```sql
SELECT id, name, email, role FROM users;
```

**Expected:** At least 1 user  
**If empty:** Run `create-test-users.bat`

---

### ✅ Check 4: Test Login API Directly

Use curl or Postman:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@test.com\",\"password\":\"admin123\"}"
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

**If 401 Error:**
```json
{
  "message": "Invalid credentials"
}
```
→ User doesn't exist or password is wrong

---

### ✅ Check 5: Frontend API URL

Open `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api'; // ✅ Should be this
```

**If different:** Change it to `http://localhost:5000/api`

---

### ✅ Check 6: Browser Console

1. Open browser (http://localhost:3000/login)
2. Press F12
3. Go to Console tab
4. Try to login
5. Look for errors

**Common errors:**
- `Network Error` → Backend not running
- `401 Unauthorized` → User doesn't exist
- `CORS Error` → Backend CORS not configured (but yours is fine)

---

### ✅ Check 7: Network Tab

1. Press F12
2. Go to Network tab
3. Try to login
4. Click on the `login` request

**Check:**
- **Request URL:** Should be `http://localhost:5000/api/auth/login`
- **Request Method:** POST
- **Status Code:** Should be 200 (not 401)
- **Request Payload:** Should show email and password
- **Response:** Should show token and user data

---

## 🎯 Most Common Issues & Fixes

### Issue 1: "No users in database"
**Fix:**
```cmd
create-test-users.bat
```

### Issue 2: "Backend not running"
**Fix:**
```cmd
cd backend
npm run dev
```

### Issue 3: "Database not connected"
**Fix:**
1. Start MySQL service
2. Check `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=event_management
   ```
3. Verify database exists:
   ```sql
   SHOW DATABASES LIKE 'event_management';
   ```

### Issue 4: "Wrong password"
**Fix:**
Use the test accounts:
- admin@test.com / admin123
- organizer@test.com / organizer123
- user@test.com / user123

### Issue 5: "CORS error"
**Fix:** (Already configured, but if needed)
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 🔧 Complete Test Sequence

Run these commands in order:

```cmd
# 1. Create test users
create-test-users.bat

# 2. Verify users created
mysql -u root -p
USE event_management;
SELECT * FROM users;
exit;

# 3. Start backend
cd backend
npm run dev
# Keep this terminal open

# 4. Start frontend (new terminal)
cd frontend
npm start
# Keep this terminal open

# 5. Test in browser
# Go to: http://localhost:3000/login
# Email: admin@test.com
# Password: admin123
# Click Login
```

---

## 📊 Expected vs Actual

### When Login Works:

**Backend Terminal:**
```
POST /api/auth/login 200 45.123 ms - 234
```

**Browser Console:**
```
(No errors)
```

**Browser Network Tab:**
```
Status: 200 OK
Response: {token: "...", user: {...}}
```

**Result:**
- Redirected to home page
- Name appears in top-right
- Can access protected pages

### When Login Fails (401):

**Backend Terminal:**
```
POST /api/auth/login 401 12.456 ms - 45
```

**Browser Console:**
```
AxiosError: Request failed with status code 401
```

**Browser Network Tab:**
```
Status: 401 Unauthorized
Response: {message: "Invalid credentials"}
```

**Result:**
- Stays on login page
- Error message shown
- Not logged in

---

## 🎓 Understanding the Flow

```
1. User enters email/password
   ↓
2. Frontend sends POST to /api/auth/login
   ↓
3. Backend checks if user exists
   ↓
4. Backend verifies password
   ↓
5. Backend generates JWT token
   ↓
6. Backend sends token + user data
   ↓
7. Frontend stores token in localStorage
   ↓
8. Frontend redirects to home page
   ↓
9. Success! User is logged in
```

**Where it fails (401):**
- Step 3: User doesn't exist → 401
- Step 4: Password wrong → 401

---

## 🚀 Quick Fix Command

If you just want it to work NOW:

```cmd
SETUP_AND_START.bat
```

This does EVERYTHING:
1. Creates test users
2. Adds sample events
3. Starts backend
4. Starts frontend
5. Opens browser

Then login with: **admin@test.com / admin123**

---

## ✅ Final Checklist

Before asking for help, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MySQL service running
- [ ] Database `event_management` exists
- [ ] Users table has at least 1 user
- [ ] Using correct email/password
- [ ] No CORS errors in console
- [ ] API URL is correct in frontend
- [ ] JWT_SECRET is set in .env

If all checked and still failing, check:
- Backend terminal for errors
- Browser console for errors
- Network tab for request details

---

**99% of 401 errors are because no users exist in the database.**

**Solution: Run `create-test-users.bat` and try again!** 🎉
