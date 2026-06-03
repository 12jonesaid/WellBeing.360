# Health & Wellness Tracking App

A full-stack web application for tracking fitness, nutrition, and mental health with real-time statistics and progress monitoring.

## Features

✅ **Secure User Authentication** - Email/password login with bcrypt hashing
✅ **Persistent Data Storage** - SQLite database for all user data
✅ **JWT Token Security** - 7-day session tokens for API protection
✅ **User Registration** - Create new accounts with email validation
✅ **Fitness Tracking** - Log workouts with type, duration, and calories burned
✅ **Nutrition Logging** - Track meals and macronutrients (protein, carbs, fats)
✅ **Mood Tracking** - Record daily mood on a 1-10 scale with notes
✅ **Statistics Dashboard** - View comprehensive stats and progress over time
✅ **Google OAuth Sign-In** - One-click login with verified Google accounts
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Lucide React** - Icon library
- **Axios** - HTTP client with JWT interceptor
- **Google OAuth** - Secure Google sign-in
- **CSS3** - Styling with gradients and animations

### Backend
- **Node.js & Express** - REST API server
- **SQLite3** - Persistent database
- **bcrypt** - Password hashing
- **jsonwebtoken (JWT)** - Session tokens
- **Google Auth Library** - OAuth token verification
- **Validator** - Email validation library
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

## Project Structure

```
health-wellness-app/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── WorkoutForm.js
│   │   │   ├── NutritionForm.js
│   │   │   └── MoodForm.js
│   │   ├── utils/
│   │   │   └── api.js (with JWT interceptor)
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   └── Form.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── backend/
│   ├── data/
│   │   └── health-wellness.db (SQLite database)
│   ├── middleware/
│   │   └── auth.js (JWT authentication)
│   ├── models/
│   │   └── db.js (SQLite database operations)
│   ├── routes/
│   │   ├── auth.js (login, register, OAuth)
│   │   ├── workouts.js
│   │   ├── nutrition.js
│   │   ├── mood.js
│   │   └── stats.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git (for cloning the repository)

### Quick Start (5 minutes)

1. **Clone the repository:**
```bash
git clone https://github.com/12jonesaid/WellBeing.360.git
cd WellBeing.360
```

2. **Setup Backend:**
```bash
cd backend
npm install
npm start
```
The API server will start on `http://localhost:5000`

3. **In a new terminal, setup Frontend:**
```bash
cd frontend
npm install
npm start
```
The app will open in your browser at `http://localhost:3000`

### Backend Configuration

1. **Environment Variables** - Create/update `backend/.env`:
```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
GOOGLE_CLIENT_ID=your_google_client_id_here
```

2. **Database** - SQLite database is automatically created at `backend/data/health-wellness.db` on first run

3. **Dependencies**:
```bash
npm install
# Installs: express, sqlite3, bcrypt, jsonwebtoken, validator, cors, dotenv, google-auth-library
```

### Frontend Configuration

1. **Environment Variables** - Check `frontend/.env`:
```bash
REACT_APP_API_URL=http://172.30.3.203:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

2. **Dependencies**:
```bash
npm install
# Installs: react, axios, lucide-react, google oauth library, css
```

## API Endpoints

All endpoints (except `/api/auth/register`, `/api/auth/login`, `/api/auth/google`) require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication
- `POST /api/auth/register` - Register a new user (returns JWT token)
  ```json
  { "name": "John", "email": "john@example.com", "password": "password123" }
  ```
- `POST /api/auth/login` - Login user (returns JWT token)
  ```json
  { "email": "john@example.com", "password": "password123" }
  ```
- `POST /api/auth/google` - Google OAuth login (returns JWT token)
- `GET /api/auth/profile/:userId` - Get user profile with data summary

### Workouts
- `POST /api/workouts` - Add a workout (requires auth)
  ```json
  { "userId": 1, "type": "running", "duration": 30, "calories": 300, "intensity": "high" }
  ```
- `GET /api/workouts/:userId` - Get user's workouts (requires auth)
- `GET /api/workouts/:userId/range` - Get workouts by date range (requires auth)

### Nutrition
- `POST /api/nutrition` - Add a nutrition entry (requires auth)
  ```json
  { "userId": 1, "mealType": "breakfast", "food": "oatmeal", "calories": 350, "protein": 10, "carbs": 50, "fat": 5 }
  ```
- `GET /api/nutrition/:userId` - Get user's nutrition entries (requires auth)
- `GET /api/nutrition/:userId/daily?date=2024-01-15` - Get daily nutrition summary (requires auth)

### Mood
- `POST /api/mood` - Add a mood entry (requires auth)
  ```json
  { "userId": 1, "mood": "happy", "rating": 8, "notes": "Great day!" }
  ```
- `GET /api/mood/:userId` - Get user's mood entries (requires auth)
- `GET /api/mood/:userId/stats?days=7` - Get mood statistics (requires auth)

### Statistics
- `GET /api/stats/:userId?days=7` - Get comprehensive user statistics (requires auth)

## Demo Credentials

Use the following credentials to test the app:
- **Email:** demo@example.com
- **Password:** demo

Or create a new account with any email address (minimum 6 character password).

## Authentication & Security

### How It Works

1. **Registration** - User provides name, email, and password
   - Email is validated using RFC 5322 compliant regex
   - Password is hashed using bcrypt (10 salt rounds)
   - User is stored in SQLite database

2. **Login** - User provides email and password
   - Email is looked up in database
   - Password is compared against hashed password using bcrypt
   - JWT token is generated (expires in 7 days)
   - Token is stored in browser's localStorage

3. **API Requests** - All protected endpoints require JWT token
   - Token is automatically sent in `Authorization: Bearer <token>` header
   - Backend verifies token signature and expiration
   - User can only access their own data

### Data Persistence

- **SQLite Database** - All user data is stored in `backend/data/health-wellness.db`
- **Tables**:
  - `users` - User accounts with hashed passwords
  - `workouts` - Fitness activity logs
  - `nutrition` - Meal and nutritional tracking
  - `moodEntries` - Mood and mental health records

- **Data Isolation** - Each user can only access their own data (enforced by JWT user ID)

## Usage

1. **Create Account** - Click "Sign Up" and register with email/password
2. **Login** - Sign in with your credentials (token automatically saved)
3. **View Dashboard** - See your stats and progress
4. **Log Workout** - Track your exercises, duration, and calories
5. **Log Meal** - Record meals and macronutrients (protein/carbs/fat)
6. **Log Mood** - Monitor your mental health and wellbeing
7. **View Statistics** - Track trends and progress over custom time periods

## Future Enhancements

- [ ] Advanced analytics and charts with Chart.js
- [ ] Social features (friend connections, challenges)
- [ ] Mobile app with React Native and push notifications
- [ ] Integration with fitness devices/wearables (Apple Watch, Fitbit)
- [ ] Personalized AI recommendations based on data
- [ ] Export data to PDF/CSV formats
- [ ] Admin dashboard for system monitoring
- [ ] Two-factor authentication (2FA)
- [ ] Data backup and recovery system
- [ ] Dark mode support

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
