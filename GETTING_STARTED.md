# Getting Started with Event Management System

Welcome! This guide will help you understand and run the Event Management System.

## 📚 Documentation Guide

We have multiple documentation files to help you:

1. **QUICK_START.md** ⚡ - Start here! Get running in 5 minutes
2. **SETUP_GUIDE.md** 📖 - Detailed step-by-step installation
3. **README.md** 📘 - Complete project documentation
4. **API_DOCUMENTATION.md** 🔌 - API endpoints reference
5. **PROJECT_SUMMARY.md** 📊 - Project overview and features
6. **PROJECT_FILES.md** 📁 - Complete file structure
7. **TESTING_CHECKLIST.md** ✅ - Verify everything works

## 🎯 What is This Project?

A complete, production-ready Event Management System where:
- **Users** can browse and book events
- **Organizers** can create and manage events
- **Admins** can manage users, categories, and view analytics

## 🛠️ Technology Stack

- **Frontend**: React.js + Bootstrap
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT + bcrypt

## 🚀 Quick Start (5 Minutes)

### 1. Setup Database
```bash
mysql -u root -p
CREATE DATABASE event_management;
exit;
mysql -u root -p event_management < database/schema.sql
```

### 2. Start Backend
```bash
cd backend
npm install
# Update .env with your MySQL password
npm start
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Open Browser
Visit: http://localhost:3000

## 👥 Default Users

After setup, you can login with:
- **Admin**: admin@example.com / admin123
- **Organizer**: organizer@example.com / organizer123
- **User**: user@example.com / user123

Note: Run `node backend/generateHash.js` to generate secure password hashes for production.

## 📂 Project Structure

```
event-management-system/
├── backend/          # Node.js + Express API
├── frontend/         # React.js application
├── database/         # MySQL schema
└── docs/            # Documentation files
```

## ✨ Key Features

### For Users (Attendees)
- Browse events with search and filters
- View event details
- Book events and get tickets
- Manage bookings
- Cancel bookings

### For Organizers
- Create and manage events
- View event bookings
- Track revenue
- Dashboard with statistics

### For Admins
- Manage all users
- Manage categories
- View all bookings
- System-wide analytics
- Full system control

## 🎨 Screenshots & Features

### Homepage
- Hero section with call-to-action
- Featured upcoming events
- Responsive design

### Event Listing
- Search functionality
- Category filters
- Status filters
- Event cards with images

### Event Details
- Full event information
- Booking functionality
- Seat availability
- Price display

### Dashboards
- Admin: System-wide statistics
- Organizer: Event performance metrics
- User: Booking history

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- SQL injection prevention
- CORS configuration

## 📱 Responsive Design

Works perfectly on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Large screens

## 🧪 Testing

Use the **TESTING_CHECKLIST.md** to verify:
- All features work correctly
- Security is properly implemented
- UI is responsive
- API endpoints function properly

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-reload with nodemon
```

### Frontend Development
```bash
cd frontend
npm start    # Hot reload enabled
```

### Database Management
- Use MySQL Workbench for visual management
- Or use command line: `mysql -u root -p event_management`

## 📖 Learning Path

1. **Day 1**: Setup and run the application
2. **Day 2**: Explore the UI and test features
3. **Day 3**: Review backend code structure
4. **Day 4**: Review frontend code structure
5. **Day 5**: Understand API endpoints
6. **Day 6**: Study authentication flow
7. **Day 7**: Customize and extend features

## 🎓 Code Organization

### Backend (MVC Pattern)
- **Models**: Database queries
- **Views**: JSON responses
- **Controllers**: Business logic
- **Routes**: API endpoints
- **Middleware**: Auth & validation

### Frontend (Component-Based)
- **Components**: Reusable UI elements
- **Pages**: Full page views
- **Context**: Global state
- **Services**: API calls

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Use PM2 for process management
3. Enable HTTPS
4. Use production database

### Frontend Deployment
1. Run `npm run build`
2. Deploy build folder to hosting
3. Configure environment variables
4. Set up CDN (optional)

## 🆘 Common Issues

### Database Connection Error
- Check MySQL is running
- Verify credentials in .env
- Ensure database exists

### Port Already in Use
- Change PORT in backend .env
- Update API_URL in frontend

### Module Not Found
- Run `npm install` in both folders
- Delete node_modules and reinstall

### CORS Error
- Ensure backend is running
- Check API_URL matches backend URL

## 📚 API Endpoints

Quick reference:

**Auth**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

**Events**
- GET /api/events
- POST /api/events
- PUT /api/events/:id
- DELETE /api/events/:id

**Bookings**
- GET /api/bookings/my-bookings
- POST /api/bookings
- DELETE /api/bookings/:id/cancel

See **API_DOCUMENTATION.md** for complete reference.

## 🎯 Next Steps

1. ✅ Complete the setup
2. ✅ Test all features
3. ✅ Review the code
4. ✅ Customize styling
5. ✅ Add new features
6. ✅ Deploy to production

## 💡 Tips

- Use React DevTools for debugging
- Use Postman for API testing
- Check browser console for errors
- Review logs in terminal
- Read code comments for understanding

## 🤝 Contributing

Feel free to:
- Add new features
- Improve UI/UX
- Fix bugs
- Enhance documentation
- Optimize performance

## 📞 Support

If you need help:
1. Check documentation files
2. Review code comments
3. Check TESTING_CHECKLIST.md
4. Review API_DOCUMENTATION.md

## 🎉 Success Checklist

- [ ] Database created and schema imported
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register and login
- [ ] Can browse events
- [ ] Can book an event
- [ ] Can create an event (as organizer)
- [ ] Can manage users (as admin)
- [ ] All features working
- [ ] Ready to customize!

## 🌟 Features to Explore

1. **User Registration** - Create different role accounts
2. **Event Browsing** - Search and filter events
3. **Event Booking** - Book tickets and get confirmation
4. **Event Creation** - Create events as organizer
5. **User Management** - Manage users as admin
6. **Dashboard Analytics** - View statistics
7. **Profile Management** - Update user profile
8. **Booking Management** - View and cancel bookings

## 📈 Future Enhancements

Consider adding:
- Payment gateway integration
- Email notifications
- QR code tickets
- Event reviews
- Social sharing
- Calendar integration
- Advanced analytics
- File uploads
- Real-time updates

## 🎊 Congratulations!

You now have a complete, production-ready Event Management System!

**Happy Coding! 🚀**

---

For detailed information, refer to:
- **README.md** - Full documentation
- **SETUP_GUIDE.md** - Installation guide
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_SUMMARY.md** - Project overview
