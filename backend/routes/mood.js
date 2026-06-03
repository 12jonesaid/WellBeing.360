const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// Add mood entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, mood, rating, activities, notes } = req.body;
    
    if (!userId || !mood) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const moodEntry = await db.addMood({
      userId,
      mood,
      rating: rating || 5,
      activities: activities || '',
      notes: notes || ''
    });
    
    res.json(moodEntry);
  } catch (error) {
    console.error('Mood add error:', error);
    res.status(500).json({ error: 'Failed to add mood entry' });
  }
});

// Get user mood entries
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const mood = await db.getMoodByUserId(userId);
    res.json(mood);
  } catch (error) {
    console.error('Get mood error:', error);
    res.status(500).json({ error: 'Failed to get mood entries' });
  }
});

// Get mood statistics
router.get('/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { days } = req.query;
    const userId = parseInt(req.params.userId);
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const dayRange = parseInt(days) || 7;
    
    const now = new Date();
    const pastDate = new Date(now.getTime() - dayRange * 24 * 60 * 60 * 1000);
    
    const moodData = await db.getMoodByUserId(userId);
    const filteredMood = moodData.filter(m => {
      return new Date(m.date) >= pastDate;
    });
    
    const stats = {
      period: `Last ${dayRange} days`,
      averageRating: filteredMood.length > 0 ? 
        (filteredMood.reduce((sum, m) => sum + (m.rating || 5), 0) / filteredMood.length).toFixed(1) : 0,
      entries: filteredMood.length,
      moods: filteredMood
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Failed to get mood statistics' });
  }
});

module.exports = router;
