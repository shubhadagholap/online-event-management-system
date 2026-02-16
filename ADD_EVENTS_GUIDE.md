# How to Add Events to Your System

You now have multiple ways to add events to your event management system!

## Method 1: Using the Admin UI (Recommended)

This is the easiest way to add events through your web interface.

### Steps:
1. **Login as Admin**
   - Go to http://localhost:3000/login
   - Login with admin credentials

2. **Navigate to Admin Events**
   - Click on "Admin" in the navigation bar
   - Select "All Events"
   - Or go directly to: http://localhost:3000/admin/events

3. **Create New Event**
   - Click the "Create Event" button
   - Fill in the form:
     - **Title**: Event name
     - **Organizer**: Select from dropdown
     - **Description**: Event details
     - **Date & Time**: When the event happens
     - **Location**: Where it takes place
     - **Category**: Select event category
     - **Capacity**: Maximum attendees
     - **Price**: Ticket price in dollars
     - **Status**: upcoming/ongoing/completed/cancelled
     - **Image URL**: Optional event image

4. **Save**
   - Click "Create Event"
   - Event will appear in the list immediately

### Features:
- ✅ View all events with statistics
- ✅ Edit existing events
- ✅ Delete events
- ✅ Assign events to different organizers
- ✅ Real-time validation
- ✅ User-friendly interface

## Method 2: Using the Automated Script (Quick Setup)

Perfect for adding multiple sample events at once.

### Steps:

**Windows:**
```cmd
# Simply double-click this file:
add-sample-events.bat
```

**Or run manually:**
```cmd
cd backend
node addSampleEvents.js
```

### What it does:
- Adds 10 pre-configured sample events
- Automatically assigns to first organizer
- Matches categories by name
- Skips events that already exist
- Shows progress and results

### Sample Events Included:
1. Summer Music Festival 2026
2. Tech Summit 2026
3. City Marathon 2026
4. Food & Wine Festival
5. Modern Art Exhibition
6. Leadership Summit 2026
7. Comedy Night Special
8. Career Development Workshop
9. Jazz Night Live
10. Digital Marketing Conference

## Method 3: Using SQL Script (Database Direct)

For advanced users who want to customize events in SQL.

### Steps:

1. **Open MySQL Command Line or Workbench**

2. **Run the SQL file:**
   ```sql
   USE event_management;
   SOURCE database/sample-events.sql;
   ```

   Or in Windows Command Prompt:
   ```cmd
   mysql -u root -p event_management < database/sample-events.sql
   ```

3. **Important**: Update the SQL file first:
   - Replace `organizer_id` with actual organizer IDs
   - Replace `category_id` with actual category IDs
   - Check your database for correct IDs:
     ```sql
     SELECT id, name FROM categories;
     SELECT id, name, role FROM users WHERE role = 'organizer';
     ```

### Advantages:
- Full control over event data
- Can add many events at once
- Can customize all fields
- Good for bulk imports

## Method 4: Using the Organizer Dashboard

Organizers can create their own events.

### Steps:
1. **Login as Organizer**
   - Use organizer credentials

2. **Go to Organizer Events**
   - Click "Organizer" → "My Events"
   - Or go to: http://localhost:3000/organizer/events

3. **Create Event**
   - Click "Create Event"
   - Fill in the form
   - Save

### Note:
- Organizers can only manage their own events
- Admins can manage all events

## Method 5: Using the API Directly

For developers integrating with other systems.

### Endpoint:
```
POST http://localhost:5000/api/events
```

### Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request Body:
```json
{
  "title": "My Awesome Event",
  "description": "Event description here",
  "date": "2026-12-31 18:00:00",
  "location": "Event Venue, City",
  "capacity": 500,
  "price": 49.99,
  "category_id": 1,
  "status": "upcoming",
  "image_url": "https://example.com/image.jpg"
}
```

### Example using curl:
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Event",
    "description": "Description",
    "date": "2026-12-31 18:00:00",
    "location": "City Hall",
    "capacity": 100,
    "price": 25.00,
    "category_id": 1,
    "status": "upcoming"
  }'
```

## Event Fields Explained

### Required Fields:
- **title**: Event name (string)
- **date**: Event date and time (datetime format: YYYY-MM-DD HH:MM:SS)
- **location**: Event venue/location (string)
- **capacity**: Maximum number of attendees (integer)
- **price**: Ticket price (decimal, e.g., 49.99)

### Optional Fields:
- **description**: Detailed event description (text)
- **category_id**: Category ID from categories table (integer)
- **status**: Event status (enum: 'upcoming', 'ongoing', 'completed', 'cancelled')
- **image_url**: URL to event image (string)

### Auto-Generated Fields:
- **id**: Unique event identifier
- **organizer_id**: Set automatically based on logged-in user
- **available_seats**: Calculated as capacity minus bookings
- **created_at**: Timestamp when event was created

## Image URLs for Events

You can use free image services:

### Unsplash (Free):
```
https://images.unsplash.com/photo-[ID]?w=800
```

### Placeholder Images:
```
https://via.placeholder.com/800x400?text=Event+Name
```

### Example Categories:
- Music: https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800
- Tech: https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800
- Sports: https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800
- Food: https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800
- Arts: https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800

## Tips for Adding Events

1. **Use Descriptive Titles**
   - Good: "Summer Music Festival 2026"
   - Bad: "Event 1"

2. **Write Engaging Descriptions**
   - Include what attendees will experience
   - Mention special features or guests
   - Keep it concise but informative

3. **Set Realistic Capacity**
   - Consider venue size
   - Account for safety regulations
   - Leave room for staff/crew

4. **Price Appropriately**
   - Research similar events
   - Consider your target audience
   - Factor in costs

5. **Choose the Right Category**
   - Helps users find your event
   - Improves search and filtering
   - Makes browsing easier

6. **Use High-Quality Images**
   - Use relevant, professional photos
   - Recommended size: 800x400px or larger
   - Ensure images load quickly

## Troubleshooting

### "No organizer found" Error
**Solution**: Create an organizer user first
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Event Organizer', 'organizer@example.com', 'hashed_password', 'organizer');
```

### "Category not found" Error
**Solution**: Create categories first
```sql
INSERT INTO categories (name, description) 
VALUES ('Music', 'Music and concerts');
```

### Events Not Showing Up
**Checklist**:
- ✅ Check event status is 'upcoming'
- ✅ Verify date is in the future
- ✅ Ensure capacity > 0
- ✅ Check organizer_id exists
- ✅ Refresh the page

### Can't Create Events in UI
**Checklist**:
- ✅ Logged in as admin or organizer
- ✅ All required fields filled
- ✅ Date format is correct
- ✅ Backend server is running
- ✅ Check browser console for errors

## Quick Start Checklist

Before adding events, make sure you have:

- [ ] Database created and schema loaded
- [ ] At least one organizer user created
- [ ] Categories created
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Admin/organizer account to login

## Next Steps

After adding events:
1. View them on the Events page
2. Test booking functionality
3. Check event details page
4. Try filtering by category
5. Test search functionality

## Need Help?

- Check the API_DOCUMENTATION.md for API details
- See FRONTEND_MODULES_GUIDE.md for UI features
- Review TROUBLESHOOTING.md for common issues
