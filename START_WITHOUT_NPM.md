# Start Event Management System WITHOUT NPM Install

## 🚀 Quick Start (No Frontend NPM Install Needed!)

### Step 1: Install Backend Only (Small, Should Work)

```bash
cd backend
npm install
```

If this fails too, try:
```bash
npm install --fetch-timeout=60000 --fetch-retries=5
```

### Step 2: Configure Backend

Edit `backend/.env` and set your MySQL password:
```env
DB_PASSWORD=your_mysql_password_here
```

### Step 3: Setup Database

```bash
mysql -u root -p event_management < database/schema.sql
```

### Step 4: Start Backend

```bash
cd backend
npm start
```

You should see:
```
✓ MySQL Database connected successfully
✓ Server is running on port 5000
```

### Step 5: Start Frontend (CDN Version - No NPM!)

**Option A: Double-click the file**
- Navigate to `frontend-cdn` folder
- Double-click `index.html`
- Opens in your default browser

**Option B: Use Python HTTP Server**
```bash
cd frontend-cdn
python -m http.server 3000
```
Then open: http://localhost:3000

**Option C: Use the batch file**
```bash
cd frontend-cdn
start-server.bat
```

## ✅ That's It!

Your Event Management System is now running:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000 (or just open index.html)

## 🎯 Test the System

1. **Open the frontend** (frontend-cdn/index.html)

2. **Login with default credentials**:
   - Email: `admin@example.com`
   - Password: `admin123`

3. **Browse events** on the homepage

4. **Test features**:
   - View events
   - Login/Logout
   - Book events (if logged in as user)

## 📝 About the CDN Version

This version uses:
- React from CDN (no npm install)
- Bootstrap from CDN
- Axios from CDN
- All libraries loaded from internet

**Advantages:**
- ✅ No npm install needed
- ✅ Works immediately
- ✅ No build process
- ✅ Easy to modify

**Limitations:**
- Single file (not modular like React app)
- No hot reload
- Loads libraries from internet (needs connection)

## 🔧 If Backend npm install Also Fails

Try these in order:

1. **Use Yarn**:
   ```bash
   npm install -g yarn
   cd backend
   yarn install
   ```

2. **Increase timeout**:
   ```bash
   cd backend
   npm install --fetch-timeout=120000 --fetch-retries=10
   ```

3. **Use mobile hotspot** and try again

4. **Try at different time** (npm registry might be slow)

## 🎨 Customizing the CDN Version

The CDN version is in a single file: `frontend-cdn/index.html`

You can edit it directly to:
- Change colors
- Add new pages
- Modify components
- Add features

Just edit and refresh the browser!

## 📊 What Works in CDN Version

- ✅ Homepage with events
- ✅ Event listing
- ✅ Login/Register
- ✅ Authentication
- ✅ API calls to backend
- ✅ Responsive design
- ✅ Bootstrap styling

## 🚀 Next Steps

1. Test the system
2. Create some events (login as organizer)
3. Book events (login as user)
4. Manage users (login as admin)

## 💡 Tips

- Keep backend running while using frontend
- Check browser console for any errors
- Make sure MySQL is running
- Verify backend .env is configured

## 🆘 Troubleshooting

**Frontend shows blank page:**
- Check browser console for errors
- Make sure backend is running
- Check CORS is enabled in backend

**Can't login:**
- Verify database has users
- Check backend is running
- Check credentials are correct

**Events don't show:**
- Check database has events
- Verify backend API is accessible
- Check browser network tab

## 📚 Documentation

- **NO_NPM_SOLUTION.md** - Detailed alternatives
- **README.md** - Full project documentation
- **API_DOCUMENTATION.md** - API reference

---

## Summary

**You don't need to install frontend npm packages!**

Just:
1. Install backend: `cd backend && npm install`
2. Start backend: `npm start`
3. Open: `frontend-cdn/index.html`

**That's it! 🎉**
