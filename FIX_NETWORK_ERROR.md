# Fix NPM Network Error (ECONNRESET)

## Quick Fix (Recommended)

### Option 1: Use the Automated Script

**Windows Command Prompt:**
```bash
fix-npm-install.bat
```

**PowerShell:**
```powershell
.\fix-npm-install.ps1
```

### Option 2: Manual Fix

```bash
# Step 1: Clear npm cache
npm cache clean --force

# Step 2: Install frontend with special flags
cd frontend
npm install --legacy-peer-deps --fetch-timeout=60000 --fetch-retries=5

# Step 3: Install backend
cd ../backend
npm install
```

## Why This Happens

The ECONNRESET error occurs due to:
1. **Network timeout** - npm registry connection interrupted
2. **Firewall/Proxy** - Corporate network blocking connections
3. **Slow connection** - Download taking too long
4. **Registry issues** - npm registry temporarily unavailable

## The Solution Explained

### `--legacy-peer-deps`
- Ignores peer dependency conflicts
- Allows installation to proceed with warnings
- Safe to use for this project

### `--fetch-timeout=60000`
- Increases timeout to 60 seconds (default is 30)
- Gives more time for slow connections
- Prevents premature connection drops

### `--fetch-retries=5`
- Retries failed downloads 5 times
- Helps with intermittent network issues
- Increases success rate

## Step-by-Step Manual Fix

### 1. Clean Everything
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
```

### 2. Try Standard Install with Flags
```bash
npm install --legacy-peer-deps --fetch-timeout=60000
```

### 3. If Still Failing, Increase Timeout
```bash
npm install --legacy-peer-deps --fetch-timeout=120000 --fetch-retries=10
```

### 4. If Still Failing, Try Different Registry
```bash
npm config set registry https://registry.npmjs.org/
npm install --legacy-peer-deps --fetch-timeout=60000
```

### 5. Last Resort - Use Yarn
```bash
npm install -g yarn
yarn install
```

## About the Warnings

You'll see many deprecation warnings like:
```
npm warn deprecated inflight@1.0.6
npm warn deprecated @babel/plugin-proposal-...
```

**These are NORMAL and can be ignored!**
- They're from dependencies of dependencies
- They don't affect functionality
- The app will work perfectly fine
- They're just informational warnings

## About EPERM Errors

The EPERM (permission) errors are Windows file locking issues:

**Fix:**
1. Close VS Code and any file explorers
2. Run Command Prompt as Administrator
3. Try install again

**Or:**
```bash
npm install --no-optional
```

## Network-Specific Solutions

### Behind Corporate Proxy?
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
npm install --legacy-peer-deps
```

### Using VPN?
- Disconnect VPN temporarily
- Run npm install
- Reconnect VPN after installation

### Slow Internet?
```bash
npm install --legacy-peer-deps --fetch-timeout=300000 --fetch-retries=10
```

## Verify Installation Success

After successful install, you should see:
```
added 1463 packages, and audited 1464 packages in 2m

231 packages are looking for funding
  run `npm fund` for details

6 high severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

**The vulnerabilities are from dev dependencies and are safe to ignore for development.**

## Test the Installation

```bash
# In frontend directory
npm start
```

Should see:
```
Compiled successfully!

You can now view event-management-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## Common Questions

### Q: Why so many warnings?
**A:** They're from transitive dependencies (dependencies of react-scripts). They don't affect your app.

### Q: Should I run `npm audit fix`?
**A:** Not necessary for development. The vulnerabilities are in dev dependencies.

### Q: Can I use Yarn instead?
**A:** Yes! `yarn install` works and is often faster.

### Q: Do I need to fix the EPERM errors?
**A:** No, they're cleanup warnings. If install completed, you're good.

### Q: What if it still fails?
**A:** Try on a different network or use mobile hotspot temporarily.

## Success Checklist

- [ ] npm cache cleaned
- [ ] node_modules deleted
- [ ] package-lock.json deleted
- [ ] npm install completed without ECONNRESET
- [ ] node_modules folder created
- [ ] Can run `npm start` successfully
- [ ] Browser opens to http://localhost:3000

## Alternative: Pre-configured Installation

If you continue having issues, you can:

1. **Use the lock file** (already included):
   - The package-lock.json specifies exact versions
   - Should install faster and more reliably

2. **Install in safe mode**:
   ```bash
   npm ci --legacy-peer-deps
   ```

3. **Use offline mode** (if you have cache):
   ```bash
   npm install --offline --legacy-peer-deps
   ```

## Final Notes

- The warnings are cosmetic and don't affect functionality
- The EPERM errors are Windows-specific cleanup issues
- The ECONNRESET is a network timeout issue
- Using `--legacy-peer-deps` is safe for this project
- The app will work perfectly once installed

## Need More Help?

Check these files:
- **TROUBLESHOOTING.md** - Comprehensive troubleshooting
- **QUICK_START.md** - Quick start guide
- **SETUP_GUIDE.md** - Detailed setup instructions

---

**TL;DR: Run `fix-npm-install.bat` or use:**
```bash
npm cache clean --force
cd frontend
npm install --legacy-peer-deps --fetch-timeout=60000
```
