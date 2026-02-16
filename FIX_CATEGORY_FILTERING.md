# Fix Category Filtering - Complete Guide

## 🐛 Problem: Category Filtering Not Working

If clicking categories or using the dropdown doesn't filter events, follow these steps:

## 🔍 Step 1: Diagnose the Issue

Run the debug script:
```cmd
debug-categories.bat
```

This will show you:
- ✅ If categories exist
- ✅ If events are assigned to categories  
- ✅ Business and Education category IDs
- ✅ Event counts per category
- ✅ Test URLs to use

## 🔧 Step 2: Common Issues & Fixes

### Issue 1: No Categories Exist

**Symptom:** Debug shows "NO CATEGORIES FOUND"

**Fix:**
```cmd
add-sample-events.bat
```

This creates categories and events.

### Issue 2: No Events in Categories

**Symptom:** Debug shows "0 events" for Business/Education

**Fix:**
```cmd
add-sample-events.bat
```

This adds events to all categories including Business and Education.

### Issue 3: Events Not Assigned to Categories

**Symptom:** Debug shows "events have no category assigned"

**Fix:** Run this SQL:
```sql
-- Check which events have no category
SELECT id, title FROM events WHERE category_id IS NULL;

-- Assign them to a category (example: assign to Business)
UPDATE events SET category_id = 4 WHERE category_id IS NULL;
```

### Issue 4: Wrong Category IDs

**Symptom:** URL shows `/events?category=4` but no events display

**Fix:** Check actual category IDs:
```sql
SELECT id, name FROM categories;
```

Use the correct ID in the URL.

## 📋 Step 3: Verify Database

### Check Categories:
```sql
SELECT * FROM categories;
```

Expected output:
```
+----+---------------+
| id | name          |
+----+---------------+
|  1 | Music         |
|  2 | Technology    |
|  3 | Sports        |
|  4 | Business      |
|  5 | Arts          |
|  6 | Food          |
|  7 | Education     |
|  8 | Entertainment |
|  9 | Conference    |
+----+---------------+
```

### Check Events with Categories:
```sql
SELECT e.id, e.title, c.name as category 
FROM events e 
LEFT JOIN categories c ON e.category_id = c.id 
LIMIT 10;
```

Should show events with their category names.

### Check Business Events:
```sql
SELECT COUNT(*) as count 
FROM events e 
JOIN categories c ON e.category_id = c.id 
WHERE c.name = 'Business';
```

Should show > 0 if business events exist.

### Check Education Events:
```sql
SELECT COUNT(*) as count 
FROM events e 
JOIN categories c ON e.category_id = c.id 
WHERE c.name = 'Education';
```

Should show > 0 if education events exist.

## 🧪 Step 4: Test the Fix

### Test 1: Check Backend API

Open in browser or use curl:
```bash
# Get all events
http://localhost:5000/api/events

# Get Business events (replace 4 with your Business category ID)
http://localhost:5000/api/events?category=4

# Get Education events (replace 7 with your Education category ID)
http://localhost:5000/api/events?category=7
```

Should return JSON with filtered events.

### Test 2: Check Frontend

1. **Open Categories Page:**
   ```
   http://localhost:3000/categories
   ```
   - Should show category cards
   - Each card should show event count
   - Cards should be clickable

2. **Click Business Card:**
   - Should redirect to `/events?category=X`
   - Should show only business events
   - Should display badge "Showing: Business Events"

3. **Click Education Card:**
   - Should redirect to `/events?category=Y`
   - Should show only education events
   - Should display badge "Showing: Education Events"

### Test 3: Check Dropdown

1. Go to: `http://localhost:3000/events`
2. Open category dropdown
3. Select "Business"
4. Events should filter
5. URL should update to `/events?category=X`

## 🔧 Step 5: Manual Fix (If Needed)

If automatic scripts don't work, manually create categories and events:

### Create Categories:
```sql
INSERT INTO categories (name, description) VALUES 
('Business', 'Business and entrepreneurship events'),
('Education', 'Educational workshops and training');
```

### Assign Events to Categories:
```sql
-- Get category IDs
SELECT id, name FROM categories;

-- Update events (replace X with actual category ID)
UPDATE events SET category_id = X WHERE title LIKE '%business%';
UPDATE events SET category_id = Y WHERE title LIKE '%education%';
```

## 🎯 Step 6: Complete Fresh Setup

If nothing works, do a complete fresh setup:

```cmd
# This does EVERYTHING
SETUP_AND_START.bat
```

This will:
1. ✅ Create test users
2. ✅ Create categories
3. ✅ Add 26+ events with proper categories
4. ✅ Add images to events
5. ✅ Start servers

Then test filtering again.

## 📊 Expected Behavior

### When Working Correctly:

**Categories Page (`/categories`):**
- Shows all category cards
- Each card shows event count
- Business shows: "6 Events"
- Education shows: "7 Events"
- Clicking card navigates to filtered events

**Events Page with Filter (`/events?category=4`):**
- URL shows category parameter
- Badge displays "Showing: Business Events"
- Count shows "Found 6 events in Business"
- Only business events display
- Dropdown shows "Business" selected
- "Clear Filters" button visible

**Dropdown Filter:**
- Selecting category filters immediately
- URL updates automatically
- Events refresh
- Badge appears

## 🐛 Debugging Checklist

If filtering still doesn't work, check:

- [ ] Backend is running (port 5000)
- [ ] Frontend is running (port 3000)
- [ ] Database has categories
- [ ] Database has events
- [ ] Events have category_id set
- [ ] Category IDs match between events and categories
- [ ] No JavaScript errors in browser console (F12)
- [ ] Network tab shows API calls succeeding
- [ ] Backend logs show queries executing

## 🔍 Browser Console Debugging

Press F12 and run:

```javascript
// Check if categories are loaded
console.log('Categories:', window.location.href);

// Check URL params
console.log('Params:', new URLSearchParams(window.location.search).get('category'));

// Check if API is being called
// Look in Network tab for /api/events?category=X
```

## 📞 Still Not Working?

### Check Backend Logs

Look at your backend terminal when you:
1. Click a category
2. Use the dropdown

You should see:
```
GET /api/events?category=4 200 45.123 ms - 1234
```

If you see 404 or 500, there's a backend issue.

### Check Frontend Console

Press F12 → Console tab

Look for errors like:
- `Network Error` → Backend not running
- `404 Not Found` → Route issue
- `Uncaught Error` → JavaScript issue

### Check Network Tab

Press F12 → Network tab → Click category

Look for:
- Request URL: `http://localhost:5000/api/events?category=4`
- Status: 200 OK
- Response: Array of events

## ✅ Success Indicators

When filtering works:

1. **URL Changes:**
   - From: `/events`
   - To: `/events?category=4`

2. **Visual Changes:**
   - Badge appears: "Showing: Business Events"
   - Count updates: "Found 6 events"
   - Only filtered events show

3. **Dropdown:**
   - Shows selected category
   - Border highlights (blue)

4. **Clear Button:**
   - Appears when filtering
   - Removes all filters when clicked

## 🎉 Final Test

After fixing, test this sequence:

1. Run: `debug-categories.bat`
2. Verify categories and events exist
3. Note the category IDs shown
4. Open: `http://localhost:3000/categories`
5. Click Business card
6. Should show only business events
7. Click Clear Filters
8. Should show all events
9. Use dropdown to select Education
10. Should show only education events

If all steps work, filtering is fixed! 🚀

## 📝 Quick Reference

**Debug Command:**
```cmd
debug-categories.bat
```

**Fix Command:**
```cmd
add-sample-events.bat
```

**Complete Setup:**
```cmd
SETUP_AND_START.bat
```

**Check Database:**
```sql
SELECT c.name, COUNT(e.id) as event_count
FROM categories c
LEFT JOIN events e ON c.id = e.category_id
GROUP BY c.id, c.name;
```

---

**Most common issue:** Events don't have category_id assigned.  
**Quick fix:** Run `add-sample-events.bat` to add properly categorized events.
