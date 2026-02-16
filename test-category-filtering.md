# Test Category Filtering - Quick Guide

## 🧪 Quick Test Steps

### Test 1: Business Category Filter

1. **Open Categories Page:**
   ```
   http://localhost:3000/categories
   ```

2. **Click "Business" Card**
   - Should redirect to: `/events?category=X`
   - Should show badge: "Showing: Business Events"
   - Should display only business events

3. **Expected Events (if you ran sample data):**
   - Startup Funding Workshop
   - Sales & Marketing Bootcamp
   - Financial Planning Seminar
   - Women in Business Summit
   - Real Estate Investment Conference
   - Leadership Summit 2026

### Test 2: Education Category Filter

1. **Open Categories Page:**
   ```
   http://localhost:3000/categories
   ```

2. **Click "Education" Card**
   - Should redirect to: `/events?category=Y`
   - Should show badge: "Showing: Education Events"
   - Should display only education events

3. **Expected Events (if you ran sample data):**
   - Python Programming for Beginners
   - Data Science Masterclass
   - Creative Writing Workshop
   - Language Learning Expo
   - STEM Education Fair
   - Teacher Professional Development
   - Career Development Workshop

### Test 3: Dropdown Filter

1. **Go to Events Page:**
   ```
   http://localhost:3000/events
   ```

2. **Use Category Dropdown:**
   - Select "Business" from dropdown
   - Events should filter immediately
   - URL should update

3. **Change to Education:**
   - Select "Education" from dropdown
   - Events should change
   - URL should update

### Test 4: Clear Filters

1. **While on filtered view:**
   - Click "Clear Filters" button
   - Should show all events
   - URL should be `/events` (no params)
   - Badge should disappear

### Test 5: Direct URL

1. **Business Events:**
   ```
   http://localhost:3000/events?category=4
   ```
   (Replace 4 with your Business category ID)

2. **Education Events:**
   ```
   http://localhost:3000/events?category=7
   ```
   (Replace 7 with your Education category ID)

### Test 6: Combined Filters

1. **Business + Upcoming:**
   ```
   http://localhost:3000/events?category=4&status=upcoming
   ```

2. **Education + Search:**
   ```
   http://localhost:3000/events?category=7&search=python
   ```

## ✅ Expected Results

### When Filtering Works:

**Visual Indicators:**
- ✅ Badge shows category name
- ✅ Event count displays
- ✅ Only filtered events show
- ✅ Clear Filters button appears
- ✅ Dropdown shows selected category

**URL Changes:**
- ✅ `/events?category=4` for Business
- ✅ `/events?category=7` for Education
- ✅ Parameters update when changing filters

**Functionality:**
- ✅ Browser back button works
- ✅ Can share filtered URL
- ✅ Refresh keeps filter active
- ✅ Multiple filters can combine

## 🐛 If Something Doesn't Work

### No Events Show:

**Check 1: Do events exist?**
```sql
SELECT COUNT(*) FROM events WHERE category_id = 4;
```

**Check 2: Run sample data script**
```cmd
add-sample-events.bat
```

### Wrong Events Show:

**Check 1: Category IDs**
```sql
SELECT id, name FROM categories;
```

**Check 2: Event categories**
```sql
SELECT e.id, e.title, c.name as category 
FROM events e 
LEFT JOIN categories c ON e.category_id = c.id;
```

### Filter Doesn't Apply:

**Check 1: Backend running**
```
http://localhost:5000/api/health
```

**Check 2: Frontend running**
```
http://localhost:3000
```

**Check 3: Browser console**
- Press F12
- Look for errors

## 📊 Verify Data

### Check Categories:
```sql
SELECT * FROM categories;
```

### Check Business Events:
```sql
SELECT e.title, c.name as category 
FROM events e 
JOIN categories c ON e.category_id = c.id 
WHERE c.name = 'Business';
```

### Check Education Events:
```sql
SELECT e.title, c.name as category 
FROM events e 
JOIN categories c ON e.category_id = c.id 
WHERE c.name = 'Education';
```

## 🎯 Quick Verification

Run this in your browser console (F12):

```javascript
// Check current URL params
console.log(window.location.search);

// Should show: ?category=4 or ?category=7
```

## 📸 Screenshots to Verify

### 1. Categories Page
- Should show category cards
- Each card shows event count
- Cards are clickable

### 2. Filtered Events Page
- Badge shows "Showing: Business Events"
- Count shows "Found X events in Business"
- Only business events display
- Clear Filters button visible

### 3. Dropdown Filter
- Dropdown shows selected category
- Border highlights when active
- Changes URL when selected

## ✅ Success Checklist

- [ ] Categories page loads
- [ ] Can click Business category
- [ ] Shows only business events
- [ ] Badge displays "Business Events"
- [ ] Can click Education category
- [ ] Shows only education events
- [ ] Badge displays "Education Events"
- [ ] Dropdown filter works
- [ ] URL updates correctly
- [ ] Clear Filters works
- [ ] Event count is accurate
- [ ] Can combine filters
- [ ] Browser back/forward works

## 🚀 All Tests Pass?

If all tests pass, your category filtering is working perfectly!

You can now:
- Filter events by any category
- Combine multiple filters
- Share filtered URLs
- Navigate with browser buttons
- Clear filters easily

**Congratulations! Your filtering system is fully functional.** 🎉
