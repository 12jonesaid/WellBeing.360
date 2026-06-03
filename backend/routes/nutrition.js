const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// Add nutrition entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, mealType, food, calories, protein, carbs, fat, notes } = req.body;
    
    if (!userId || !mealType || !food || calories === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const nutrition = await db.addNutrition({
      userId,
      mealType,
      food,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      notes: notes || ''
    });
    
    res.json(nutrition);
  } catch (error) {
    console.error('Nutrition add error:', error);
    res.status(500).json({ error: 'Failed to add nutrition entry' });
  }
});

// Get user nutrition entries
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const nutrition = await db.getNutritionByUserId(userId);
    res.json(nutrition);
  } catch (error) {
    console.error('Get nutrition error:', error);
    res.status(500).json({ error: 'Failed to get nutrition entries' });
  }
});

// Get daily summary
router.get('/:userId/daily', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    const userId = parseInt(req.params.userId);
    
    // Verify user owns this data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const nutrition = await db.getNutritionByUserIdAndDate(userId, startOfDay, endOfDay);
    
    const summary = {
      date: targetDate.toISOString().split('T')[0],
      totalCalories: nutrition.reduce((sum, n) => sum + n.calories, 0),
      totalProtein: nutrition.reduce((sum, n) => sum + n.protein, 0),
      totalCarbs: nutrition.reduce((sum, n) => sum + n.carbs, 0),
      totalFat: nutrition.reduce((sum, n) => sum + n.fat, 0),
      entries: nutrition
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Get daily nutrition error:', error);
    res.status(500).json({ error: 'Failed to get daily nutrition' });
  }
});

module.exports = router;
