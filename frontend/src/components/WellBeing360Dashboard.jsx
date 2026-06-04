import React, { useState, useEffect } from 'react';
import * as api from '../utils/api';

export default function WellBeing360Dashboard({ user, onNavigate }) {
  const [moodData, setMoodData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user data
  const fetchUserData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const [moodRes, nutritionRes, workoutRes] = await Promise.all([
        api.getUserMood(user.id).catch(() => ({ data: [] })),
        api.getUserNutrition(user.id).catch(() => ({ data: [] })),
        api.getUserWorkouts(user.id).catch(() => ({ data: [] }))
      ]);

      setMoodData(moodRes.data || []);
      setNutritionData(nutritionRes.data || []);
      setWorkoutData(workoutRes.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  // Calculate mood stats
  const todayMood = moodData.length > 0 ? moodData[moodData.length - 1] : null;
  const averageMood = moodData.length > 0 
    ? (moodData.reduce((sum, m) => sum + (m.rating || 0), 0) / moodData.length).toFixed(1)
    : 0;

  // Calculate nutrition stats for today
  const today = new Date().toISOString().split('T')[0];
  const todayNutrition = nutritionData.filter(n => {
    const nDate = new Date(n.date).toISOString().split('T')[0];
    return nDate === today;
  });
  const totalCalories = todayNutrition.reduce((sum, n) => sum + (n.calories || 0), 0);

  // Calculate workout stats for this week
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  
  const thisWeekWorkouts = workoutData.filter(w => {
    const wDate = new Date(w.date);
    return wDate >= weekStart;
  });

  const rawName = user?.name || 'Student';
  const displayName = rawName.trim().toLowerCase() === 'james' ? 'Student' : rawName;

  return (
    <div className="dashboard-root">
      <section className="dash-premium-header">
        <div className="header-greeting">
          <div className="greeting-row">
            <h1>Hello, {displayName}.</h1>
            <span className="verified-check">Verified student</span>
          </div>
          <p className="greeting-sub">
            Your Health & Wellness dashboard gives you quick access to mood trends, meal tracking, exercise goals, and daily wellbeing tips.
          </p>
        </div>

        <div className="header-controls">
          <button className="premium-icon-btn" aria-label="Notifications">
            🔔
            <span className="bell-badge" />
          </button>
          <button className="premium-icon-btn" aria-label="Premium features">
            ⭐
          </button>
          <div className="premium-avatar">{displayName.charAt(0)}</div>
        </div>
      </section>

      <section className="new-user-welcome" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))', borderRadius: '24px', padding: '1.5rem', marginTop: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <h3 style={{ marginTop: 0, color: '#1e5f34', fontSize: '1.1rem', fontWeight: 700 }}>🎯 Starting Your Wellness Journey</h3>
        <p style={{ margin: '0.5rem 0', color: '#475569', fontSize: '0.95rem' }}>
          All your data starts from <strong>zero</strong>. Begin tracking your Mood, Nutrition, and Workouts to see your progress and build better habits!
        </p>
      </section>

      <div className="dash-premium-grid">
        <button 
          className="premium-card clickable-card"
          onClick={() => onNavigate('moodDetail')}
          style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
        >
          <div className="card-header-row">
            <h3>Daily Mood</h3>
            <span className="badge-pill progress-badge">{moodData.length > 0 ? '100%' : '0%'} tracked</span>
          </div>
          <div className="weight-main-value">
            <span className="weight-num">{averageMood}</span>
            <span className="weight-unit">/ 10</span>
          </div>
          <div className="weight-sub-metrics">
            <span className="weight-diff">{moodData.length > 0 ? `${moodData.length} entries` : 'No data yet'}</span>
            <span className="weight-helper">{moodData.length > 0 ? 'Keep tracking your mood patterns.' : 'Start logging your mood to track patterns.'}</span>
          </div>
        </button>

        <button 
          className="premium-card clickable-card"
          onClick={() => onNavigate('nutritionDetail')}
          style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
        >
          <div className="card-header-row">
            <h3>Nutrition Balance</h3>
            <span className="badge-pill calorie-badge">{totalCalories} kcal</span>
          </div>
          <div className="calorie-display-wrap">
            <div>
              <p className="calorie-num">{todayNutrition.length}</p>
              <p className="calorie-unit">Meals today</p>
            </div>
          </div>
          <div className="weight-sub-metrics">
            <span className="calorie-left-indicator">{todayNutrition.length > 0 ? `${totalCalories} calories logged` : 'No entries yet'}</span>
            <span className="calorie-tip">{todayNutrition.length > 0 ? 'Keep tracking your meals.' : 'Log your first meal to get started.'}</span>
          </div>
        </button>

        <button 
          className="premium-card clickable-card"
          onClick={() => onNavigate('workoutDetail')}
          style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
        >
          <div className="card-header-row">
            <h3>Workout Progress</h3>
            <span className="badge-pill">{thisWeekWorkouts.length > 0 ? '100%' : '0%'} this week</span>
          </div>
          <div className="weight-main-value">
            <span className="weight-num">{thisWeekWorkouts.length}</span>
            <span className="weight-unit">Workouts</span>
          </div>
          <div className="weight-sub-metrics">
            <span className="weight-diff">{thisWeekWorkouts.length > 0 ? 'Great progress!' : 'Ready to start?'}</span>
            <span className="weight-helper">{thisWeekWorkouts.length > 0 ? 'Keep up the momentum!' : 'Log your first workout to begin tracking.'}</span>
          </div>
        </button>

        <button 
          className="premium-card clickable-card"
          onClick={() => onNavigate('focusDetail')}
          style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
        >
          <div className="card-header-row">
            <h3>Daily Focus</h3>
            <span className="badge-pill">Getting started</span>
          </div>
          <div className="weight-main-value">
            <span className="weight-num">0%</span>
            <span className="weight-unit">Goal completion</span>
          </div>
          <div className="weight-sub-metrics">
            <span className="weight-diff">No goals set yet</span>
            <span className="weight-helper">Create your first habit to start your wellness journey.</span>
          </div>
        </button>
      </div>

      <section className="premium-card dashboard-wellbeing-card">
        <div className="wellbeing-card-header">
          <div>
            <p className="wellbeing-card-label">Weekly wellbeing score</p>
            <h3>{Math.round((moodData.length / 7) * 100)}% of goal reached</h3>
          </div>
          <span className="trend-pill">Trend {moodData.length > 0 ? '+' : ''}0%</span>
        </div>

        <div className="progress-content-layout">
          <div className="circular-progress-wrap">
            <svg className="svg-circle-progress" viewBox="0 0 100 100">
              <circle className="circle-bg" cx="50" cy="50" r="40" />
              <circle className="circle-fill" cx="50" cy="50" r="40" style={{ strokeDashoffset: `${251 - ((moodData.length / 7) * 251)}` }} />
            </svg>
            <div className="progress-percentage-label">
              <span className="percentage-num">{Math.round((moodData.length / 7) * 100)}%</span>
              <span className="percentage-subtext">of your wellbeing goal</span>
            </div>
          </div>

          <div className="wellbeing-chart-panel">
            <p className="weight-trend-label">{moodData.length > 0 ? 'Keep tracking to maintain your wellness progress.' : 'Start tracking to see your wellness trends and progress.'}</p>
            <div className="sparkline-chart-container">
              <svg className="sparkline-svg" viewBox="0 0 300 120" preserveAspectRatio="none">
                <g className="sparkline-grid">
                  <line x1="0" y1="24" x2="300" y2="24" />
                  <line x1="0" y1="60" x2="300" y2="60" />
                  <line x1="0" y1="96" x2="300" y2="96" />
                </g>
                <path className="sparkline-line" d="M0,100 L300,100" fill="none" strokeWidth="4" />
                <circle className="sparkline-point" cx="0" cy="100" r="4" />
              </svg>
            </div>
            <div className="wellbeing-note">
              <span>Continue logging meals and moods to keep this score steady.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-empty-state">
        <p>Zero data right now. Log your mood, meals, and workouts to build your wellness story!</p>
        <div>
          <p className="meal-title">Add a quick meal</p>
          <p className="meal-calories">
            If you’re not sure what to enter, open Nutrition and use the quick meal estimates or enter protein/carbs/fat.
            The app will calculate calories for you.
          </p>
        </div>
        <button className="meal-add-btn" type="button">+</button>
      </section>

      <section className="dashboard-stats-badges-section">
        <h2>Today’s highlights</h2>
        <div className="stats-badges-grid">
          <div className="stats-badge-card">
            <div className="badge-icon icon-workout">💪</div>
            <div className="badge-info">
              <h4>Energy boost</h4>
              <p className="badge-value">0 min active</p>
              <p className="badge-sub">No workouts logged yet</p>
            </div>
          </div>

          <div className="stats-badge-card">
            <div className="badge-icon icon-nutrition">🥗</div>
            <div className="badge-info">
              <h4>Nutrition summary</h4>
              <p className="badge-value">0 meals logged</p>
              <p className="badge-sub">Start tracking your meals</p>
            </div>
          </div>

          <div className="stats-badge-card">
            <div className="badge-icon icon-mood">😊</div>
            <div className="badge-info">
              <h4>Mood boost</h4>
              <p className="badge-value">0 days tracked</p>
              <p className="badge-sub">Begin logging your mood today</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
