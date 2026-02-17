# Simple Start Guide - Event Management System

## Current Situation
- ❌ Frontend npm install failed (network error)
- ✅ Solution: Use CDN version (no npm install needed!)
- ⚠️ Backend needs npm install (but it's small and should work)

## 🚀 Quick Start (3 Steps)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**If this fails**, try:
```bash
npm install --fetch-timeout=60000 --fetch-retries=5
```

### Step 2: Configure & Start Backend

1. Edit `backend/.env` - set your MySQL password:
   ```env
   DB_PASSWORD=your_password_here
   ```

2. Setup database:
   ```bash
   mysql -u root -p event_management < ../database/schema.sql
   ```

3. Start backend:
   ```bash
   npm start
   ```
   
   (Use `npm run dev` for auto-reload during development)

### Step 3: Open Frontend (No Install Needed!)

Just double-click: `frontend-cdn/index.html`

Or use Python server:
```bash
cd frontend-cdn
python -m http.server 3000
```

Then open: http://localhost:3000

## ✅ That's It!

Your system is now running:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000 (or just the HTML file)

## 🎯 Test Login

Default credentials:
- **Admin**: admin@example.com / admin123
- **Organizer**: organizer@example.com / organizer123
- **User**: user@example.com / user123

## 📝 Available Commands

### Backend
```bash
cd backend
npm start      # Start server
npm run dev    # Start with auto-reload (needs nodemon)
```

### Frontend (CDN Version)
- Just open `frontend-cdn/index.html` in browser
- No commands needed!

## 🐛 Common Issues

### "Missing script: dev"
→ Run `npm install` in backend folder first

### "Cannot find module 'express'"
→ Run `npm install` in backend folder first

### "Error connecting to database"
→ Check MySQL is running and .env is configured

### Backend npm install also fails
→ Try: `npm install --fetch-timeout=60000 --fetch-retries=5`
→ Or use Yarn: `yarn install`
→ Or try on different network/mobile hotspot

## 📚 Documentation Files

- **BACKEND_SETUP.md** - Detailed backend setup
- **START_WITHOUT_NPM.md** - Complete no-npm guide
- **NO_NPM_SOLUTION.md** - All alternatives
- **README.md** - Full documentation

## 🎉 Success Indicators

Backend running:
```
✓ MySQL Database connected successfully
✓ Server is running on port 5000
```

Frontend working:
- Opens in browser
- Shows event listings
- Can login

## Next Steps

1. ✅ Test the system
2. ✅ Create events (login as organizer)
3. ✅ Book events (login as user)
4. ✅ Manage users (login as admin)

---

**Remember**: You don't need to install frontend npm packages! Just use the CDN version.
