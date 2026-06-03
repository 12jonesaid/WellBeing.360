const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// Add workout
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, type, duration, calories, intensity, notes } = req.body;
    
    if (!userId || !type || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const workout = await db.addWorkout({
      userId,
      type,
      duration,
      calories: calories || 0,
      intensity: intensity || 'moderate',
      notes: notes || ''
    });
    
    res.json(workout);
  } catch (error) {
    console.error('Workout add error:', error);
    res.status(500).json({ error: 'Failed to add workout' });
  }
});

// Get user workouts
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const workouts = await db.getWorkoutsByUserId(userId);
    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Failed to get workouts' });
  }
});

// Get workouts by date range
router.get('/:userId/range', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = parseInt(req.params.userId);
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const workouts = await db.getWorkoutsByUserIdAndDate(userId, startDate, endDate);
    res.json(workouts);
  } catch (error) {
    console.error('Get workouts by range error:', error);
    res.status(500).json({ error: 'Failed to get workouts' });
  }
});

module.exports = router;
