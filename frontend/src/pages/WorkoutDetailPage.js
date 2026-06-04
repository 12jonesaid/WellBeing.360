import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';
import '../styles/DetailPages.css';

export default function WorkoutDetailPage({ user }) {
  const [workoutEntries, setWorkoutEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutData();
  }, [user.id]);

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);
      const response = await api.getUserWorkouts(user.id);
      setWorkoutEntries(response.data || []);
    } catch (error) {
      console.error('Error fetching workout data:', error);
      setWorkoutEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const totalDuration = workoutEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalCalories = workoutEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  const averageIntensity = workoutEntries.length > 0 
    ? Math.round((workoutEntries.filter(e => e.intensity === 'high').length / workoutEntries.length) * 100)
    : 0;

  const workoutTypeEmojis = {
    yoga: '🧘',
    running: '🏃',
    cycling: '🚴',
    swimming: '🏊',
    crossfit: '⚡',
    stretching: '🤸',
    weightlifting: '🏋️',
    cardio: '❤️',
    pilates: '🧘‍♀️'
  };

  const intensityColors = {
    low: '#10b981',
    moderate: '#f59e0b',
    high: '#ef4444'
  };

  return (
    <div className="detail-page-root">
      <section className="detail-header">
        <div className="header-content">
          <h1>Workout Progress</h1>
          <p className="header-subtitle">Track your fitness activities and progress</p>
        </div>
      </section>

      <div className="detail-grid">
        <div className="stats-panel">
          <div className="stat-card workout-card">
            <div className="stat-label">Total Duration</div>
            <div className="stat-value">{totalDuration}</div>
            <div className="stat-description">minutes worked out</div>
          </div>
          
          <div className="stat-card workout-card">
            <div className="stat-label">Total Workouts</div>
            <div className="stat-value">{workoutEntries.length}</div>
            <div className="stat-description">Sessions completed</div>
          </div>

          <div className="stat-card workout-card">
            <div className="stat-label">Calories Burned</div>
            <div className="stat-value">{Math.round(totalCalories)}</div>
            <div className="stat-description">kcal burned</div>
          </div>

          <div className="stat-card workout-card">
            <div className="stat-label">Avg. Intensity</div>
            <div className="stat-value">{averageIntensity}%</div>
            <div className="stat-description">high intensity</div>
          </div>
        </div>
      </div>

      <div className="entries-section">
        <h2>Recent Workouts</h2>
        {loading ? (
          <div className="empty-state">
            <p>Loading workout entries...</p>
          </div>
        ) : workoutEntries.length === 0 ? (
          <div className="empty-state">
            <p>No workouts logged yet. Start your fitness journey today!</p>
          </div>
        ) : (
          <div className="entries-list">
            {workoutEntries.map((entry, idx) => {
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
                <div key={entry.id || idx} className="entry-item workout-entry">
                  <div className="entry-left">
                    <div className="entry-emoji">{workoutTypeEmojis[entry.type] || '💪'}</div>
                  </div>
                  <div className="entry-middle">
                    <p className="entry-text"><strong>{entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</strong></p>
                    <p className="entry-date">{formattedDate} at {formattedTime}</p>
                    <div className="entry-workout-details">
                      <span>⏱️ {entry.duration} min</span> | 
                      <span style={{ color: intensityColors[entry.intensity] || '#6b7280' }}>
                        📊 {entry.intensity.charAt(0).toUpperCase() + entry.intensity.slice(1)}
                      </span>
                    </div>
                    {entry.notes && <p className="entry-notes">📝 {entry.notes}</p>}
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
