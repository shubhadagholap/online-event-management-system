# 🔐 Quick Password Reset

## Fastest Way to Reset Password

### Option 1: Try Default Passwords First
```
Admin:     admin123
Organizer: organizer123
User:      user123
```

### Option 2: Interactive Reset Tool
```bash
reset-password.bat
```

### Option 3: Command Line Reset
```bash
cd backend
node quickPasswordReset.js <email> <new-password>
```

**Example:**
```bash
node quickPasswordReset.js admin@example.com mynewpass123
```

### Option 4: Reset All to Defaults
```bash
cd backend
node quickPasswordReset.js --reset-all
```

## All Available Users

### Admins
- admin@example.com
- admin@gmail.com

### Organizers
- organizer@example.com
- prerana343@gmail.com
- suprita@gmail.com
- bgm@gmail.com

### Users
- user@example.com
- testuser@example.com
- shubhu67@gmail.com
- jyoti@gmail.com
- bhagya543@gmail.com
- a343@gmail.com
- test@test.com

## Quick Commands

| Task | Command |
|------|---------|
| Reset specific user | `cd backend && node quickPasswordReset.js user@example.com newpass` |
| Reset all passwords | `cd backend && node quickPasswordReset.js --reset-all` |
| Interactive tool | `reset-password.bat` |
| View all users | `get-all-users.bat` |

## Full Guide

See `FORGOT_PASSWORD_GUIDE.md` for complete instructions.
