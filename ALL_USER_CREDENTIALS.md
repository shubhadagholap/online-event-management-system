# 🔐 All User Credentials

## Total Users: 13

---

## 👑 ADMIN ACCOUNTS (2)

### Admin 1
- **Name:** Admin User
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** Administrator
- **ID:** 1
- **Phone:** 1234567890
- **Access:** Full system access, manage all users, events, bookings

### Admin 2
- **Name:** Admin User
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **Role:** Administrator
- **ID:** 8
- **Phone:** 1234567890
- **Access:** Full system access, manage all users, events, bookings

---

## 🎯 ORGANIZER ACCOUNTS (4)

### Organizer 1
- **Name:** John Organizer
- **Email:** `organizer@example.com`
- **Password:** `organizer123`
- **Role:** Event Organizer
- **ID:** 2
- **Phone:** 0987654321
- **Access:** Create/manage events, view bookings, generate certificates

### Organizer 2
- **Name:** prerana
- **Email:** `prerana343@gmail.com`
- **Password:** `organizer123`
- **Role:** Event Organizer
- **ID:** 4
- **Phone:** 1237898788
- **Access:** Create/manage events, view bookings, generate certificates

### Organizer 3
- **Name:** suprita
- **Email:** `suprita@gmail.com`
- **Password:** `organizer123`
- **Role:** Event Organizer
- **ID:** 10
- **Phone:** 1234567890
- **Access:** Create/manage events, view bookings, generate certificates

### Organizer 4
- **Name:** BGM
- **Email:** `bgm@gmail.com`
- **Password:** `organizer123`
- **Role:** Event Organizer
- **ID:** 11
- **Phone:** 98765432145
- **Access:** Create/manage events, view bookings, generate certificates

---

## 👥 USER ACCOUNTS (7)

### User 1
- **Name:** Jane Attendee
- **Email:** `user@example.com`
- **Password:** `user123`
- **Role:** Regular User
- **ID:** 3
- **Phone:** 5555555555
- **Access:** Browse events, make bookings, view certificates

### User 2
- **Name:** Test User
- **Email:** `testuser@example.com`
- **Password:** `user123`
- **Role:** Regular User
- **ID:** 5
- **Phone:** 1234567890
- **Access:** Browse events, make bookings, view certificates

### User 3
- **Name:** sakshi
- **Email:** `shubhu67@gmail.com`
- **Password:** `user123`
- **Role:** Regular User
- **ID:** 6
- **Phone:** 7795717155
- **Access:** Browse events, make bookings, view certificates

### User 4
- **Name:** Jyoti
- **Email:** `jyoti@gmail.com`
- **Password:** `user123`
- **Role:** Regular User
- **ID:** 9
- **Phone:** 8095777155
- **Access:** Browse events, make bookings, view certificates

### User 5
- **Name:** bhagya
- **Email:** `bhagya543@gmail.com`
- **Password:** `user123`
- **Role:** Regular User
- **ID:** 12
- **Phone:** 888888888
- **Access:** Browse events, make bookings, view certificates

### User 6
- **Name:** ZAIBA R SHAIKH
- **Email:** `a343@gmail.com`
- **Password:** `user123`
- **Role:** Regular User
- **ID:** 13
- **Phone:** 1234567890
- **Access:** Browse events, make bookings, view certificates

### User 7
- **Name:** Test User
- **Email:** `test@test.com`
- **Password:** `user123`
- **Role:** Regular User
- **ID:** 14
- **Phone:** 1234567890
- **Access:** Browse events, make bookings, view certificates

---

## 📋 Quick Reference

### Copy-Paste Ready Credentials

#### Admins
```
admin@example.com / admin123
admin@gmail.com / admin123
```

#### Organizers
```
organizer@example.com / organizer123
prerana343@gmail.com / organizer123
suprita@gmail.com / organizer123
bgm@gmail.com / organizer123
```

#### Users
```
user@example.com / user123
testuser@example.com / user123
shubhu67@gmail.com / user123
jyoti@gmail.com / user123
bhagya543@gmail.com / user123
a343@gmail.com / user123
test@test.com / user123
```

---

## 🔑 Password Pattern

All passwords follow a simple pattern based on role:

| Role | Password |
|------|----------|
| Admin | `admin123` |
| Organizer | `organizer123` |
| User | `user123` |

---

## 🎭 Role Permissions

### Administrator
- ✅ Full system access
- ✅ Manage all users
- ✅ Manage all events
- ✅ View all bookings
- ✅ Generate all certificates
- ✅ View system analytics
- ✅ Export data to CSV
- ✅ Manage categories
- ✅ Send notifications

### Event Organizer
- ✅ Create events
- ✅ Edit own events
- ✅ View bookings for own events
- ✅ Generate certificates for own events
- ✅ View event analytics
- ✅ Manage event attendees
- ✅ Send event notifications
- ❌ Cannot manage other organizers' events
- ❌ Cannot access admin features

### Regular User
- ✅ Browse all events
- ✅ Book events
- ✅ View own bookings
- ✅ Cancel own bookings
- ✅ Download own certificates
- ✅ View own profile
- ✅ Update own profile
- ❌ Cannot create events
- ❌ Cannot access organizer features
- ❌ Cannot access admin features

---

## 🚀 Login URL

**Frontend:** `http://localhost:3000/login`

**Backend API:** `http://localhost:5000/api/auth/login`

---

## 🔧 How to Get This List Anytime

Run this command:
```bash
cd backend
node getAllUsers.js
```

---

## 🔐 Security Notes

1. **These are test credentials** - Change them in production
2. **All passwords are hashed** in the database using bcrypt
3. **JWT tokens** are used for authentication
4. **Role-based access control** is enforced on all endpoints
5. **Passwords should be changed** after initial setup

---

## 📝 Notes

- All accounts are active and ready to use
- Passwords were standardized for easy testing
- Some users have confirmed bookings for certificate testing
- Organizers have events assigned to them
- Admin accounts have full access to all features

---

## 🆘 Need to Reset Passwords?

Run this script to reset all passwords to defaults:
```bash
cd backend
node fixLoginAndDashboard.js
```

This will reset:
- `admin@example.com` → `admin123`
- `organizer@example.com` → `organizer123`
- `user@example.com` → `user123`

---

**Last Updated:** After login fix and certificate system setup
**Total Accounts:** 13 (2 admins, 4 organizers, 7 users)
