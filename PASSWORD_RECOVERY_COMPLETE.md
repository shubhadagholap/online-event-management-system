# 🔐 Password Recovery - Complete System

## ✅ You Have Multiple Recovery Options!

You're **never locked out** of the system. Here are all your options:

---

## 🚀 Option 1: Use Default Passwords (Try This First!)

All accounts follow a simple pattern:

| Role | Password |
|------|----------|
| Admin | `admin123` |
| Organizer | `organizer123` |
| User | `user123` |

**Just try logging in with these!** They work for all accounts of that role.

---

## 🔧 Option 2: Interactive Reset Tool

**Run this:**
```bash
reset-password.bat
```

**You'll see a menu:**
```
1. Reset password by email
2. Reset password by user ID
3. Reset all passwords to defaults
4. View all users
5. Exit
```

**Choose what you need:**
- Option 1: Enter your email, set new password
- Option 3: Reset everyone to defaults (fastest)
- Option 4: See all accounts in system

---

## ⚡ Option 3: Quick Command Line Reset

### Reset Specific User
```bash
cd backend
node quickPasswordReset.js YOUR_EMAIL YOUR_NEW_PASSWORD
```

**Example:**
```bash
node quickPasswordReset.js admin@example.com mynewpass123
```

### Reset All Users to Defaults
```bash
cd backend
node quickPasswordReset.js --reset-all
```

---

## 📋 Option 4: View All Credentials

**See everyone's default password:**
```bash
get-all-users.bat
```

**Or manually:**
```bash
cd backend
node getAllUsers.js
```

**Output shows:**
- All 13 users in the system
- Their emails
- Their default passwords
- Their roles and IDs

---

## 🎯 Common Scenarios

### "I forgot my password"
1. Try default: `admin123` / `organizer123` / `user123`
2. If that fails: Run `reset-password.bat`

### "I don't know my email"
1. Run `get-all-users.bat`
2. Find your email in the list
3. Login with default password

### "I want to reset everything"
1. Run `reset-password.bat`
2. Choose option 3
3. Type `yes` to confirm
4. Everyone's password is now default

### "I need a custom password"
```bash
cd backend
node quickPasswordReset.js your@email.com yournewpassword
```

---

## 📊 All 13 Users in System

### 👑 Admins (2)
```
admin@example.com / admin123
admin@gmail.com / admin123
```

### 🎯 Organizers (4)
```
organizer@example.com / organizer123
prerana343@gmail.com / organizer123
suprita@gmail.com / organizer123
bgm@gmail.com / organizer123
```

### 👥 Users (7)
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

## 🛠️ Tools Created for You

| Tool | Purpose | Command |
|------|---------|---------|
| `reset-password.bat` | Interactive password reset | Double-click or run in terminal |
| `get-all-users.bat` | View all credentials | Double-click or run in terminal |
| `quickPasswordReset.js` | Command-line reset | `node quickPasswordReset.js EMAIL PASS` |
| `getAllUsers.js` | List all users | `node getAllUsers.js` |
| `fixLoginAndDashboard.js` | Reset main accounts | `node fixLoginAndDashboard.js` |

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `FORGOT_PASSWORD_SIMPLE.md` | Quick start guide |
| `FORGOT_PASSWORD_GUIDE.md` | Complete recovery guide |
| `QUICK_PASSWORD_RESET.md` | Command reference |
| `ALL_USER_CREDENTIALS.md` | Full user list with details |
| `PASSWORD_RECOVERY_COMPLETE.md` | This file |

---

## 🔒 How Passwords Work

### Storage
- Passwords are **hashed** using bcrypt (salt rounds: 10)
- Original passwords are **never stored**
- Hashes look like: `$2b$10$SKy33dHXOD3I4n0BaIpWd...`

### Reset Process
1. Tool generates new bcrypt hash
2. Updates database with new hash
3. Old password is replaced
4. You can login with new password immediately

### Security
- All passwords require minimum 6 characters
- Bcrypt makes passwords secure
- Each password is salted uniquely
- Hashes cannot be reversed

---

## 🎓 Step-by-Step Examples

### Example 1: Reset Admin Password
```bash
# Method 1: Try default
Login: admin@example.com
Password: admin123

# Method 2: Reset if needed
cd backend
node quickPasswordReset.js admin@example.com newadminpass

# Method 3: Interactive
reset-password.bat
# Choose 1, enter admin@example.com, set password
```

### Example 2: Reset Organizer Password
```bash
# Method 1: Try default
Login: organizer@example.com
Password: organizer123

# Method 2: Quick reset
cd backend
node quickPasswordReset.js organizer@example.com neworgpass
```

### Example 3: Reset All Passwords
```bash
# Method 1: Interactive
reset-password.bat
# Choose option 3, type 'yes'

# Method 2: Command line
cd backend
node quickPasswordReset.js --reset-all
```

---

## ⚠️ Troubleshooting

### "Command not found"
**Fix:** Make sure you're in the correct directory
```bash
cd backend
node quickPasswordReset.js --reset-all
```

### "User not found"
**Fix:** Check spelling or view all users
```bash
node getAllUsers.js
```

### "Password still doesn't work"
**Fix:** Clear browser cache and try again
1. Press F12 in browser
2. Go to Application tab
3. Click "Clear storage"
4. Reload page and login

### "Backend not running"
**Fix:** Start the backend server
```bash
cd backend
node server.js
```

---

## 🎉 Summary

**You have 4 easy ways to recover access:**

1. ✅ **Try default passwords** (admin123/organizer123/user123)
2. ✅ **Run interactive tool** (`reset-password.bat`)
3. ✅ **Use command line** (`node quickPasswordReset.js EMAIL PASS`)
4. ✅ **View all users** (`get-all-users.bat`)

**Recovery time:** Less than 1 minute!

**Success rate:** 100% - You can always get back in!

---

## 🆘 Quick Help

**Forgot password?**
→ Try default password for your role

**Don't know email?**
→ Run `get-all-users.bat`

**Want to reset everything?**
→ Run `reset-password.bat`, choose option 3

**Need custom password?**
→ Run `reset-password.bat`, choose option 1

---

## 📞 Quick Reference Card

```
┌─────────────────────────────────────────┐
│     PASSWORD RECOVERY QUICK CARD        │
├─────────────────────────────────────────┤
│                                         │
│  DEFAULT PASSWORDS:                     │
│    Admin:     admin123                  │
│    Organizer: organizer123              │
│    User:      user123                   │
│                                         │
│  RESET TOOLS:                           │
│    Interactive: reset-password.bat      │
│    View Users:  get-all-users.bat       │
│                                         │
│  QUICK RESET:                           │
│    cd backend                           │
│    node quickPasswordReset.js --reset-all│
│                                         │
└─────────────────────────────────────────┘
```

---

**You're all set!** Choose any method above to recover your password. 🎉
