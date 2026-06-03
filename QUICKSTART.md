# Quick Start Guide

## 🔐 Google OAuth Setup (Important!)

Before running the app, you need to set up Google OAuth for secure sign-in:

1. **Get your Google Client ID** - Follow [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions
2. **Create `.env` files** in both `backend/` and `frontend/` directories (see `.env.example` files)
3. **Add your Google Client ID** to both `.env` files

Without this setup, Google sign-in won't work, but email/password login will still function.

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

You should see: `Server running on port 5000`

## 3️⃣ Start the Frontend

In another terminal:
```bash
cd frontend
npm start
```

The app will automatically open at `http://localhost:3000`

## 4️⃣ Login

Use the demo credentials:
- **Email:** demo@example.com
- **Password:** demo

Or register a new account.

## 🎯 Features to Try

1. **Dashboard** - View your health statistics
2. **Log Workout** - Record a new exercise session
3. **Log Meal** - Track what you eat with nutrition info
4. **Log Mood** - Record your daily mood and focus time
5. **View Stats** - See detailed statistics on the dashboard
6. **Sign In with Google** - Click "Or continue with" on login to use your Google account (requires OAuth setup)
7. **Email Validation** - Only valid email addresses are accepted during registration

## 🛠️ Development Tips

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- Changes in React will hot-reload automatically
- Use browser DevTools (F12) to debug
- Check browser console for API errors

## 📱 Mobile Testing

Open `http://localhost:3000` on your phone or use Chrome DevTools responsive mode (Ctrl+Shift+M).

## 🐛 Troubleshooting

**Backend won't start?**
- Make sure port 5000 is not in use
- Check Node.js is installed: `node --version`

**Frontend shows errors?**
- Clear browser cache (Ctrl+Shift+Delete)
- Delete `node_modules` and run `npm install` again
- Ensure backend is running on port 5000

**"Invalid email" error?**
- Make sure your email format is correct (e.g., user@example.com)
- Backend validates all email addresses using RFC 5322 standards
- Use a real, well-formed email address

**Google sign-in not working?**
- Check that you've completed the [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) setup
- Verify your Google Client ID is in both `backend/.env` and `frontend/.env`
- Clear browser cache and try again
- Check browser console (F12) for specific error messages

**API connection issues?**
- Check `.env` files in both frontend and backend
- Verify `REACT_APP_API_URL=http://localhost:5000` in `frontend/.env`
- Ensure backend is running and accessible at the configured URL

## 📚 Documentation

- [Main README](./README.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
