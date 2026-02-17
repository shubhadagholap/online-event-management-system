# IMMEDIATE FIX - Run These Commands

## Step 1: Update Database Passwords

Run this command in PowerShell:

```powershell
Get-Content update-passwords.sql | mysql -u root -p event_management
```

Enter your MySQL password when prompted.

## Step 2: Restart Backend

Press Ctrl+C in the backend terminal, then:

```powershell
npm start
```

## Step 3: Open Frontend

Navigate to `frontend-cdn` folder and double-click `app.html`

## Step 4: Login

Use these credentials:
- **Admin**: admin@example.com / admin123
- **Organizer**: organizer@example.com / organizer123  
- **User**: user@example.com / user123

---

## If MySQL command doesn't work:

Open MySQL Workbench or command line:

```sql
USE event_management;

UPDATE users SET password = '$2b$10$l4k/FKb1g3XLk6lx0YWTluIQIV8ikILKVVJBfsIiN0OGPFPzfE6rq' WHERE email = 'admin@example.com';

UPDATE users SET password = '$2b$10$vxOVaA8KRSDahWcqIDbC7eDQCEii2vKjBIE0UXbZSVgylgJweeapG' WHERE email = 'organizer@example.com';

UPDATE users SET password = '$2b$10$codqCIcjUvIUisJhA/jlQewnI4Lqu.LqTJJSI7Ficvf/Q0s.VqnQC' WHERE email = 'user@example.com';
```

Then try logging in again!
