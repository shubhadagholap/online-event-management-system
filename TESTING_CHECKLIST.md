# Testing Checklist

Use this checklist to verify all features are working correctly.

## ✅ Setup Verification

- [ ] MySQL database created
- [ ] Schema imported successfully
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend .env configured
- [ ] Backend server starts without errors
- [ ] Frontend app starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api/health

## ✅ Authentication & Authorization

### Registration
- [ ] Can register as User
- [ ] Can register as Organizer
- [ ] Email validation works
- [ ] Password validation works
- [ ] Duplicate email shows error

### Login
- [ ] Can login with valid credentials
- [ ] Invalid credentials show error
- [ ] JWT token is stored
- [ ] User data is stored in localStorage

### Logout
- [ ] Logout clears token
- [ ] Logout clears user data
- [ ] Redirects to login page

## ✅ User Role: Attendee/User

### Event Browsing
- [ ] Can view all events on homepage
- [ ] Can view events page
- [ ] Can search events by keyword
- [ ] Can filter by category
- [ ] Can filter by status
- [ ] Event cards display correctly
- [ ] Can click to view event details

### Event Details
- [ ] Event details page loads
- [ ] All event information displays
- [ ] Available seats shown
- [ ] Price displayed correctly
- [ ] "Book Now" button visible

### Booking
- [ ] Can book an event
- [ ] Ticket number generated
- [ ] Available seats decrease
- [ ] Cannot book same event twice
- [ ] Cannot book when seats full
- [ ] Booking appears in "My Bookings"

### My Bookings
- [ ] Can view all bookings
- [ ] Ticket numbers displayed
- [ ] Event details shown
- [ ] Status badges correct
- [ ] Payment status shown
- [ ] Can cancel booking
- [ ] Cancelled booking updates status
- [ ] Seats restored after cancellation

### Profile
- [ ] Can view profile
- [ ] Can update name
- [ ] Can update phone
- [ ] Changes saved successfully

## ✅ User Role: Organizer

### Dashboard
- [ ] Can access organizer dashboard
- [ ] My events count correct
- [ ] Total bookings shown
- [ ] Revenue calculated correctly

### My Events
- [ ] Can view my events list
- [ ] Can create new event
- [ ] All fields work in create form
- [ ] Category dropdown populated
- [ ] Date picker works
- [ ] Event created successfully
- [ ] Can edit own event
- [ ] Can delete own event
- [ ] Cannot edit other's events

### Event Bookings
- [ ] Can view bookings for my events
- [ ] User details shown
- [ ] Booking status displayed
- [ ] Can update booking status
- [ ] Can update payment status

## ✅ User Role: Admin

### Dashboard
- [ ] Can access admin dashboard
- [ ] Total events count correct
- [ ] Total users count correct
- [ ] Total bookings count correct
- [ ] Total revenue calculated

### User Management
- [ ] Can view all users
- [ ] Can edit user details
- [ ] Can change user role
- [ ] Can delete user
- [ ] Changes reflect immediately

### Category Management
- [ ] Can view all categories
- [ ] Can create category
- [ ] Can edit category
- [ ] Can delete category
- [ ] Categories appear in dropdowns

### All Bookings
- [ ] Can view all bookings
- [ ] All user bookings visible
- [ ] Can filter/search bookings
- [ ] Booking details complete

### Event Management
- [ ] Can edit any event
- [ ] Can delete any event
- [ ] Can change event status

## ✅ UI/UX Testing

### Responsive Design
- [ ] Works on desktop (1200px+)
- [ ] Works on tablet (768-1199px)
- [ ] Works on mobile (<768px)
- [ ] Navigation menu responsive
- [ ] Tables responsive
- [ ] Forms responsive
- [ ] Cards responsive

### Navigation
- [ ] Navbar shows correct links for role
- [ ] All links work
- [ ] Active page highlighted
- [ ] Dropdown menus work
- [ ] Logo links to home

### Forms
- [ ] All inputs work
- [ ] Validation messages show
- [ ] Required fields enforced
- [ ] Date pickers work
- [ ] Dropdowns populated
- [ ] Submit buttons work
- [ ] Cancel buttons work

### Feedback
- [ ] Success messages show
- [ ] Error messages show
- [ ] Loading states display
- [ ] Confirmation dialogs work
- [ ] Alerts dismissible

## ✅ API Testing

### Auth Endpoints
- [ ] POST /api/auth/register works
- [ ] POST /api/auth/login works
- [ ] GET /api/auth/profile works
- [ ] PUT /api/auth/profile works

### Event Endpoints
- [ ] GET /api/events works
- [ ] GET /api/events/:id works
- [ ] POST /api/events works (auth)
- [ ] PUT /api/events/:id works (auth)
- [ ] DELETE /api/events/:id works (auth)
- [ ] Query parameters work

### Booking Endpoints
- [ ] GET /api/bookings/my-bookings works
- [ ] POST /api/bookings works
- [ ] DELETE /api/bookings/:id/cancel works
- [ ] GET /api/bookings/all works (admin)

### User Endpoints (Admin)
- [ ] GET /api/users works
- [ ] POST /api/users works
- [ ] PUT /api/users/:id works
- [ ] DELETE /api/users/:id works

### Category Endpoints
- [ ] GET /api/categories works
- [ ] POST /api/categories works (admin)
- [ ] PUT /api/categories/:id works (admin)
- [ ] DELETE /api/categories/:id works (admin)

## ✅ Security Testing

### Authentication
- [ ] Cannot access protected routes without token
- [ ] Invalid token rejected
- [ ] Expired token rejected
- [ ] Token required in header

### Authorization
- [ ] User cannot access admin routes
- [ ] User cannot access organizer routes
- [ ] Organizer cannot access admin routes
- [ ] Organizer can only edit own events
- [ ] User can only cancel own bookings

### Data Validation
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] Invalid data rejected
- [ ] Required fields enforced

## ✅ Database Testing

### Data Integrity
- [ ] Foreign keys work
- [ ] Cascade deletes work
- [ ] Unique constraints enforced
- [ ] Default values set

### Transactions
- [ ] Booking transaction works
- [ ] Seats updated atomically
- [ ] Rollback on error

### Queries
- [ ] All queries execute
- [ ] No SQL errors
- [ ] Proper joins work
- [ ] Aggregations correct

## ✅ Error Handling

### Backend
- [ ] 400 errors for bad requests
- [ ] 401 errors for unauthorized
- [ ] 403 errors for forbidden
- [ ] 404 errors for not found
- [ ] 500 errors for server errors
- [ ] Error messages clear

### Frontend
- [ ] Network errors handled
- [ ] API errors displayed
- [ ] Loading states shown
- [ ] Graceful degradation

## ✅ Performance

- [ ] Pages load quickly
- [ ] API responses fast
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Images load properly

## 📊 Test Results

Date Tested: _______________
Tested By: _______________

Total Tests: 150+
Passed: _____
Failed: _____
Skipped: _____

## 🐛 Issues Found

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       |          |        |       |
|       |          |        |       |
|       |          |        |       |

## ✅ Sign Off

- [ ] All critical features working
- [ ] No blocking bugs
- [ ] Documentation complete
- [ ] Ready for deployment

---

**Testing completed successfully! 🎉**
