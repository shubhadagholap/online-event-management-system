# Quick Start - Event Management System

Get up and running in 5 minutes!

## Prerequisites
- Node.js installed
- MySQL installed and running
- Terminal/Command Prompt

## Step 1: Database (2 minutes)

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE event_management;
exit;

# Import schema
mysql -u root -p event_management < database/schema.sql
```

## Step 2: Backend (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Update .env file with your MySQL password
# (File already exists, just update DB_PASSWORD)

# Generate password hashes for default users
node generateHash.js

# Start server
npm start
```

Backend runs on: http://localhost:5000

## Step 3: Frontend (1 minute)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start app
npm start
```

**If npm install fails with ECONNRESET error:**
- Run the fix script: `fix-npm-install.bat` (or `fix-npm-install.ps1` for PowerShell)
- Or manually: `npm cache clean --force` then `npm install --legacy-peer-deps --fetch-timeout=60000`
- See TROUBLESHOOTING.md for more solutions

Frontend opens automatically at: http://localhost:3000

## Step 4: Test (1 minute)

1. Open http://localhost:3000
2. Click "Register" and create an account
3. Or login with default credentials:
   - Email: admin@example.com
   - Password: admin123

## Default Users

After running `generateHash.js`, update the schema.sql with new hashes, then:

- **Admin**: admin@example.com / admin123
- **Organizer**: organizer@example.com / organizer123  
- **User**: user@example.com / user123

## Troubleshooting

### Can't connect to database?
- Check MySQL is running
- Verify password in `backend/.env`

### Port already in use?
- Change PORT in `backend/.env`
- Update API_URL in `frontend/src/services/api.js`

### Module not found?
- Run `npm install` in both backend and frontend folders

## What's Next?

- Browse events at http://localhost:3000/events
- Create an event (login as Organizer)
- Book an event (login as User)
- Manage users (login as Admin)

## Full Documentation

- **README.md** - Complete documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - API endpoints reference
- **PROJECT_SUMMARY.md** - Project overview

## Need Help?

Check the documentation files or review the code comments!

---

**Happy Coding! 🚀**
