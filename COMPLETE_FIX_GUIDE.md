# Complete Fix Guide - Home Images, Profile & Events

## What's Been Fixed

### ✅ 1. Home Page Event Images
- Home page now displays event images properly
- Uses EventCard component with image support
- Shows 6 upcoming events with images
- Fallback placeholder for events without images

### ✅ 2. Profile Page
- Complete profile management page created
- Update name, email, and phone
- Change password functionality
- View account information
- Accessible from user dropdown menu

### ✅ 3. Business & Education Events
- Added 5 new Business events
- Added 6 new Education events
- All events include proper images
- Categories work properly with filtering

## Quick Setup

### Run All Fixes at Once:
```cmd
# Double-click this file:
setup-complete-system.bat
```

### Or Run Individually:

**1. Add All Sample Events (including Business & Education):**
```cmd
add-sample-events.bat
```

**2. Add Images to Existing Events:**
```cmd
add-images-to-events.bat
```

**3. Add Only Business & Education Events:**
```cmd
add-business-education-events.bat
```

## Testing the Fixes

### 1. Test Home Page Images

1. **Start your servers:**
   ```cmd
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. **Visit Home Page:**
   - Go to: http://localhost:3000
   - You should see 6 upcoming events with images
   - Each event card displays an image

3. **Verify Images:**
   - Images should load properly
   - No broken image icons
   - Placeholder shows if no image URL

### 2. Test Profile Page

1. **Login:**
   - Go to: http://localhost:3000/login
   - Login with any user account

2. **Access Profile:**
   - Click your name in the top-right
   - Select "Profile"
   - Or go to: http://localhost:3000/profile

3. **Test Profile Update:**
   - Change your name
   - Update phone number
   - Click "Update Profile"
   - Should see success message

4. **Test Password Change:**
   - Enter current password
   - Enter new password (min 6 characters)
   - Confirm new password
   - Click "Change Password"
   - Should see success message

### 3. Test Business & Education Events

1. **View All Events:**
   - Go to: http://localhost:3000/events
   - Filter by "Business" category
   - Should see business events with images

2. **Filter by Education:**
   - Select "Education" from category filter
   - Should see education events with images

3. **Browse by Category:**
   - Go to: http://localhost:3000/categories
   - Click on "Business" or "Education" category
   - Should see filtered events

## New Events Added

### Business Events (5 new):
1. **Startup Funding Workshop** - $99
   - Learn funding strategies
   - Meet investors
   - Austin, TX

2. **Sales & Marketing Bootcamp** - $299
   - Modern sales techniques
   - Digital marketing
   - Chicago, IL

3. **Financial Planning Seminar** - $149
   - Investment strategies
   - Personal & business finance
   - New York, NY

4. **Women in Business Summit** - $179
   - Empowering women entrepreneurs
   - Networking opportunities
   - San Francisco, CA

5. **Real Estate Investment Conference** - $249
   - Property management
   - Market trends
   - Miami, FL

### Education Events (6 new):
1. **Python Programming for Beginners** - $199
   - Learn Python from scratch
   - Hands-on coding
   - Seattle, WA

2. **Data Science Masterclass** - $349
   - Machine learning
   - Data visualization
   - Boston, MA

3. **Creative Writing Workshop** - $79
   - Fiction & non-fiction
   - Professional authors
   - Portland, OR

4. **Language Learning Expo** - $25
   - Multiple languages
   - Free trial classes
   - Los Angeles, CA

5. **STEM Education Fair** - $15
   - Science & technology
   - For students & educators
   - Chicago, IL

6. **Teacher Professional Development** - $129
   - Modern teaching methods
   - Classroom technology
   - Denver, CO

## Profile Page Features

### Profile Information Section:
- ✅ Update full name
- ✅ Change email address
- ✅ Add/update phone number
- ✅ View account role (read-only)

### Change Password Section:
- ✅ Verify current password
- ✅ Set new password (min 6 chars)
- ✅ Confirm new password
- ✅ Secure password hashing

### Account Information:
- ✅ Account type display
- ✅ Member since date
- ✅ User ID
- ✅ Account status

## Navigation Updates

The Profile link is now available in the user dropdown menu:
- Click your name (top-right)
- Select "Profile"
- Works for all user roles (user, organizer, admin)

## API Endpoints Used

### Profile Management:
```
GET  /api/auth/profile          - Get user profile
PUT  /api/auth/profile          - Update profile info
PUT  /api/auth/profile          - Change password (with currentPassword & newPassword)
```

### Events:
```
GET  /api/events?status=upcoming  - Get upcoming events (home page)
GET  /api/events?category=X       - Filter by category
GET  /api/events                  - Get all events
```

## Troubleshooting

### Home Page Images Not Showing

**Solution 1: Run image script**
```cmd
add-images-to-events.bat
```

**Solution 2: Check database**
```sql
SELECT id, title, image_url FROM events WHERE image_url IS NULL OR image_url = '';
```

**Solution 3: Add events with images**
```cmd
add-sample-events.bat
```

### Profile Page Not Working

**Check 1: User is logged in**
- Must be authenticated
- Token must be valid
- Check localStorage for token

**Check 2: Backend route exists**
```javascript
// Should be in backend/routes/authRoutes.js
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
```

**Check 3: Check browser console**
- Press F12
- Look for errors
- Check Network tab for API calls

### Business/Education Events Not Showing

**Check 1: Categories exist**
```sql
SELECT * FROM categories WHERE name IN ('Business', 'Education');
```

**Check 2: Add categories if missing**
```sql
INSERT INTO categories (name, description) VALUES 
('Business', 'Business and entrepreneurship events'),
('Education', 'Educational workshops and training');
```

**Check 3: Run event script**
```cmd
add-business-education-events.bat
```

### Password Change Not Working

**Common Issues:**
- Current password incorrect
- New password too short (min 6 chars)
- Passwords don't match
- Not logged in

**Check backend logs:**
```
Look for "Update profile error" in terminal
```

## Database Verification

### Check Events with Images:
```sql
SELECT 
  e.id, 
  e.title, 
  c.name as category,
  CASE 
    WHEN e.image_url IS NOT NULL AND e.image_url != '' THEN 'Yes'
    ELSE 'No'
  END as has_image
FROM events e
LEFT JOIN categories c ON e.category_id = c.id
ORDER BY e.created_at DESC;
```

### Check Business Events:
```sql
SELECT e.* 
FROM events e
JOIN categories c ON e.category_id = c.id
WHERE c.name = 'Business';
```

### Check Education Events:
```sql
SELECT e.* 
FROM events e
JOIN categories c ON e.category_id = c.id
WHERE c.name = 'Education';
```

### Check User Profile:
```sql
SELECT id, name, email, phone, role, created_at 
FROM users 
WHERE email = 'your@email.com';
```

## Complete Testing Checklist

- [ ] Home page loads with event images
- [ ] Can click on event to see details
- [ ] Profile page accessible from menu
- [ ] Can update profile information
- [ ] Can change password
- [ ] Business category shows events
- [ ] Education category shows events
- [ ] Can filter events by category
- [ ] All event images display properly
- [ ] Can book events
- [ ] Profile updates persist after refresh

## File Structure

New files created:
```
frontend/src/pages/Profile.js           - Profile page component
add-business-education-events.bat       - Script to add events
COMPLETE_FIX_GUIDE.md                   - This guide
```

Modified files:
```
frontend/src/App.js                     - Added Profile route
backend/controllers/authController.js   - Enhanced profile update
backend/addSampleEvents.js              - Added more events
```

## Next Steps

1. **Run the setup script:**
   ```cmd
   setup-complete-system.bat
   ```

2. **Start your servers:**
   ```cmd
   # Backend
   cd backend && npm run dev
   
   # Frontend (new terminal)
   cd frontend && npm start
   ```

3. **Test everything:**
   - Visit home page
   - Check event images
   - Login and access profile
   - Browse business/education events

4. **Customize:**
   - Add your own events
   - Update profile information
   - Create bookings

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review TROUBLESHOOTING.md
3. Check API_DOCUMENTATION.md
4. Verify database schema in database/schema.sql
