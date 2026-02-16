# Online Event Management System

A complete, interactive, and responsive event management system built with React.js, Node.js, Express.js, and MySQL.

## Features

### User Roles
- **Admin**: Full system access, manage users, categories, and view all bookings
- **Organizer**: Create and manage events, view event bookings and revenue
- **User (Attendee)**: Browse events, book tickets, manage bookings

### Core Functionality
- User authentication with JWT and bcrypt
- Role-based access control
- Event browsing with search and filters
- Event booking and ticket generation
- Dashboard analytics for Admin and Organizer
- Responsive UI for mobile and desktop

## Technology Stack

### Frontend
- React.js 18
- React Router 6
- Axios
- Bootstrap 5 & React-Bootstrap
- Context API for state management

### Backend
- Node.js
- Express.js
- MySQL 2
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## Project Structure

```
event-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User CRUD operations
│   │   ├── eventController.js    # Event CRUD operations
│   │   ├── categoryController.js # Category CRUD operations
│   │   └── bookingController.js  # Booking operations
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── roleCheck.js         # Role-based access control
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── EventCard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Events.js
│   │   │   ├── EventDetails.js
│   │   │   ├── MyBookings.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── OrganizerDashboard.js
│   │   │   ├── ManageUsers.js
│   │   │   ├── ManageCategories.js
│   │   │   └── OrganizerEvents.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE event_management;
```

2. Import the schema:
```bash
mysql -u root -p event_management < database/schema.sql
```

Or manually run the SQL file in your MySQL client.

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
copy .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Default Users (After running schema.sql)

You need to update the passwords in schema.sql with actual bcrypt hashes. Here's how to generate them:

```javascript
const bcrypt = require('bcrypt');
const password = 'password123';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

Default credentials (after you set passwords):
- **Admin**: admin@example.com / password123
- **Organizer**: organizer@example.com / password123
- **User**: user@example.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/organizer/my-events` - Get organizer's events (Protected)
- `GET /api/events/dashboard/stats` - Get dashboard stats (Protected)
- `POST /api/events` - Create event (Organizer/Admin)
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Organizer/Admin)

### Bookings
- `GET /api/bookings/my-bookings` - Get user's bookings (Protected)
- `GET /api/bookings/all` - Get all bookings (Admin)
- `GET /api/bookings/organizer/bookings` - Get organizer's bookings (Protected)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `POST /api/bookings` - Create booking (Protected)
- `PUT /api/bookings/:id/status` - Update booking status (Admin/Organizer)
- `DELETE /api/bookings/:id/cancel` - Cancel booking (Protected)

## Database Schema

### Tables
- **users**: User accounts with roles
- **categories**: Event categories
- **events**: Event information
- **bookings**: Event bookings
- **tickets**: Generated tickets for bookings

See `database/schema.sql` for complete schema with relationships.

## Features Breakdown

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control middleware
- Protected routes on frontend and backend

### User Management (Admin)
- View all users
- Edit user details and roles
- Delete users
- CRUD operations with validation

### Event Management (Organizer)
- Create events with details
- Edit and delete own events
- View event bookings
- Dashboard with statistics

### Event Booking (User)
- Browse and search events
- Filter by category and status
- Book events with automatic ticket generation
- View and cancel bookings
- Booking confirmation

### Dashboard Analytics
- Admin: Total events, users, bookings, revenue
- Organizer: My events, bookings, revenue

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

Bootstrap's grid system ensures proper layout across all devices.

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Protected API routes
- Role-based access control
- Input validation
- SQL injection prevention with parameterized queries
- CORS configuration

## Future Enhancements

- Payment gateway integration
- Email notifications
- QR code generation for tickets
- Event reviews and ratings
- Advanced analytics and reports
- File upload for event images
- Social media integration
- Calendar integration

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change PORT in backend `.env`
- Update API_URL in frontend `src/services/api.js`

### CORS Errors
- Ensure backend CORS is configured
- Check API_URL matches backend URL

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.
