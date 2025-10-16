import React, { createContext, useContext, useState, useEffect } from 'react';
import { Base64 } from 'js-base64'; // ⚠️ Ensure you have installed: npm install js-base64

// 1. Create the Context object
export const AuthContext = createContext({
  isLoggedIn: false,
  user: null, // user will store { _id, email, basicToken }
  login: () => {},
  logout: () => {},
  getToken: () => null, // Added for centralized token access
  loading: true,
});

// Helper hook to access the auth context easily
export const useAuth = () => useContext(AuthContext);

// --- API Helper Function ---
const validateBasicAuthToken = async (basicToken) => {
    const CHECK_PASSWORD_API = 'http://localhost:3000/checkpassword';

    if (!basicToken) return null;

    try {
        const response = await fetch(CHECK_PASSWORD_API, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokenCheck: true }), 
        });

        if (response.ok) {
            const data = await response.json();
            
            // Success: User is logged in. Decode the token to get the email.
            const decodedCredentials = Base64.decode(basicToken);
            const email = decodedCredentials.split(":")[0];

            return {
                _id: data.user._id,
                email: email,
                basicToken: basicToken,
            };
        } else {
            // Token is invalid/rejected by server
            localStorage.removeItem('basicAuthToken');
            return null;
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
        return null;
    }
};


// 2. Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Persistence Check on Mount ---
  useEffect(() => {
    const storedToken = localStorage.getItem('basicAuthToken');
    
    if (storedToken) {
      validateBasicAuthToken(storedToken)
        .then(validatedUser => {
          if (validatedUser) {
            setUser(validatedUser);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // No token found, loading finished
    }
  }, []);

  // --- Authentication Functions ---

  /**
   * Helper function to retrieve the Basic Auth token from localStorage.
   * Fixes the "AuthToken is missing" error by centralizing the key retrieval.
   */
  const getToken = () => {
    return localStorage.getItem('basicAuthToken'); 
  };
 
  /**
   * Function to handle login success
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const login = async (email, password) => {
    const base64Credentials = Base64.encode(`${email}:${password}`);
    const CHECK_PASSWORD_API = 'http://localhost:3000/checkpassword'; 
    
    try {
        const response = await fetch(CHECK_PASSWORD_API, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokenCheck: true }), 
        });

        if (response.ok) {
            const data = await response.json();
            const userData = {
                _id: data.user._id,
                email: email,
                basicToken: base64Credentials, // Store the encoded token
            };

            // 1. Store the token securely
            localStorage.setItem('basicAuthToken', base64Credentials); 
            
            // 2. Set the user state
            setUser(userData);
            return { success: true };
        } else {
            // Authentication failed (401 from server)
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Invalid email or password' };
        }
    } catch (error) {
        console.error("Login attempt failed:", error);
        return { success: false, message: 'Network error or server unavailable.' };
    }
  };

  // Function to handle logout
  const logout = () => {
    // 1. Remove the token/user data from storage
    localStorage.removeItem('basicAuthToken'); 

    // 2. Clear the user state
    setUser(null);
  };
  
  // The value provided to consuming components
  const contextValue = {
    isLoggedIn: !!user, // true if user is not null, false otherwise
    user,
    login,
    logout,
    getToken, // <-- New function to retrieve the token
    loading,
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};