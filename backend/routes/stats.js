const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// Get comprehensive stats
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { days } = req.query;
    const dayRange = parseInt(days) || 7;
    
    const now = new Date();
    const pastDate = new Date(now.getTime() - dayRange * 24 * 60 * 60 * 1000);
    
    const workouts = (await db.getWorkoutsByUserId(userId)).filter(w => 
      new Date(w.date) >= pastDate
    );
    
    const nutrition = (await db.getNutritionByUserId(userId)).filter(n => 
      new Date(n.date) >= pastDate
    );
    
    const mood = (await db.getMoodByUserId(userId)).filter(m => 
      new Date(m.date) >= pastDate
    );
    
    const stats = {
      workouts: {
        total: workouts.length,
        types: [...new Set(workouts.map(w => w.type))],
        totalMinutes: workouts.reduce((sum, w) => sum + w.duration, 0),
        totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0)
      },
      nutrition: {
        entries: nutrition.length,
        totalCalories: nutrition.reduce((sum, n) => sum + n.calories, 0),
        avgCaloriesPerDay: nutrition.length > 0 ? 
          Math.round(nutrition.reduce((sum, n) => sum + n.calories, 0) / dayRange) : 0
      },
      mood: {
        entries: mood.length,
        averageRating: mood.length > 0 ? 
          (mood.reduce((sum, m) => sum + (m.rating || 5), 0) / mood.length).toFixed(1) : 0
      },
      period: `Last ${dayRange} days`
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;
