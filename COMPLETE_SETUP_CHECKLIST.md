# Complete Setup Checklist

## 🎯 Your Current Issue

You're seeing:
- ❌ Login doesn't work
- ❌ Register doesn't work
- ❌ No events showing

**Root Cause**: Database not set up!

## ✅ Complete Setup Steps

### Step 1: Database Setup (REQUIRED!)

**Option A: Use the automated script**
```bash
setup-database.bat
```

**Option B: Manual setup**
```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE event_management;
exit;

# 2. Import schema
mysql -u root -p event_management < database/schema.sql

# 3. Verify
mysql -u root -p event_management
SELECT * FROM users;
SELECT * FROM events;
exit;
```

### Step 2: Generate Password Hashes

```bash
cd backend
node generateHash.js
```

Copy the hashes and update the database:
```sql
mysql -u root -p event_management

UPDATE users SET password = 'HASH_FROM_SCRIPT' WHERE email = 'admin@example.com';
UPDATE users SET password = 'HASH_FROM_SCRIPT' WHERE email = 'organizer@example.com';
UPDATE users SET password = 'HASH_FROM_SCRIPT' WHERE email = 'user@example.com';

exit;
```

### Step 3: Configure Backend

Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=event_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
JWT_EXPIRE=7d
```

### Step 4: Install & Start Backend

```bash
cd backend
npm install
npm start
```

You should see:
```
✓ MySQL Database connected successfully
✓ Server is running on port 5000
```

### Step 5: Test Backend API

Open in browser:
- http://localhost:5000/api/health → Should return {"status":"OK"}
- http://localhost:5000/api/events → Should return array of 3 events
- http://localhost:5000/api/categories → Should return array of 5 categories

### Step 6: Open Frontend

```bash
cd frontend-cdn
# Double-click app.html
```

### Step 7: Test Login

Use these credentials:
- **Admin**: admin@example.com / admin123
- **Organizer**: organizer@example.com / organizer123
- **User**: user@example.com / user123

## 🔍 Verification Checklist

### Database
- [ ] MySQL is running
- [ ] Database `event_management` exists
- [ ] Table `users` has 3 rows
- [ ] Table `events` has 3 rows
- [ ] Table `categories` has 5 rows
- [ ] Table `bookings` exists (empty is OK)
- [ ] Table `tickets` exists (empty is OK)

### Backend
- [ ] `backend/.env` file configured
- [ ] `backend/node_modules` folder exists
- [ ] Backend starts without errors
- [ ] Can access http://localhost:5000/api/health
- [ ] Can access http://localhost:5000/api/events
- [ ] Events API returns data

### Frontend
- [ ] `frontend-cdn/app.html` opens in browser
- [ ] Homepage shows 3 events
- [ ] Can click on events
- [ ] Login page loads
- [ ] Register page loads

### Functionality
- [ ] Can login with admin@example.com
- [ ] Can register new user
- [ ] Can browse events
- [ ] Can search events
- [ ] Can filter by category
- [ ] Events show correct data

## 🐛 Common Issues & Solutions

### Issue: "Database doesn't exist"
**Solution**:
```sql
CREATE DATABASE event_management;
```

### Issue: "Table doesn't exist"
**Solution**:
```bash
mysql -u root -p event_management < database/schema.sql
```

### Issue: "No events showing"
**Solution**:
```sql
-- Check if events exist
SELECT * FROM events;

-- If empty, insert sample events
INSERT INTO events (title, description, date, location, capacity, available_seats, price, organizer_id, category_id) VALUES
('Tech Summit 2026', 'Annual technology conference', '2026-03-15 09:00:00', 'Convention Center, NYC', 500, 500, 99.99, 2, 1);
```

### Issue: "Login fails"
**Solution**:
1. Generate password hashes: `node backend/generateHash.js`
2. Update users table with correct hashes
3. Make sure you're using the correct password

### Issue: "Cannot connect to database"
**Solution**:
- Check MySQL is running
- Verify `backend/.env` has correct credentials
- Test connection: `mysql -u root -p`

### Issue: "Backend won't start"
**Solution**:
```bash
cd backend
rm -rf node_modules
npm cache clean --force
npm install
npm start
```

## 📊 Expected Results

### After Complete Setup:

**Backend Terminal**:
```
✓ MySQL Database connected successfully
✓ Server is running on port 5000
✓ API available at http://localhost:5000/api
```

**Browser (http://localhost:5000/api/events)**:
```json
[
  {
    "id": 1,
    "title": "Tech Summit 2026",
    "description": "Annual technology conference",
    "date": "2026-03-15T09:00:00.000Z",
    "location": "Convention Center, NYC",
    "price": "99.99",
    ...
  },
  ...
]
```

**Frontend (frontend-cdn/app.html)**:
- Homepage shows 3 event cards
- Each card has title, date, location, price
- "Browse All Events" button works
- Login page accessible
- Register page accessible

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ Backend starts without errors
2. ✅ API endpoints return data
3. ✅ Frontend shows events on homepage
4. ✅ Can login with test credentials
5. ✅ Can register new users
6. ✅ Can browse and search events
7. ✅ No console errors in browser (F12)

## 📞 Quick Commands

```bash
# Complete setup in order:
mysql -u root -p -e "CREATE DATABASE event_management;"
mysql -u root -p event_management < database/schema.sql
cd backend && node generateHash.js
# Update .env file
cd backend && npm install && npm start
# Open frontend-cdn/app.html

# Verify database:
mysql -u root -p event_management -e "SELECT COUNT(*) FROM users;"
mysql -u root -p event_management -e "SELECT COUNT(*) FROM events;"

# Test API:
curl http://localhost:5000/api/health
curl http://localhost:5000/api/events
```

## 📚 Related Documentation

- **DATABASE_SETUP_GUIDE.md** - Detailed database setup
- **BACKEND_SETUP.md** - Backend configuration
- **SIMPLE_START_GUIDE.md** - Quick start guide
- **FRONTEND_SOLUTION.md** - Frontend options

---

**Remember**: Database setup is the FIRST and MOST IMPORTANT step!
