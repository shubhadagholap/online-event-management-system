# 🔐 Forgot Password - Recovery Guide

## Quick Recovery Options

### Option 1: Use Default Passwords (Fastest)
All accounts use standard passwords based on role:

```
Admin accounts:     admin123
Organizer accounts: organizer123
User accounts:      user123
```

**Try logging in with these first!**

---

### Option 2: Reset Password Tool (Interactive)

Run the password reset tool:
```bash
reset-password.bat
```

Or manually:
```bash
cd backend
node resetPassword.js
```

#### Features:
1. **Reset by Email** - Enter email, set new password
2. **Reset by User ID** - Enter ID, set new password
3. **Reset All to Defaults** - Reset everyone to standard passwords
4. **View All Users** - See all accounts in system

---

### Option 3: Reset Specific User (Command Line)

#### Reset by Email
```bash
cd backend
node -e "const db=require('./config/db');const bcrypt=require('bcrypt');(async()=>{const hash=await bcrypt.hash('newpassword123',10);await db.query('UPDATE users SET password=? WHERE email=?',[hash,'user@example.com']);console.log('Password reset!');process.exit();})();"
```

Replace:
- `newpassword123` with your new password
- `user@example.com` with the email address

---

### Option 4: Reset All Passwords to Defaults

```bash
cd backend
node fixLoginAndDashboard.js
```

This resets:
- `admin@example.com` → `admin123`
- `organizer@example.com` → `organizer123`
- `user@example.com` → `user123`

---

### Option 5: View All Credentials

```bash
get-all-users.bat
```

Or:
```bash
cd backend
node getAllUsers.js
```

Shows all users with their default passwords.

---

## Step-by-Step: Reset Your Password

### Method 1: Interactive Tool (Recommended)

1. **Run the tool:**
   ```bash
   reset-password.bat
   ```

2. **Choose option:**
   - Press `1` to reset by email
   - Press `2` to reset by user ID
   - Press `3` to reset all passwords
   - Press `4` to view all users

3. **Follow prompts:**
   - Enter email or ID
   - Enter new password (min 6 characters)
   - Confirm

4. **Done!** Use your new password to login

### Method 2: Reset All (Quick)

1. **Run:**
   ```bash
   cd backend
   node fixLoginAndDashboard.js
   ```

2. **Login with defaults:**
   - Admin: `admin@example.com` / `admin123`
   - Organizer: `organizer@example.com` / `organizer123`
   - User: `user@example.com` / `user123`

---

## Common Scenarios

### "I forgot my admin password"

**Solution 1:** Try default password
```
Email: admin@example.com
Password: admin123
```

**Solution 2:** Reset it
```bash
reset-password.bat
# Choose option 1
# Enter: admin@example.com
# Set new password
```

### "I forgot which email I used"

**Solution:** View all users
```bash
get-all-users.bat
```

This shows all emails in the system.

### "I want to reset everyone's password"

**Solution:** Reset all to defaults
```bash
reset-password.bat
# Choose option 3
# Type: yes
```

### "I need to set a custom password"

**Solution:** Use reset tool
```bash
reset-password.bat
# Choose option 1 (by email) or 2 (by ID)
# Enter your custom password
```

---

## Password Requirements

- **Minimum length:** 6 characters
- **Recommended:** 8+ characters with mix of letters and numbers
- **Default patterns:**
  - Admin: `admin123`
  - Organizer: `organizer123`
  - User: `user123`

---

## Security Tips

1. **Change default passwords** in production
2. **Use strong passwords** (8+ characters, mixed case, numbers)
3. **Don't share passwords** between accounts
4. **Keep credentials secure** - don't commit to git
5. **Reset passwords regularly** for security

---

## Troubleshooting

### "Password reset but still can't login"

**Causes:**
1. Browser cache - Clear cache and try again
2. Wrong email - Check spelling
3. Backend not running - Start backend server

**Fix:**
```bash
# Clear browser cache (F12 > Application > Clear storage)
# Verify backend is running
cd backend
node server.js
```

### "Reset tool shows 'User not found'"

**Causes:**
1. Wrong email address
2. User doesn't exist

**Fix:**
```bash
# View all users first
get-all-users.bat
# Then use correct email
```

### "Can't run reset tool"

**Causes:**
1. Not in correct directory
2. Node modules not installed

**Fix:**
```bash
cd backend
npm install
node resetPassword.js
```

---

## Database Direct Reset (Advanced)

If tools don't work, reset directly in database:

### Using MySQL Command Line
```sql
-- Connect to database
mysql -u root -p event_management

-- Reset admin password
UPDATE users 
SET password = '$2b$10$SKy33dHXOD3I4n0BaIpWd.euk3KzpRnoZeAb1vcEC0OrVcGk3H.ZW' 
WHERE email = 'admin@example.com';

-- This sets password to: admin123
```

### Using phpMyAdmin
1. Open phpMyAdmin
2. Select `event_management` database
3. Click `users` table
4. Find your user row
5. Edit `password` field
6. Paste this hash: `$2b$10$SKy33dHXOD3I4n0BaIpWd.euk3KzpRnoZeAb1vcEC0OrVcGk3H.ZW`
7. Save
8. Login with password: `admin123`

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Reset password (interactive) | `reset-password.bat` |
| View all users | `get-all-users.bat` |
| Reset all to defaults | `cd backend && node fixLoginAndDashboard.js` |
| View credentials | Open `ALL_USER_CREDENTIALS.md` |

---

## Default Credentials Reference

### Admins (2)
```
admin@example.com / admin123
admin@gmail.com / admin123
```

### Organizers (4)
```
organizer@example.com / organizer123
prerana343@gmail.com / organizer123
suprita@gmail.com / organizer123
bgm@gmail.com / organizer123
```

### Users (7)
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

## Need More Help?

1. **Check credentials file:** `ALL_USER_CREDENTIALS.md`
2. **Run diagnostic:** `test-certificate-endpoint.bat`
3. **Check login fix:** `LOGIN_AND_DASHBOARD_FIXED.md`
4. **View all docs:** `DOCUMENTATION_INDEX.md`

---

## Summary

**Fastest Recovery:**
1. Try default password for your role (admin123/organizer123/user123)
2. If that fails, run `reset-password.bat`
3. Choose option 1, enter your email, set new password
4. Login with new password

**Can't remember email?**
- Run `get-all-users.bat` to see all accounts

**Want to reset everything?**
- Run `reset-password.bat`, choose option 3

You're never locked out! Multiple recovery options available.
