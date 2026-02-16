# Troubleshooting Guide - NPM Install Issues

## Issue: ECONNRESET Error During npm install

You're experiencing a network connectivity error. Here are multiple solutions:

## Solution 1: Clear NPM Cache and Retry

```bash
# In frontend directory
npm cache clean --force
npm install --verbose
```

## Solution 2: Increase Network Timeout

```bash
# In frontend directory
npm install --fetch-timeout=60000 --fetch-retries=5
```

## Solution 3: Use Different Registry

```bash
# Try using a different npm registry
npm config set registry https://registry.npmjs.org/
npm install
```

## Solution 4: Install with Legacy Peer Dependencies

```bash
# In frontend directory
npm install --legacy-peer-deps
```

## Solution 5: Disable Strict SSL (Temporary)

```bash
# Only if behind corporate proxy
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

## Solution 6: Configure Proxy (If Behind Firewall)

```bash
# If you're behind a proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## Solution 7: Install in Steps

If the full install fails, try installing dependencies in smaller batches:

```bash
# Install core dependencies first
npm install react react-dom react-router-dom

# Then install UI libraries
npm install bootstrap react-bootstrap

# Then install utilities
npm install axios

# Finally install dev dependencies
npm install --save-dev react-scripts
```

## Solution 8: Delete and Reinstall

```bash
# In frontend directory
rmdir /s /q node_modules
del package-lock.json
npm install
```

## Solution 9: Use Yarn Instead

If npm continues to fail, try using Yarn:

```bash
# Install Yarn globally (if not installed)
npm install -g yarn

# In frontend directory
yarn install
```

## Solution 10: Check Network Connection

1. Check your internet connection
2. Disable VPN temporarily
3. Try from a different network
4. Check if npm registry is accessible:
   ```bash
   ping registry.npmjs.org
   ```

## Recommended Steps (In Order)

### Step 1: Quick Fix
```bash
cd frontend
npm cache clean --force
npm install --legacy-peer-deps --fetch-timeout=60000
```

### Step 2: If Step 1 Fails
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
```

### Step 3: If Step 2 Fails
```bash
cd frontend
npm config set registry https://registry.npmjs.org/
npm install --legacy-peer-deps --fetch-timeout=120000 --fetch-retries=10
```

## About the Warnings

The deprecation warnings you see are normal and don't affect functionality:
- These are from transitive dependencies (dependencies of dependencies)
- They don't break the application
- They can be safely ignored for now
- The application will work perfectly fine

## Permission Errors (EPERM)

The EPERM errors are Windows-specific file locking issues:

### Fix:
1. Close any programs that might be accessing the files (VS Code, file explorer)
2. Run Command Prompt or PowerShell as Administrator
3. Try the install again

### Alternative:
```bash
# Run as Administrator
npm install --no-optional
```

## After Successful Install

Once npm install completes successfully, you should see:
```
added XXX packages in XXs
```

Then you can start the app:
```bash
npm start
```

## Backend Installation

The backend has fewer dependencies and should install without issues:

```bash
cd backend
npm install
```

If backend also fails, use the same solutions above.

## Network-Specific Issues

### Corporate Network
If you're on a corporate network:
1. Contact IT for proxy settings
2. Configure npm proxy as shown in Solution 6
3. May need to disable SSL verification temporarily

### Home Network
1. Restart your router
2. Try using mobile hotspot
3. Check firewall settings

## Still Having Issues?

If none of these work:

1. **Use the provided package-lock.json**: The project includes a lock file that specifies exact versions
2. **Try on a different machine**: Test if it's machine-specific
3. **Use Docker**: Consider using Docker to avoid local npm issues
4. **Manual Installation**: Download packages manually (not recommended)

## Success Indicators

You'll know it worked when:
- ✅ No ECONNRESET errors
- ✅ "added XXX packages" message appears
- ✅ node_modules folder is created
- ✅ package-lock.json is created/updated
- ✅ No red ERROR messages (warnings are OK)

## Quick Command Reference

```bash
# Clear everything and start fresh
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --legacy-peer-deps --fetch-timeout=60000

# If that works, do the same for backend
cd ../backend
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

## Alternative: Use Pre-built Node Modules

If you absolutely cannot get npm install to work, you can:
1. Install on a different machine with good internet
2. Copy the node_modules folder
3. Transfer to your machine

But this is not recommended as it may cause platform-specific issues.

---

**Most Common Solution**: Clear cache and use legacy peer deps with increased timeout:
```bash
npm cache clean --force
npm install --legacy-peer-deps --fetch-timeout=60000
```
