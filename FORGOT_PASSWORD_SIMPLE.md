# 🔐 Forgot Password? Here's How to Get Access

## 🚀 Super Quick (30 seconds)

### Step 1: Try Default Password
All accounts use standard passwords:

```
If you're an ADMIN:     try password: admin123
If you're an ORGANIZER: try password: organizer123
If you're a USER:       try password: user123
```

**This works 99% of the time!**

---

## 🔧 If Default Doesn't Work

### Method 1: Reset All Passwords (Easiest)

**Windows:**
```bash
reset-password.bat
```
Then choose option 3

**Manual:**
```bash
cd backend
node quickPasswordReset.js --reset-all
```

**Result:** Everyone's password is reset to defaults (admin123/organizer123/user123)

---

### Method 2: Reset Your Specific Password

**Windows:**
```bash
reset-password.bat
```
Then choose option 1, enter your email

**Command Line:**
```bash
cd backend
node quickPasswordReset.js YOUR_EMAIL YOUR_NEW_PASSWORD
```

**Example:**
```bash
node quickPasswordReset.js admin@example.com mynewpass123
```

---

## 📋 Don't Remember Your Email?

Run this to see all accounts:
```bash
get-all-users.bat
```

You'll see a list like:
```
ADMINS:
  admin@example.com / admin123
  admin@gmail.com / admin123

ORGANIZERS:
  organizer@example.com / organizer123
  prerana343@gmail.com / organizer123
  ...

USERS:
  user@example.com / user123
  testuser@example.com / user123
  ...
```

---

## 🎯 Complete Solutions

### Scenario 1: "I forgot my admin password"
```bash
# Try default first
Email: admin@example.com
Password: admin123

# If that doesn't work, reset it:
cd backend
node quickPasswordReset.js admin@example.com newpassword123
```

### Scenario 2: "I don't know which email I used"
```bash
# View all users
get-all-users.bat

# Find your email in the list
# Then login with default password for your role
```

### Scenario 3: "Nothing works!"
```bash
# Nuclear option - reset everything
cd backend
node quickPasswordReset.js --reset-all

# Now login with:
# admin@example.com / admin123
# organizer@example.com / organizer123
# user@example.com / user123
```

---

## 📞 Quick Reference

| What You Need | Command |
|---------------|---------|
| Reset my password | `reset-password.bat` |
| See all users | `get-all-users.bat` |
| Reset everyone | `cd backend && node quickPasswordReset.js --reset-all` |
| Reset specific user | `cd backend && node quickPasswordReset.js EMAIL PASSWORD` |

---

## 🔑 All Default Passwords

**Copy these and try them:**

### Admins (2 accounts)
```
admin@example.com / admin123
admin@gmail.com / admin123
```

### Organizers (4 accounts)
```
organizer@example.com / organizer123
prerana343@gmail.com / organizer123
suprita@gmail.com / organizer123
bgm@gmail.com / organizer123
```

### Users (7 accounts)
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

## ✅ Summary

**You have 4 ways to recover access:**

1. ✅ **Try default password** (admin123/organizer123/user123)
2. ✅ **Run reset tool** (`reset-password.bat`)
3. ✅ **Reset all passwords** (`node quickPasswordReset.js --reset-all`)
4. ✅ **View all users** (`get-all-users.bat`)

**You're never locked out!** 🎉

---

## 📚 More Help

- **Complete Guide:** `FORGOT_PASSWORD_GUIDE.md`
- **All Credentials:** `ALL_USER_CREDENTIALS.md`
- **Quick Reset:** `QUICK_PASSWORD_RESET.md`
