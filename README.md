# Health & Wellness Tracking App

A full-stack web application for tracking fitness, nutrition, and mental health with real-time statistics and progress monitoring.

## Features

✅ **Fitness Tracking** - Log workouts with type, duration, and calories burned
✅ **Nutrition Logging** - Track meals and macronutrients (protein, carbs, fats)
✅ **Mood Tracking** - Record daily mood on a 1-10 scale with focus time tracking
✅ **Statistics Dashboard** - View comprehensive stats and progress over time
✅ **Secure Authentication** - Email validation and user login/registration
✅ **Google OAuth Sign-In** - One-click login with verified Google accounts
✅ **Real Email Validation** - Ensures valid email addresses using validator library
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Google OAuth** - Secure Google sign-in
- **CSS3** - Styling with gradients and animations

### Backend
- **Node.js & Express** - REST API server
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
│   │   │   └── api.js
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
│   ├── models/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.js
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

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Workouts
- `POST /api/workouts` - Add a workout
- `GET /api/workouts/:userId` - Get user's workouts

### Nutrition
- `POST /api/nutrition` - Add a nutrition entry
- `GET /api/nutrition/:userId` - Get user's nutrition entries
- `GET /api/nutrition/:userId/daily` - Get daily nutrition summary

### Mood
- `POST /api/mood` - Add a mood entry
- `GET /api/mood/:userId` - Get user's mood entries
- `GET /api/mood/:userId/stats` - Get mood statistics

### Statistics
- `GET /api/stats/:userId` - Get comprehensive user statistics

## Demo Credentials

Use the following credentials to test the app:
- **Email:** demo@example.com
- **Password:** demo

## Usage

1. **Login** with demo credentials or register a new account
2. **View Dashboard** to see your stats and progress
3. **Log Workout** - Track your exercises and activities
4. **Log Meal** - Record what you eat and track macros
5. **Log Mood** - Monitor your mental health and focus time
6. **View Statistics** - Track your progress over time

## Future Enhancements

- [ ] MongoDB integration for persistent data storage
- [ ] Advanced analytics and charts
- [ ] Social features (friend connections, challenges)
- [ ] Mobile app with push notifications
- [ ] Integration with fitness devices/wearables
- [ ] Personalized recommendations based on data
- [ ] Export data to PDF/CSV

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
