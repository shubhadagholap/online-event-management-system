# Backend Setup Guide

## You're seeing "Missing script: dev" because npm packages aren't installed yet!

### Step 1: Install Backend Dependencies

```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies
npm install
```

If npm install fails with network error, try:
```bash
npm install --fetch-timeout=60000 --fetch-retries=5
```

### Step 2: Configure Environment

Edit `backend/.env` file and set your MySQL password:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=event_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
JWT_EXPIRE=7d
```

### Step 3: Setup Database

```bash
# Create database and import schema
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE event_management;
exit;
```

Import schema:
```bash
mysql -u root -p event_management < ../database/schema.sql
```

### Step 4: Generate Password Hashes (Optional)

```bash
node generateHash.js
```

This will show you password hashes for the default users.

### Step 5: Start the Backend

**Option A: Production mode (no auto-reload)**
```bash
npm start
```

**Option B: Development mode (auto-reload with nodemon)**
```bash
npm run dev
```

You should see:
```
✓ MySQL Database connected successfully
✓ Server is running on port 5000
✓ API available at http://localhost:5000/api
```

## Available Scripts

- `npm start` - Start server (production mode)
- `npm run dev` - Start server with nodemon (development mode, auto-reload)

## Testing the Backend

Once running, test the API:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all events
curl http://localhost:5000/api/events

# Get all categories
curl http://localhost:5000/api/categories
```

Or open in browser:
- http://localhost:5000/api/health
- http://localhost:5000/api/events
- http://localhost:5000/api/categories

## Troubleshooting

### "Cannot find module 'express'"
- Run `npm install` first

### "Missing script: dev"
- Run `npm install` first to install nodemon

### "Error connecting to database"
- Check MySQL is running
- Verify credentials in .env
- Make sure database exists

### "Port 5000 already in use"
- Change PORT in .env to 5001
- Or stop the process using port 5000

### npm install fails
- Try: `npm install --fetch-timeout=60000 --fetch-retries=5`
- Or use Yarn: `yarn install`
- Or try on different network

## Quick Start Commands

```bash
# Full setup
cd backend
npm install
# Edit .env with your MySQL password
npm start

# In another terminal, start frontend
cd frontend-cdn
# Just open index.html in browser
```

## What Gets Installed

Backend dependencies (small, should install fine):
- express - Web framework
- mysql2 - Database driver
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - CORS handling
- express-validator - Input validation
- nodemon - Auto-reload (dev only)

Total size: ~50MB (much smaller than frontend!)

## After Installation

Once backend is running:
1. ✅ Test API endpoints
2. ✅ Open frontend-cdn/index.html
3. ✅ Login and test features

---

**TL;DR:**
```bash
cd backend
npm install
npm start
```
