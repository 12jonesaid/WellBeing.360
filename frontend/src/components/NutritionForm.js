import React, { useState } from 'react';
import { Apple } from 'lucide-react';
import * as api from '../utils/api';
import '../styles/Form.css';

const calorieEstimates = [
  { meal: 'breakfast', label: 'Bowl of cereal', calories: 240 },
  { meal: 'breakfast', label: 'Avocado toast', calories: 270 },
  { meal: 'lunch', label: 'Chicken sandwich', calories: 360 },
  { meal: 'lunch', label: 'Grilled salad', calories: 290 },
  { meal: 'dinner', label: 'Pasta plate', calories: 520 },
  { meal: 'dinner', label: 'Rice & veggies', calories: 450 },
  { meal: 'snack', label: 'Fruit smoothie', calories: 210 },
  { meal: 'snack', label: 'Protein bar', calories: 190 }
];

export default function NutritionForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    meal: 'breakfast',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEstimateClick = (calories) => {
    setFormData({
      ...formData,
      calories: calories.toString()
    });
  };

  const protein = parseFloat(formData.protein) || 0;
  const carbs = parseFloat(formData.carbs) || 0;
  const fat = parseFloat(formData.fat) || 0;
  const macroCalories = Math.round(protein * 4 + carbs * 4 + fat * 9);
  const hasMacroInput = protein > 0 || carbs > 0 || fat > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.addNutrition(user.id, {
        mealType: formData.meal,
        food: formData.description || 'Meal entry',
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0
      });
      setFormData({ meal: 'breakfast', description: '', calories: '', protein: '', carbs: '', fat: '' });
      onSuccess?.();
    } catch (err) {
      console.error('Error adding nutrition:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <Apple size={24} />
        <h2>Log Meal</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Meal Type</label>
          <select name="meal" value={formData.meal} onChange={handleChange}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="form-group">
          <label>Meal Description</label>
          <input
            type="text"
            name="description"
            placeholder="What did you eat?"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Calories</label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="estimate-helper">
          <div className="estimate-heading">
            <strong>Not sure how many calories?</strong>
            <span>
              Use the quick meal examples below, or enter protein, carbs, and fat to calculate calories automatically.
              Calories = protein×4 + carbs×4 + fat×9.
            </span>
          </div>
          <div className="estimate-buttons">
            {calorieEstimates
              .filter((item) => item.meal === formData.meal)
              .map((estimate) => (
                <button
                  key={estimate.label}
                  type="button"
                  className="estimate-pill"
                  onClick={() => handleEstimateClick(estimate.calories)}
                >
                  {estimate.label} · {estimate.calories} kcal
                </button>
              ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Protein (g)</label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Carbs (g)</label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Fat (g)</label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {hasMacroInput && (
          <div className="estimate-helper">
            <div className="estimate-heading">
              <strong>Calories from macros</strong>
              <span>
                Based on protein, carbs, and fat: {macroCalories} kcal.
                Tap to use this value as your meal calories.
              </span>
            </div>
            <button
              type="button"
              className="estimate-pill"
              onClick={() => handleEstimateClick(macroCalories)}
            >
              Use {macroCalories} kcal
            </button>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Log Meal'}
        </button>
      </form>
    </div>
  );
}
