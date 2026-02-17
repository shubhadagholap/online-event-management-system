# Frontend - Event Management System

## Quick Install

### If npm install fails with network error:

```bash
npm cache clean --force
npm install --legacy-peer-deps --fetch-timeout=60000
```

### Or use the automated fix script from root directory:
```bash
cd ..
fix-npm-install.bat
```

## Start Development Server

```bash
npm start
```

Opens at: http://localhost:3000

## Build for Production

```bash
npm run build
```

## About Warnings

The deprecation warnings during install are normal and can be ignored. They come from react-scripts dependencies and don't affect functionality.

## Troubleshooting

See `../FIX_NETWORK_ERROR.md` for detailed solutions.
