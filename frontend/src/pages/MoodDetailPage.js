import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';
import '../styles/DetailPages.css';

export default function MoodDetailPage({ user, onNavigate }) {
  const [moodEntries, setMoodEntries] = useState([]);
  const [newMood, setNewMood] = useState('5');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, [user.id]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const response = await api.getUserMood(user.id);
      setMoodEntries(response.data || []);
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setMoodEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMood = async () => {
    if (!newMood) return;
    
    try {
      await api.addMood(user.id, {
        mood: 'logged',
        rating: parseInt(newMood),
        activities: '',
        notes: ''
      });
      
      // Refresh the data
      await fetchMoodData();
      setNewMood('5');
    } catch (error) {
      console.error('Error logging mood:', error);
    }
  };

  const moodLabels = {
    1: '😢 Very Poor',
    2: '😟 Poor',
    3: '😐 Neutral',
    4: '🙂 Okay',
    5: '😊 Good',
    6: '😄 Very Good',
    7: '😆 Excellent',
    8: '😍 Amazing',
    9: '🤩 Awesome',
    10: '🎉 Outstanding'
  };

  const averageMood = moodEntries.length > 0 
    ? (moodEntries.reduce((sum, entry) => sum + (entry.rating || 0), 0) / moodEntries.length).toFixed(1)
    : 0;

  return (
    <div className="detail-page-root">
      <section className="detail-header">
        <div className="header-content">
          <h1>Daily Mood Tracking</h1>
          <p className="header-subtitle">Monitor your emotional wellbeing and track patterns over time</p>
        </div>
      </section>

      <div className="detail-grid">
        <div className="stats-panel">
          <div className="stat-card mood-card">
            <div className="stat-label">Current Average</div>
            <div className="stat-value">{averageMood}/10</div>
            <div className="stat-description">{moodLabels[Math.round(averageMood)]}</div>
          </div>
          
          <div className="stat-card mood-card">
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{moodEntries.length}</div>
            <div className="stat-description">Mood logs recorded</div>
          </div>
        </div>

        <div className="input-panel mood-input-panel">
          <h2>Log Your Mood</h2>
          <div className="mood-slider-container">
            <div className="mood-slider-labels">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={newMood}
              onChange={(e) => setNewMood(e.target.value)}
              className="mood-slider"
            />
            <div className="mood-display">
              <div className="mood-emoji" style={{ fontSize: '3rem' }}>
                {moodLabels[parseInt(newMood)].split(' ')[0]}
              </div>
              <div className="mood-text">
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{newMood}/10</p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#475569' }}>{moodLabels[parseInt(newMood)]}</p>
              </div>
            </div>
          </div>
          <button onClick={handleAddMood} className="btn-log-mood">
            Log Mood Entry
          </button>
        </div>
      </div>

      <div className="entries-section">
        <h2>Recent Mood Entries</h2>
        {loading ? (
          <div className="empty-state">
            <p>Loading mood entries...</p>
          </div>
        ) : moodEntries.length === 0 ? (
          <div className="empty-state">
            <p>No mood entries yet. Start tracking to see your patterns!</p>
          </div>
        ) : (
          <div className="entries-list">
            {moodEntries.map((entry, idx) => {
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
                <div key={entry.id || idx} className="entry-item mood-entry">
                  <div className="entry-left">
                    <div className="entry-emoji">{moodLabels[entry.rating].split(' ')[0]}</div>
                  </div>
                  <div className="entry-middle">
                    <p className="entry-text">{moodLabels[entry.rating]}</p>
                    <p className="entry-date">{formattedDate} at {formattedTime}</p>
                    {entry.activities && <p className="entry-notes">{entry.activities}</p>}
                    {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                  </div>
                  <div className="entry-right">
                    <span className="entry-value">{entry.rating}/10</span>
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
