# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Profile
```http
GET /api/auth/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "phone": "1234567890",
  "created_at": "2026-02-14T10:00:00.000Z"
}
```

### Update Profile
```http
PUT /api/auth/profile
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210"
}
```

---

## Users Endpoints (Admin Only)

### Get All Users
```http
GET /api/users
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

### Get User by ID
```http
GET /api/users/:id
```

### Create User
```http
POST /api/users
```
**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "organizer",
  "phone": "1234567890"
}
```

### Update User
```http
PUT /api/users/:id
```
**Body:**
```json
{
  "name": "Jane Updated",
  "email": "jane@example.com",
  "role": "organizer",
  "phone": "9876543210"
}
```

### Delete User
```http
DELETE /api/users/:id
```

---

## Categories Endpoints

### Get All Categories
```http
GET /api/categories
```
**Public endpoint**

### Get Category by ID
```http
GET /api/categories/:id
```

### Create Category (Admin)
```http
POST /api/categories
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

**Body:**
```json
{
  "name": "Technology",
  "description": "Tech events and conferences"
}
```

### Update Category (Admin)
```http
PUT /api/categories/:id
```

### Delete Category (Admin)
```http
DELETE /api/categories/:id
```

---

## Events Endpoints

### Get All Events
```http
GET /api/events?search=tech&category=1&status=upcoming
```
**Query Parameters:**
- `search` (optional): Search in title and description
- `category` (optional): Filter by category ID
- `status` (optional): Filter by status (upcoming, ongoing, completed, cancelled)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Tech Summit 2026",
    "description": "Annual technology conference",
    "date": "2026-03-15T09:00:00.000Z",
    "location": "Convention Center, NYC",
    "capacity": 500,
    "available_seats": 450,
    "price": "99.99",
    "image_url": "https://example.com/image.jpg",
    "organizer_id": 2,
    "category_id": 1,
    "status": "upcoming",
    "category_name": "Technology",
    "organizer_name": "John Organizer"
  }
]
```

### Get Event by ID
```http
GET /api/events/:id
```

### Get My Events (Organizer)
```http
GET /api/events/organizer/my-events
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Organizer or Admin

### Get Dashboard Stats
```http
GET /api/events/dashboard/stats
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin or Organizer

**Response (Admin):**
```json
{
  "totalEvents": 10,
  "totalUsers": 50,
  "totalBookings": 100,
  "totalRevenue": 5000.00
}
```

**Response (Organizer):**
```json
{
  "myEvents": 5,
  "myBookings": 50,
  "myRevenue": 2500.00
}
```

### Create Event
```http
POST /api/events
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Organizer or Admin

**Body:**
```json
{
  "title": "Tech Summit 2026",
  "description": "Annual technology conference",
  "date": "2026-03-15T09:00:00",
  "location": "Convention Center, NYC",
  "capacity": 500,
  "price": 99.99,
  "category_id": 1,
  "image_url": "https://example.com/image.jpg"
}
```

### Update Event
```http
PUT /api/events/:id
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Organizer (own events) or Admin

**Body:**
```json
{
  "title": "Tech Summit 2026 Updated",
  "description": "Updated description",
  "date": "2026-03-15T09:00:00",
  "location": "New Location",
  "capacity": 600,
  "price": 89.99,
  "category_id": 1,
  "status": "upcoming",
  "image_url": "https://example.com/new-image.jpg"
}
```

### Delete Event
```http
DELETE /api/events/:id
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Organizer (own events) or Admin

---

## Bookings Endpoints

### Get My Bookings
```http
GET /api/bookings/my-bookings
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 3,
    "event_id": 1,
    "status": "confirmed",
    "payment_status": "pending",
    "total_amount": "99.99",
    "booking_date": "2026-02-14T10:00:00.000Z",
    "event_title": "Tech Summit 2026",
    "event_date": "2026-03-15T09:00:00.000Z",
    "event_location": "Convention Center, NYC",
    "category_name": "Technology",
    "ticket_number": "TKT-1708000000000-1"
  }
]
```

### Get All Bookings (Admin)
```http
GET /api/bookings/all
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

### Get Organizer Bookings
```http
GET /api/bookings/organizer/bookings
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Organizer or Admin

### Get Booking by ID
```http
GET /api/bookings/:id
```
**Headers:** `Authorization: Bearer <token>`

### Create Booking
```http
POST /api/bookings
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "event_id": 1
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "bookingId": 1,
  "ticketNumber": "TKT-1708000000000-1"
}
```

### Update Booking Status
```http
PUT /api/bookings/:id/status
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin or Organizer

**Body:**
```json
{
  "status": "confirmed",
  "payment_status": "paid"
}
```

### Cancel Booking
```http
DELETE /api/bookings/:id/cancel
```
**Headers:** `Authorization: Bearer <token>`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"user"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Events
```bash
curl http://localhost:5000/api/events
```

### Create Booking (with token)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"event_id":1}'
```
