import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import SupportPage from './pages/SupportPage';
import MoodPage from './pages/MoodPage';
import HealthTipsPage from './pages/HealthTipsPage';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import NutritionForm from './components/NutritionForm';
import MoodForm from './components/MoodForm';
import MoodDetailPage from './pages/MoodDetailPage';
import NutritionDetailPage from './pages/NutritionDetailPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import FocusDetailPage from './pages/FocusDetailPage';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setPage('dashboard');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setPage('home');
    setActiveTab('dashboard');
    setSidebarOpen(false);
  };

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('dashboard');
  };

  const displayName = user?.name?.trim().toLowerCase() === 'james' ? 'Student' : user?.name || 'Student';

  if (!user) {
    if (page === 'login' || page === 'signup') {
      return <Login onLogin={handleLogin} onBack={() => setPage('home')} defaultMode={page === 'signup' ? 'register' : 'login'} />;
    }
    if (page === 'about') {
      return <AboutPage onNavigate={setPage} />;
    }
    if (page === 'features') {
      return <FeaturesPage onNavigate={setPage} />;
    }
    if (page === 'support') {
      return <SupportPage onNavigate={setPage} />;
    }
    if (page === 'mood') {
      return <MoodPage onNavigate={setPage} />;
    }
    if (page === 'healthtips') {
      return <HealthTipsPage onNavigate={setPage} />;
    }
    return <LandingPage onNavigate={setPage} currentPage={page} />;
  }

  return (
    <div className="app">
      <div className="app-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Health</h2>
            <button className="close-btn" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === 'workout' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('workout');
                setSidebarOpen(false);
              }}
            >
              💪 Log Workout
            </button>
            <button
              className={`nav-item ${activeTab === 'nutrition' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('nutrition');
                setSidebarOpen(false);
              }}
            >
              🥗 Log Meal
            </button>
            <button
              className={`nav-item ${activeTab === 'mood' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('mood');
                setSidebarOpen(false);
              }}
            >
              😊 Log Mood
            </button>
            {['moodDetail', 'nutritionDetail', 'workoutDetail', 'focusDetail'].includes(activeTab) && (
              <button
                className="nav-item back-btn"
                onClick={() => {
                  setActiveTab('dashboard');
                  setSidebarOpen(false);
                }}
              >
                ← Back to Dashboard
              </button>
            )}
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="top-bar">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="user-info">
              <span>{displayName}</span>
            </div>
          </header>

          <div className="content">
            {activeTab === 'dashboard' && <Dashboard user={user} onNavigate={setActiveTab} refreshKey={refreshKey} />}
            {activeTab === 'workout' && <WorkoutForm user={user} onSuccess={handleFormSuccess} />}
            {activeTab === 'nutrition' && <NutritionForm user={user} onSuccess={handleFormSuccess} />}
            {activeTab === 'mood' && <MoodForm user={user} onSuccess={handleFormSuccess} />}
            {activeTab === 'moodDetail' && <MoodDetailPage user={user} onNavigate={setActiveTab} />}
            {activeTab === 'nutritionDetail' && <NutritionDetailPage user={user} onNavigate={setActiveTab} />}
            {activeTab === 'workoutDetail' && <WorkoutDetailPage user={user} onNavigate={setActiveTab} />}
            {activeTab === 'focusDetail' && <FocusDetailPage user={user} onNavigate={setActiveTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
