import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react'; 
import './Login.css';

function LogIn() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
            // Encode email:password in Base64
            const encoded = btoa(`${form.email}:${form.password}`);

            const response = await fetch('http://localhost:3000/checkpassword', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${encoded}`,
                },
            });

            if (!response.ok) {
                const text = await response.text(); // catch HTML errors
                throw new Error(text || 'Login failed');
            }

            const data = await response.json();

            // Save the Base64 token in localStorage
            localStorage.setItem('authToken', encoded);
            localStorage.setItem('userEmail', form.email);

            console.log('Login successful', data);
            navigate('/'); // redirect to home

        } catch (err) {
            console.error('Login Error:', err);
            setError(err.message.includes('Invalid') ? 'Invalid email or password' : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Welcome Back, Baddie</h2>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
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

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <p className="signup-prompt">
                    Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default LogIn;
