import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import * as api from '../utils/api';
import '../styles/Form.css';

export default function MoodForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    mood: 7,
    focusTime: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: 1, label: '😢 Very Bad', emoji: '😢' },
    { value: 2, label: '😔 Bad', emoji: '😔' },
    { value: 3, label: '😕 Poor', emoji: '😕' },
    { value: 4, label: '😐 Neutral', emoji: '😐' },
    { value: 5, label: '🙂 Okay', emoji: '🙂' },
    { value: 6, label: '😊 Good', emoji: '😊' },
    { value: 7, label: '😄 Very Good', emoji: '😄' },
    { value: 8, label: '😆 Excellent', emoji: '😆' },
    { value: 9, label: '🤩 Awesome', emoji: '🤩' },
    { value: 10, label: '🎉 Amazing', emoji: '🎉' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMoodClick = (moodValue) => {
    setFormData({ ...formData, mood: moodValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.addMood(user.id, {
        mood: 'logged',
        rating: parseInt(formData.mood),
        activities: formData.focusTime ? `Focus time: ${formData.focusTime} min` : '',
        notes: formData.notes
      });
      setFormData({ mood: 7, focusTime: '', notes: '' });
      onSuccess?.();
    } catch (err) {
      console.error('Error adding mood:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <Brain size={24} />
        <h2>Log Mood</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>How's your mood?</label>
          <div className="mood-selector">
            {moods.map(m => (
              <button
                key={m.value}
                type="button"
                className={`mood-btn ${formData.mood === m.value ? 'active' : ''}`}
                onClick={() => handleMoodClick(m.value)}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          <p className="mood-label">{moods.find(m => m.value === parseInt(formData.mood))?.label}</p>
        </div>

        <div className="form-group">
          <label>Focus Time Today (minutes)</label>
          <input
            type="number"
            name="focusTime"
            value={formData.focusTime}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="What's on your mind?"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Log Mood'}
        </button>
      </form>
    </div>
  );
}
