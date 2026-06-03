# Quick Start Guide

## ✨ What's New

This version includes:
- ✅ **Persistent SQLite Database** - All your data is saved and survives app restarts
- ✅ **Secure Authentication** - Bcrypt password hashing + JWT tokens
- ✅ **User Accounts** - Create accounts and login securely
- ✅ **Data Privacy** - Each user only sees their own data
- ✅ **7-Day Sessions** - Stay logged in for up to 7 days

## 🔐 Authentication Setup

The app is ready to use immediately! 

- ✅ **Email/Password Login** - Works out of the box
- ✅ **User Registration** - Create new accounts anytime
- ⚙️ **Google OAuth** (Optional) - Follow [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for Google sign-in

## 1️⃣ Initial Setup

Run the setup script:

### On Windows (PowerShell or CMD)
```bash
.\setup.bat
```

### On macOS/Linux (Terminal)
```bash
bash setup.sh
```

This will install all dependencies for both frontend and backend.

## 2️⃣ Start the Backend

In a terminal:
```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
Connected to SQLite database
Database schema initialized
```

## 3️⃣ Start the Frontend

In another terminal:
```bash
cd frontend
npm start
```

The app will automatically open at `http://localhost:3000`

## 4️⃣ Login or Register

**Option A: Use Demo Account**
- **Email:** demo@example.com
- **Password:** demo

**Option B: Create Your Account**
- Click "Sign Up"
- Enter your name, email, and password (min 6 characters)
- Your account is saved to the database immediately

## 💾 Data Persistence

- ✅ Your account and all data are saved to SQLite database
- ✅ Login on any new session and your data is restored
- ✅ Database file: `backend/data/health-wellness.db`
- ✅ Data survives server restarts

## 🎯 Features to Try

1. **Create Account** - Click "Sign Up" and register
2. **Dashboard** - View your health statistics
3. **Log Workout** - Record exercises, duration, calories
4. **Log Meal** - Track meals with nutrition facts
5. **Log Mood** - Record your daily mood and notes
6. **View Stats** - See comprehensive statistics
7. **Logout/Login** - Your data persists after logout!
8. **Sign In with Google** - Use Google account (optional, requires OAuth setup)

## 🛠️ Development Tips

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- SQLite database auto-creates on first run
- JWT token stored in browser localStorage
- Changes in React hot-reload automatically
- Use browser DevTools (F12) to debug

## 📱 Mobile Testing

Open `http://localhost:3000` on your phone or use Chrome DevTools responsive mode (Ctrl+Shift+M).

## 🐛 Troubleshooting

**Backend won't start?**
- Make sure port 5000 is not in use
- Check Node.js is installed: `node --version`
- Try: `npm install` again in the backend folder

**"Email already registered" error?**
- The email is already in the database
- Try a different email or use the demo account

**Login fails with "Invalid email or password"?**
- Check your email and password are correct
- Email validation uses RFC 5322 standards
- Password is case-sensitive

**My data disappeared?**
- Check if you're logged into the same account
- Database file is at `backend/data/health-wellness.db`
- Delete database and restart if you want to reset everything

**Frontend shows errors?**
- Clear browser cache (Ctrl+Shift+Delete)
- Delete `node_modules` and run `npm install` again
- Ensure backend is running on port 5000

**Google sign-in not working?**
- Email/password login works without Google setup
- To enable Google signin, follow [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
- Check browser console (F12) for error details

**API connection issues?**
- Check `.env` files in both frontend and backend
- Verify `REACT_APP_API_URL=http://localhost:5000` in `frontend/.env`
- Ensure backend is running and accessible at the configured URL

## 📚 Documentation

- [Main README](./README.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
