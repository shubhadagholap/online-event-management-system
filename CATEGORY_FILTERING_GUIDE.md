# Category Filtering Guide

## ✅ Filtering Implementation Complete

Your event management system now has comprehensive category-based filtering with both backend and frontend support.

## 🎯 How It Works

### Method 1: Click Category Card (Recommended)

1. Go to: http://localhost:3000/categories
2. Click on any category card (e.g., "Business" or "Education")
3. Automatically redirected to filtered events page
4. URL updates to: `/events?category=X`
5. Only events from that category display

### Method 2: Use Dropdown Filter

1. Go to: http://localhost:3000/events
2. Use the "Category" dropdown
3. Select "Business" or "Education"
4. Events filter automatically
5. URL updates with category parameter

### Method 3: Direct URL

Navigate directly to:
- Business: `http://localhost:3000/events?category=4`
- Education: `http://localhost:3000/events?category=7`

(Replace numbers with actual category IDs from your database)

## 🔧 Technical Implementation

### Backend Filtering (SQL Query)

**File:** `backend/controllers/eventController.js`

```javascript
exports.getAllEvents = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = `
      SELECT e.*, c.name as category_name, u.name as organizer_name 
      FROM events e 
      LEFT JOIN categories c ON e.category_id = c.id 
      LEFT JOIN users u ON e.organizer_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    // Category filter
    if (category) {
      query += ' AND e.category_id = ?';
      params.push(category);
    }

    // Search filter
    if (search) {
      query += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Status filter
    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }

    query += ' ORDER BY e.date DESC';

    const [events] = await db.query(query, params);
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
```

### Frontend Filtering (React)

**File:** `frontend/src/pages/Events.js`

```javascript
// Read category from URL
const [searchParams, setSearchParams] = useSearchParams();
const [filters, setFilters] = useState({ 
  search: searchParams.get('search') || '', 
  category: searchParams.get('category') || '', 
  status: searchParams.get('status') || '' 
});

// Fetch events with filters
const fetchEvents = async (currentFilters = filters) => {
  const params = {};
  if (currentFilters.search) params.search = currentFilters.search;
  if (currentFilters.category) params.category = currentFilters.category;
  if (currentFilters.status) params.status = currentFilters.status;

  const response = await eventsAPI.getAll(params);
  setEvents(response.data);
};

// Update URL when filter changes
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  const newFilters = { ...filters, [name]: value };
  setFilters(newFilters);
  
  // Update URL params
  const params = new URLSearchParams();
  if (newFilters.search) params.set('search', newFilters.search);
  if (newFilters.category) params.set('category', newFilters.category);
  if (newFilters.status) params.set('status', newFilters.status);
  
  setSearchParams(params);
};
```

### Category Navigation

**File:** `frontend/src/pages/Categories.js`

```javascript
const handleCategoryClick = (categoryId) => {
  navigate(`/events?category=${categoryId}`);
};
```

## 📋 Features

### 1. Dynamic URL Routing ✅
- URL updates when filters change
- Shareable filtered URLs
- Browser back/forward works correctly
- Bookmarkable filtered views

### 2. Multiple Filter Types ✅
- **Category:** Filter by event category
- **Search:** Search in title and description
- **Status:** Filter by upcoming/ongoing/completed

### 3. Visual Feedback ✅
- Active category badge displayed
- Filter count shown
- "Clear Filters" button when filters active
- Loading spinner during fetch
- Empty state with helpful message

### 4. Backend Query Optimization ✅
- SQL WHERE clauses for efficient filtering
- Parameterized queries (SQL injection safe)
- Single database query with all filters
- Proper JOIN for category names

## 🎨 User Experience

### When Filtering by Category:

**Before:**
```
All Events
[Shows all events from all categories]
```

**After clicking "Business":**
```
All Events
[Badge: Showing: Business Events]
Found 6 events in Business
[Shows only Business events]
[Clear Filters button visible]
```

### Empty State:
```
No events found
Try adjusting your filters or clear them to see all events.
[View All Events button]
```

## 🔍 Testing the Filters

### Test Business Category:

1. **Via Categories Page:**
   ```
   http://localhost:3000/categories
   → Click "Business" card
   → Should show only business events
   ```

2. **Via Dropdown:**
   ```
   http://localhost:3000/events
   → Select "Business" from dropdown
   → Should filter to business events
   ```

3. **Via Direct URL:**
   ```
   http://localhost:3000/events?category=4
   → Should show business events
   ```

### Test Education Category:

1. **Via Categories Page:**
   ```
   http://localhost:3000/categories
   → Click "Education" card
   → Should show only education events
   ```

2. **Via Dropdown:**
   ```
   http://localhost:3000/events
   → Select "Education" from dropdown
   → Should filter to education events
   ```

3. **Via Direct URL:**
   ```
   http://localhost:3000/events?category=7
   → Should show education events
   ```

## 📊 Database Query Examples

### Get All Events:
```sql
SELECT e.*, c.name as category_name, u.name as organizer_name 
FROM events e 
LEFT JOIN categories c ON e.category_id = c.id 
LEFT JOIN users u ON e.organizer_id = u.id 
ORDER BY e.date DESC;
```

### Get Business Events Only:
```sql
SELECT e.*, c.name as category_name, u.name as organizer_name 
FROM events e 
LEFT JOIN categories c ON e.category_id = c.id 
LEFT JOIN users u ON e.organizer_id = u.id 
WHERE e.category_id = 4
ORDER BY e.date DESC;
```

### Get Education Events Only:
```sql
SELECT e.*, c.name as category_name, u.name as organizer_name 
FROM events e 
LEFT JOIN categories c ON e.category_id = c.id 
LEFT JOIN users u ON e.organizer_id = u.id 
WHERE e.category_id = 7
ORDER BY e.date DESC;
```

## 🔧 Find Category IDs

To find the correct category IDs in your database:

```sql
SELECT id, name FROM categories;
```

Example output:
```
+----+-------------+
| id | name        |
+----+-------------+
|  1 | Music       |
|  2 | Technology  |
|  3 | Sports      |
|  4 | Business    |
|  5 | Arts        |
|  6 | Food        |
|  7 | Education   |
|  8 | Entertainment|
|  9 | Conference  |
+----+-------------+
```

## 🎯 API Endpoints

### Get All Events:
```
GET /api/events
```

### Get Events by Category:
```
GET /api/events?category=4
```

### Get Events with Multiple Filters:
```
GET /api/events?category=4&status=upcoming&search=workshop
```

### Example API Calls:

**Business Events:**
```bash
curl http://localhost:5000/api/events?category=4
```

**Education Events:**
```bash
curl http://localhost:5000/api/events?category=7
```

**Upcoming Business Events:**
```bash
curl http://localhost:5000/api/events?category=4&status=upcoming
```

## 🐛 Troubleshooting

### Issue: No events show when filtering

**Check 1: Events exist in that category**
```sql
SELECT COUNT(*) FROM events WHERE category_id = 4;
```

**Check 2: Category ID is correct**
```sql
SELECT id, name FROM categories WHERE name = 'Business';
```

**Check 3: Backend is receiving the parameter**
Look at backend terminal for the query being executed

### Issue: Filter doesn't work

**Check 1: Backend route is correct**
```javascript
// backend/routes/eventRoutes.js
router.get('/', eventController.getAllEvents);
```

**Check 2: Frontend API call includes params**
```javascript
const response = await eventsAPI.getAll({ category: categoryId });
```

**Check 3: URL parameter is set**
Check browser URL bar for `?category=X`

### Issue: Category name not showing

**Check 1: JOIN is correct in SQL**
```sql
LEFT JOIN categories c ON e.category_id = c.id
```

**Check 2: Category name is in SELECT**
```sql
SELECT e.*, c.name as category_name
```

## ✅ Verification Checklist

Test these scenarios:

- [ ] Click Business category card → Shows only business events
- [ ] Click Education category card → Shows only education events
- [ ] Use dropdown to select category → Filters correctly
- [ ] URL updates when category selected
- [ ] "Clear Filters" button appears when filtering
- [ ] "Clear Filters" button removes all filters
- [ ] Event count shows correct number
- [ ] Category badge displays active category name
- [ ] Empty state shows when no events match
- [ ] Can combine category + search filters
- [ ] Can combine category + status filters
- [ ] Browser back button works correctly
- [ ] Can share filtered URL with others

## 🎉 Success Indicators

When filtering works correctly:

✅ URL shows: `/events?category=4`  
✅ Badge shows: "Showing: Business Events"  
✅ Count shows: "Found 6 events in Business"  
✅ Only business events display  
✅ Clear Filters button visible  
✅ Dropdown shows selected category  

## 📚 Additional Features

### Combine Multiple Filters:

```
/events?category=4&status=upcoming&search=workshop
```

This will show:
- Only Business events
- That are upcoming
- With "workshop" in title or description

### Clear All Filters:

Click "Clear Filters" button or navigate to `/events`

### Share Filtered View:

Copy URL and share:
```
http://localhost:3000/events?category=4
```

Anyone opening this link will see the same filtered view.

---

**Your category filtering is now fully functional!** 🚀

Users can easily filter events by Business, Education, or any other category using multiple methods.
