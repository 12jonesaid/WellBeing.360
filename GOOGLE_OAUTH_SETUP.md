# Google OAuth Setup Guide

This guide explains how to set up Google OAuth for email authentication in your health-wellness-app.

## Why Email Validation + Google OAuth?

1. **Real Email Verification**: Google OAuth automatically verifies that the user owns the email address
2. **No Password Management**: Users can sign in securely using their Google account
3. **Email Format Validation**: Backend uses the `validator` package to validate email format
4. **One-Click Authentication**: Seamless login experience for users

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top and select "New Project"
3. Name your project (e.g., "Health Wellness App")
4. Click "Create"

## Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" as user type
   - Fill in required fields (app name, user support email, etc.)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email for testing)
4. Back to credentials, choose "Web application"
5. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost`
   - Add your production domain when deploying
6. Add authorized redirect URIs:
   - `http://localhost:3000/`
   - Add your production domain when deploying
7. Click "Create"
8. Copy the "Client ID" (you'll need this)

## Step 4: Configure Your Application

### Backend Configuration

1. Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

2. Edit `backend/.env` and add your Google Client ID:

```
PORT=5000
GOOGLE_CLIENT_ID=your_copied_client_id_here
```

### Frontend Configuration

1. Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env
```

2. Edit `frontend/.env` and add your Google Client ID:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_copied_client_id_here
```

## Step 5: Restart Your Application

1. Restart your backend server:
```bash
cd backend
npm start
```

2. Restart your frontend:
```bash
cd frontend
npm start
```

## Testing Google OAuth

1. Go to `http://localhost:3000`
2. Click on the login page
3. You should see a "Sign in with Google" button
4. Click it and follow the Google sign-in flow
5. You'll be automatically logged in if the email is verified

## Email Validation Details

### Frontend Validation
- Checks basic email format: `user@domain.com`
- Validates no spaces, double dots, or invalid characters
- Provides immediate feedback to users

### Backend Validation
- Uses the `validator` npm package for RFC 5322 compliant email validation
- Validates all emails during registration and login
- Returns error messages for invalid email formats
- Google OAuth emails are already verified by Google, so they skip additional validation

## How Google OAuth Works in Your App

1. **User clicks "Sign in with Google"**
   - Frontend shows Google's sign-in popup
   - User enters their Google credentials

2. **Google verifies the user**
   - Returns a verified token with user's email, name, and picture

3. **Frontend sends token to backend**
   - Token is passed to `/api/auth/google` endpoint

4. **Backend verifies the token**
   - Uses `google-auth-library` to verify token authenticity
   - Validates the token is from your Google Client ID

5. **User is authenticated**
   - If email is new, a user account is created automatically
   - User is logged in and can access the app
   - No password is stored for Google OAuth users

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use environment variables** - Always load from `.env` in production
3. **Keep Client ID secure** - Never expose your Client Secret in frontend code
4. **Token verification** - Backend always verifies tokens; never trust frontend validation alone
5. **HTTPS in production** - Google OAuth requires HTTPS in production

## Troubleshooting

### "Google authentication failed" error
- Check that your Client ID in both `.env` files matches exactly
- Verify Client ID is enabled in Google Cloud Console
- Clear browser cache and refresh
- Check browser console for specific error messages

### OAuth consent screen shows "This app isn't verified"
- This is normal during development when you're the test user
- In production, you can request verification from Google
- Add your email as a test user in the OAuth consent screen settings

### "Invalid email" error during registration
- Make sure the email format is correct (user@domain.com)
- Backend validates email format strictly
- Use Gmail or other standard email providers for testing

### CORS errors
- Verify backend is running: `curl http://localhost:5000/health`
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure backend has CORS enabled (it does by default)

## Production Deployment

When deploying to production:

1. Update your authorized origins in Google Cloud Console with your domain
2. Update `.env` files with production API URLs
3. Move `.env` to secure environment variable management (AWS Secrets, etc.)
4. Never commit `.env` files to version control
5. Request OAuth app verification from Google
6. Update redirect URIs to use HTTPS

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity on the Web](https://developers.google.com/identity/gsi)
- [Email Validation](https://www.npmjs.com/package/validator)
- [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)
