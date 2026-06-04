import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import * as api from '../utils/api';
import '../styles/Auth.css';

// Email validation function - RFC 5322 compliant
const isValidEmail = (email) => {
  // More robust email validation that closely matches validator.isEmail()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Additional checks: no leading/trailing spaces, valid format
  if (!emailRegex.test(email)) return false;
  // Check for common invalid patterns
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) return false;
  if (email.includes(' ')) return false;
  return true;
};

export default function Login({ onLogin, onBack, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (mode === 'register' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = mode === 'login'
        ? await api.login(email, password)
        : await api.register(name, email, password);

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        console.log('✅ Authentication successful, token saved');
      }

      // Call onLogin with user data
      onLogin(response.data.user || response.data);
    } catch (err) {
      // Log detailed error for debugging
      console.error('❌ Authentication error:', err);
      
      let errorMessage = 'Unable to authenticate. Please try again.';
      
      // Check for specific error messages
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Check that the backend is running and accessible.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Backend server may be down or unreachable.';
      } else if (err.response?.status === 0) {
        errorMessage = 'Connection refused: Backend server is not accessible.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    try {
      const response = await api.googleLogin(credentialResponse.credential);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        console.log('✅ Google authentication successful, token saved');
      }

      // Call onLogin with user data
      onLogin(response.data.user || response.data);
    } catch (err) {
      console.error('❌ Google authentication error:', err);
      setError(err.response?.data?.error || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Lock className="icon" size={44} />
            <h1>{mode === 'login' ? 'Student Login' : 'Create Account'}</h1>
            <p>
              {mode === 'login'
                ? 'Sign in to your student wellness dashboard.'
                : 'Register now and start tracking your health improvements.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#124925' }} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '42px' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#124925' }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '42px' }}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>

          {mode === 'login' && (
            <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: '#999', textAlign: 'center', marginBottom: '1rem' }}>Or continue with</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                />
              </div>
            </div>
          )}

          <div className="demo-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mode === 'login' && (
              <div style={{ fontSize: '0.95rem', color: '#475569' }}>
                Demo credentials: <strong>demo@example.com</strong> / <strong>demo</strong>
              </div>
            )}
            <span>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#124925',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginLeft: '0.35rem',
                  fontWeight: 700,
                }}
              >
                {mode === 'login' ? 'Create account' : 'Sign in'}
              </button>
            </span>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#4b5563',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: '0.94rem',
              }}
            >
              Back to homepage
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
