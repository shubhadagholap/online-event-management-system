# Quick Reference Card

## 🚀 One-Command Setup
```cmd
SETUP_AND_START.bat
```
This does EVERYTHING: adds events, images, and starts servers!

## 📍 Important URLs

| Page | URL | Access |
|------|-----|--------|
| Home | http://localhost:3000 | Public |
| Events | http://localhost:3000/events | Public |
| Categories | http://localhost:3000/categories | Public |
| Login | http://localhost:3000/login | Public |
| Profile | http://localhost:3000/profile | Logged in |
| My Bookings | http://localhost:3000/my-bookings | User |
| My Tickets | http://localhost:3000/tickets | User |
| Admin Dashboard | http://localhost:3000/admin/dashboard | Admin |
| Admin Events | http://localhost:3000/admin/events | Admin |
| Organizer Events | http://localhost:3000/organizer/events | Organizer |

## 🎯 Quick Commands

### Setup & Start:
```cmd
SETUP_AND_START.bat              # Complete setup + start servers
setup-complete-system.bat        # Setup only (no server start)
```

### Add Data:
```cmd
add-sample-events.bat            # Add all sample events
add-images-to-events.bat         # Add images to existing events
add-business-education-events.bat # Add specific category events
```

### Start Servers:
```cmd
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## 👥 Default Test Accounts

Create these in your database or through registration:

### Admin:
```
Email: admin@example.com
Password: admin123
Role: admin
```

### Organizer:
```
Email: organizer@example.com
Password: organizer123
Role: organizer
```

### User:
```
Email: user@example.com
Password: user123
Role: user
```

## 🎨 Features by Role

### User (Regular):
- ✅ Browse events
- ✅ Book events
- ✅ View bookings
- ✅ View tickets
- ✅ Update profile
- ✅ Cancel bookings

### Organizer:
- ✅ All user features
- ✅ Create events
- ✅ Edit own events
- ✅ Delete own events
- ✅ View event bookings
- ✅ Update booking status

### Admin:
- ✅ All organizer features
- ✅ Manage all events
- ✅ Manage users
- ✅ Manage categories
- ✅ View all bookings
- ✅ System statistics

## 📊 Sample Data

### Events Added: 26+
- Music: 3 events
- Technology: 3 events
- Sports: 3 events
- Business: 6 events
- Education: 7 events
- Food: 3 events
- Arts: 3 events
- Entertainment: 3 events

### All Include:
- Professional images
- Detailed descriptions
- Proper pricing
- Location info

## 🔧 Common Tasks

### Add New Event (Admin/Organizer):
1. Login
2. Go to Admin → All Events (or Organizer → My Events)
3. Click "Create Event"
4. Fill form with image URL
5. Save

### Update Profile:
1. Login
2. Click your name (top-right)
3. Select "Profile"
4. Update information
5. Save

### Book Event (User):
1. Browse events
2. Click event card
3. Click "Book Now"
4. Confirm booking

### View Tickets:
1. Login as user
2. Click "My Account" → "My Tickets"
3. View/download tickets

## 🐛 Quick Fixes

### Images not showing:
```cmd
add-images-to-events.bat
```

### No events:
```cmd
add-sample-events.bat
```

### Profile not working:
- Check you're logged in
- Clear browser cache
- Check backend is running

### Can't create events:
- Check your role (must be organizer/admin)
- Verify categories exist
- Check backend logs

## 📁 Important Files

### Configuration:
- `backend/.env` - Environment variables
- `backend/config/db.js` - Database config

### Database:
- `database/schema.sql` - Database structure
- `database/sample-events.sql` - Sample data

### Scripts:
- `backend/addSampleEvents.js` - Add events
- `backend/addImagesToEvents.js` - Add images

### Frontend Pages:
- `frontend/src/pages/Home.js` - Home page
- `frontend/src/pages/Profile.js` - Profile page
- `frontend/src/pages/Events.js` - Events list
- `frontend/src/pages/AdminEvents.js` - Admin events

## 🔍 Debugging

### Check Backend:
```cmd
cd backend
npm run dev
# Look for errors in terminal
```

### Check Frontend:
```cmd
cd frontend
npm start
# Press F12 in browser → Console tab
```

### Check Database:
```sql
-- Check events
SELECT COUNT(*) FROM events;

-- Check images
SELECT COUNT(*) FROM events WHERE image_url IS NOT NULL;

-- Check categories
SELECT * FROM categories;

-- Check users
SELECT id, name, email, role FROM users;
```

## 📞 Need Help?

### Documentation:
1. `FINAL_SETUP_SUMMARY.md` - Complete overview
2. `COMPLETE_FIX_GUIDE.md` - Detailed fixes
3. `ADD_EVENTS_GUIDE.md` - Event management
4. `TROUBLESHOOTING.md` - Common issues
5. `API_DOCUMENTATION.md` - API reference

### Check:
- Browser console (F12)
- Backend terminal logs
- Database records
- Network tab (F12)

## ✅ Testing Checklist

Quick test after setup:
- [ ] Home page shows events with images
- [ ] Can login
- [ ] Can access profile
- [ ] Can browse events
- [ ] Can filter by category
- [ ] Business events show up
- [ ] Education events show up
- [ ] Can view event details
- [ ] Images load properly

## 🎉 You're Ready!

Everything is set up and working:
- ✅ Events with images
- ✅ Profile management
- ✅ Business & Education categories
- ✅ Full functionality

**Start building your event management platform!**
