const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const validator = require('validator');
const db = require('../models/db');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(CLIENT_ID);

// Validate email format
function isValidEmail(email) {
  return validator.isEmail(email);
}

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  
  // Check if email already exists
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const user = db.addUser({ name, email, password, createdAt: new Date() });
  res.json({ id: user.id, name: user.name, email: user.email });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  res.json({ id: user.id, name: user.name, email: user.email });
});

// Google OAuth login
router.post('/google', async (req, res) => {
  const { tokenId } = req.body;
  
  if (!tokenId) {
    return res.status(400).json({ error: 'Google token required' });
  }
  
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    // Find or create user
    let user = db.users.find(u => u.email === email);
    
    if (!user) {
      user = db.addUser({ 
        name: name || 'User', 
        email, 
        password: 'google_oauth',
        googleId: payload.sub,
        picture,
        createdAt: new Date() 
      });
    }
    
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// Get user profile with data summary
router.get('/profile/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = db.getUserById(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userWorkouts = db.getWorkoutsByUserId(userId);
  const userNutrition = db.getNutritionByUserId(userId);
  const userMood = db.getMoodByUserId(userId);
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    dataStatus: {
      workouts: userWorkouts.length,
      nutritionEntries: userNutrition.length,
      moodEntries: userMood.length,
      totalDataPoints: userWorkouts.length + userNutrition.length + userMood.length,
      message: userWorkouts.length + userNutrition.length + userMood.length === 0 ? 
        'New user - data starts from zero. Start tracking to see your progress!' : 
        'User has tracking data'
    }
  });
});

module.exports = router;
