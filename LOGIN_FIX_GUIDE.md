# Login Fix & Cross-Device Setup Guide

## ✅ What Was Fixed

### Issue 1: Hardcoded IP Address
- **Problem**: API URL was hardcoded to `http://172.30.3.203:5000` which only worked on your machine
- **Solution**: Now auto-detects the correct server address based on how you access the app

### Issue 2: CORS Configuration  
- **Problem**: CORS wasn't properly configured for different device origins
- **Solution**: Updated CORS to allow requests from any device on your network

## 🚀 Setup for Local Testing (Single Device)

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend runs on: `http://localhost:5000`

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on: `http://localhost:3000`

3. **Login**: Create an account or login with existing credentials

## 🌐 Setup for Cross-Device Access (Phone, Tablet, etc.)

### Step 1: Find Your Computer's IP Address

**On Windows (PowerShell)**:
```powershell
ipconfig
```
Look for "IPv4 Address" under your network adapter (usually starts with 192.168.x.x or 10.x.x.x)

**Example**: `192.168.1.100`

### Step 2: Update Backend Environment
Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Step 3: Start Backend
```bash
cd backend
npm start
```
Server will be accessible from any device on your network at: `http://YOUR_IP:5000`

### Step 4: Start Frontend
```bash
cd frontend
npm start
```

### Step 5: Access from Another Device
From your phone, tablet, or another computer on the same network:
```
http://YOUR_IP:3000
```

**Example**: `http://192.168.1.100:3000`

## 🔍 Troubleshooting Login Issues

### Issue: "Unable to authenticate" message

**Check 1: Backend is running**
```bash
# From any device on the network, open in browser:
http://YOUR_IP:5000/health
```
Should see: `{"status":"Server is running"}`

**Check 2: Network connectivity**
- Ensure both devices are on the SAME Wi-Fi network
- Check that your firewall isn't blocking port 5000 or 3000
- Try pinging the server IP from the other device

**Check 3: Frontend can reach backend**
- Open browser developer console (F12)
- Go to Network tab
- Try to login
- Look for API calls to `/api/auth/login`
- Check the response for errors

### Issue: "Password must be at least 6 characters" 

This is correct behavior! Passwords must be 6+ characters.

### Issue: "Email already registered"

This means an account with that email exists. Try logging in instead of registering.

## 🛡️ Security Notes

- **JWT_SECRET**: Change this in production! It's used to sign authentication tokens
- **HTTPS**: Use HTTPS in production (not HTTP)
- **CORS**: In production, replace the wildcard CORS with specific allowed origins

## 📱 Testing Checklist

- [ ] Login works on desktop/laptop
- [ ] Login works on phone with same Wi-Fi
- [ ] Login works on tablet with same Wi-Fi
- [ ] Can create new account on all devices
- [ ] Token persists across page refreshes
- [ ] Logout works on all devices

## 🔧 Still Having Issues?

1. Check backend logs for errors:
   ```bash
   # Check if database exists
   ls backend/data/
   ```

2. Check frontend console (F12) for error messages

3. Verify database is working:
   ```bash
   # Frontend can check this at:
   GET http://YOUR_IP:5000/health
   ```

4. Clear browser cache and try again:
   - Chrome: Ctrl+Shift+Delete
   - Safari: Cmd+Shift+Delete

---

**Last Updated**: June 4, 2026
