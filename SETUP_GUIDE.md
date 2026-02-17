# Quick Setup Guide

Follow these steps to get the Event Management System running on your machine.

## Step 1: Prerequisites Check

Ensure you have installed:
- Node.js (v14+): `node --version`
- MySQL (v5.7+): `mysql --version`
- npm: `npm --version`

## Step 2: Database Setup

1. Start MySQL service
2. Login to MySQL:
   ```bash
   mysql -u root -p
   ```

3. Create database:
   ```sql
   CREATE DATABASE event_management;
   exit;
   ```

4. Import schema:
   ```bash
   mysql -u root -p event_management < database/schema.sql
   ```

## Step 3: Generate Password Hashes

Before using default users, generate bcrypt hashes:

1. Create a temporary file `hash.js`:
   ```javascript
   const bcrypt = require('bcrypt');
   
   async function generateHashes() {
     const password = 'password123';
     const hash = await bcrypt.hash(password, 10);
     console.log('Hash:', hash);
   }
   
   generateHashes();
   ```

2. Run it:
   ```bash
   cd backend
   npm install bcrypt
   node hash.js
   ```

3. Update the INSERT statements in `database/schema.sql` with the generated hash
4. Re-import the schema

## Step 4: Backend Setup

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   copy .env.example .env
   ```
   (On Mac/Linux use `cp` instead of `copy`)

4. Edit `.env` file with your settings:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=event_management
   JWT_SECRET=my_super_secret_jwt_key_12345
   JWT_EXPIRE=7d
   ```

5. Start backend server:
   ```bash
   npm start
   ```

   You should see:
   ```
   ✓ MySQL Database connected successfully
   ✓ Server is running on port 5000
   ```

## Step 5: Frontend Setup

1. Open a new terminal
2. Navigate to frontend:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start frontend:
   ```bash
   npm start
   ```

   Browser should open automatically at `http://localhost:3000`

## Step 6: Test the Application

1. Register a new user or login with default credentials:
   - Admin: admin@example.com / password123
   - Organizer: organizer@example.com / password123
   - User: user@example.com / password123

2. Test features:
   - Browse events
   - Book an event (as User)
   - Create an event (as Organizer)
   - Manage users (as Admin)

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: 
- Check if MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### Issue: "Port 5000 already in use"
**Solution**: 
- Change PORT in backend `.env` to 5001
- Update API_URL in `frontend/src/services/api.js` to `http://localhost:5001/api`

### Issue: "Module not found"
**Solution**: 
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Issue: Frontend can't connect to backend
**Solution**: 
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API_URL in `frontend/src/services/api.js`

### Issue: "Invalid token" errors
**Solution**: 
- Logout and login again
- Clear browser localStorage
- Check JWT_SECRET is set in `.env`

## Development Tips

1. **Backend Development**:
   - Use `npm run dev` for auto-reload with nodemon
   - Check logs in terminal for errors
   - Test API endpoints with Postman

2. **Frontend Development**:
   - React DevTools browser extension is helpful
   - Check browser console for errors
   - Use React Developer Tools

3. **Database**:
   - Use MySQL Workbench for visual database management
   - Check data with: `SELECT * FROM users;`

## Next Steps

After successful setup:
1. Explore the codebase
2. Customize styling in `frontend/src/index.css`
3. Add more features
4. Deploy to production

## Production Deployment

For production:
1. Build frontend: `npm run build` in frontend folder
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Use production database
5. Set NODE_ENV=production
6. Use process manager like PM2 for backend

## Need Help?

- Check README.md for detailed documentation
- Review API endpoints list
- Check database schema in `database/schema.sql`
- Ensure all dependencies are installed
