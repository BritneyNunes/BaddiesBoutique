import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Mail, Lock } from 'lucide-react'; 
import './Login.css'; // Import the CSS file

// NOTE: Replace this with your actual backend API URL
const API_BASE_URL = 'http://localhost:3000/auth'; 

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Clear error message when user starts typing again
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, { // Use /login endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle failed login attempts (e.g., incorrect credentials)
        throw new Error(data.message || 'Login failed. Check your email and password.');
      }

      // Successful login response should include user data and a token
      const { user, token } = data; 
      
      // 1. Log the user in globally via Auth Context
      login(user, token); 

      // 2. Navigate to the home page or previous page
      navigate('/'); 

    } catch (err) {
      console.error('Login Error:', err);
      // Display the error message from the thrown error
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome Back, Baddie</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          
          {/* Email Field */}
          <div className="form-group">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="login-input"
              disabled={loading}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="login-input"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;