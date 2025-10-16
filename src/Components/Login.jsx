import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react'; 
import './LogIn.css'; 
import { useAuth } from './AuthContext'; 

// NOTE: API_BASE_URL and LOGIN_ENDPOINT are now only used internally by AuthContext's login function.
// We keep the imports clean here.

function LogIn() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Get the centralized login function from your AuthProvider
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
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
            // ⭐ CORE CHANGE: Call the AuthProvider's login function with raw credentials
            // The AuthProvider handles the Base64 encoding, API call to /checkpassword,
            // and saving the resulting token to localStorage.
            const result = await login(form.email, form.password);

            if (result.success) {
                // Login successful, navigate home
                navigate('/'); 
            } else {
                // Display the error message provided by the AuthProvider
                throw new Error(result.message || 'Login failed.');
            }

        } catch (err) {
            console.error('Login Error:', err);
            // The AuthProvider now returns user-friendly messages, so we display them directly
            const displayError = err.message.includes("Network error") 
                ? "Could not connect to the backend. Is your server running?" 
                : err.message;
            setError(displayError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">
                    Welcome Back, Baddie
                </h2>
                
                {/* Error Message Display */}
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    
                    {/* Email Field */}
                    <div className="input-group">
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
                    <div className="input-group">
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

                <p className="signup-prompt">
                    Don't have an account? 
                    <Link to="/signup" className="signup-link">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LogIn;