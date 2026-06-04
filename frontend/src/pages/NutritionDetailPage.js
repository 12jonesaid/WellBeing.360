import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';
import '../styles/DetailPages.css';

export default function NutritionDetailPage({ user }) {
  const [nutritionEntries, setNutritionEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNutritionData();
  }, [user.id]);

  const fetchNutritionData = async () => {
    try {
      setLoading(true);
      const response = await api.getUserNutrition(user.id);
      setNutritionEntries(response.data || []);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      setNutritionEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = nutritionEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  const totalProtein = nutritionEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = nutritionEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = nutritionEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);

  const mealTypeEmojis = {
    breakfast: '🌅',
    lunch: '🍽️',
    dinner: '🌙',
    snack: '🍿'
  };

  return (
    <div className="detail-page-root">
      <section className="detail-header">
        <div className="header-content">
          <h1>Nutrition Balance</h1>
          <p className="header-subtitle">Track your meals, calories, and macronutrients</p>
        </div>
      </section>

      <div className="detail-grid">
        <div className="stats-panel">
          <div className="stat-card nutrition-card">
            <div className="stat-label">Total Calories</div>
            <div className="stat-value">{Math.round(totalCalories)}</div>
            <div className="stat-description">kcal consumed</div>
          </div>
          
          <div className="stat-card nutrition-card">
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{nutritionEntries.length}</div>
            <div className="stat-description">Meals logged</div>
          </div>

          <div className="stat-card nutrition-card">
            <div className="stat-label">Protein</div>
            <div className="stat-value">{Math.round(totalProtein)}g</div>
            <div className="stat-description">Total protein</div>
          </div>

          <div className="stat-card nutrition-card">
            <div className="stat-label">Carbs</div>
            <div className="stat-value">{Math.round(totalCarbs)}g</div>
            <div className="stat-description">Total carbs</div>
          </div>

          <div className="stat-card nutrition-card">
            <div className="stat-label">Fat</div>
            <div className="stat-value">{Math.round(totalFat)}g</div>
            <div className="stat-description">Total fat</div>
          </div>
        </div>
      </div>

      <div className="entries-section">
        <h2>Recent Meals</h2>
        {loading ? (
          <div className="empty-state">
            <p>Loading meal entries...</p>
          </div>
        ) : nutritionEntries.length === 0 ? (
          <div className="empty-state">
            <p>No meals logged yet. Start tracking your nutrition to see your progress!</p>
          </div>
        ) : (
          <div className="entries-list">
            {nutritionEntries.map((entry, idx) => {
              const entryDate = new Date(entry.date);
              const formattedDate = entryDate.toLocaleDateString('en-US', { 
                weekday: 'short',
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
              const formattedTime = entryDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
              });
              
              return (
                <div key={entry.id || idx} className="entry-item nutrition-entry">
                  <div className="entry-left">
                    <div className="entry-emoji">{mealTypeEmojis[entry.mealType] || '🍽️'}</div>
                  </div>
                  <div className="entry-middle">
                    <p className="entry-text"><strong>{entry.food}</strong></p>
                    <p className="entry-meal-type">{entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}</p>
                    <p className="entry-date">{formattedDate} at {formattedTime}</p>
                    <div className="entry-macros">
                      <span>P: {entry.protein}g</span> | 
                      <span>C: {entry.carbs}g</span> | 
                      <span>F: {entry.fat}g</span>
                    </div>
                  </div>
                  <div className="entry-right">
                    <span className="entry-value">{entry.calories} cal</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
