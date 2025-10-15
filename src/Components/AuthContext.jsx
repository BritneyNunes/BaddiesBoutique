import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context object
export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

// Helper hook to access the auth context easily
export const useAuth = () => useContext(AuthContext);

// 2. Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Use 'user' state to determine login status (isLoggedIn = user !== null)
  // user object will store data like { id, name, email, token }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token/user from storage on initial load (optional, but good practice)
  useEffect(() => {
    // ⚠️ TODO: Implement token/user loading from localStorage or secure storage here
    // const storedToken = localStorage.getItem('authToken');
    // if (storedToken) {
    //   fetchUserProfile(storedToken).then(data => setUser(data));
    // }
    setLoading(false); // Once check is done, stop loading state
  }, []);

  // --- Authentication Functions ---

  // Function to handle login success
  const login = (userData, authToken) => {
    // 1. Store the token/user data securely
    // localStorage.setItem('authToken', authToken); 
    
    // 2. Set the user state
    setUser(userData);
  };

  // Function to handle logout
  const logout = () => {
    // 1. Remove the token/user data from storage
    // localStorage.removeItem('authToken'); 

    // 2. Clear the user state
    setUser(null);
  };
  
  // The value provided to consuming components
  const contextValue = {
    isLoggedIn: !!user, // true if user is not null, false otherwise
    user,
    login,
    logout,
    loading,
  };

  if (loading) {
    // Optional: Render a loading spinner or screen while checking auth status
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};