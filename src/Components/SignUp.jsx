import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import './SignUp.css'; // Import the CSS file

const API_BASE_URL = 'http://localhost:3000'; 

function SignUp() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Pass the raw email and password to the AuthProvider's login function
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const validateForm = () => {
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. SIGN UP: Create the user account in the database
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nameAndSurname: form.name, // NOTE: Use 'nameAndSurname' to match backend field
                    email: form.email,
                    password: form.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed. Please try again.');
            }

            // 2. AUTOMATIC LOGIN: Call the AuthProvider's login function
            // The AuthProvider will handle the /checkpassword API call and localStorage storage.
            const loginResult = await login(form.email, form.password); 

            if (!loginResult.success) {
                // If login fails immediately after signup (unexpected but possible)
                throw new Error(loginResult.message || "Account created, but automatic login failed. Please log in manually.");
            }
            
            // 3. Navigate to the home page
            navigate('/'); 

        } catch (err) {
            console.error('Sign Up Error:', err);
            const displayError = err.message.includes("Failed to fetch") 
                ? "Could not connect to the backend. Is your server running?" 
                : err.message;
            setError(displayError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2 className="signup-title">Create Your Baddie Account</h2>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSignUp}>
                    
                    {/* Name Field */}
                    <div className="form-group">
                        <User size={20} className="input-icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="signup-input"
                            disabled={loading}
                            required
                        />
                    </div>
                    
                    {/* Email Field */}
                    <div className="form-group">
                        <Mail size={20} className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            className="signup-input"
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
                            placeholder="Password (min 6 chars)"
                            value={form.password}
                            onChange={handleChange}
                            className="signup-input"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <CheckCircle size={20} className="input-icon" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="signup-input"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="signup-button" 
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>

                <p className="login-link">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;