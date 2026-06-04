import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import * as api from '../utils/api';
import '../styles/Form.css';

export default function WorkoutForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'yoga',
    duration: '',
    calories: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const workoutTypes = ['yoga', 'cycling', 'running', 'crossfit', 'swimming', 'stretching'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.addWorkout(user.id, {
        type: formData.type,
        duration: parseInt(formData.duration),
        calories: parseInt(formData.calories) || 0,
        intensity: 'moderate',
        notes: formData.description
      });
      setFormData({ type: 'yoga', duration: '', calories: '', description: '' });
      onSuccess?.();
    } catch (err) {
      console.error('Error adding workout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <Dumbbell size={24} />
        <h2>Log Workout</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Workout Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Calories Burned</label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Description (optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="How did it feel?"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Log Workout'}
        </button>
      </form>
    </div>
  );
}
