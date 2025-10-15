import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Cart from './Components/Cart'; 
import Checkout from './Components/Checkout';
import OrderConfirmation from './Components/OrderConfirmation';
// Import the AuthProvider for global state management
import { AuthProvider } from './Components/AuthContext'; 
// Import the new pages
import SignUp from './Components/SignUp'; 
import Login from './Components/Login'; 

import './App.css'; 

function App() {
  // NOTE: Removed local state (isLoggedIn, handleLoginSuccess, handleLogout) 
  // Authentication is now managed entirely by AuthProvider and useAuth() hook.

  return (
    // Wrap the entire app in Router and AuthProvider
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar /> {/* Always visible */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />

            {/* NEW AUTHENTICATION ROUTES */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* The Navbar icon links to '/auth' if logged out. Let's redirect that to login. */}
            <Route path="/auth" element={<Login />} /> 
            
            {/* TODO: Add a protected route for the user profile linked from the navbar */}
            {/* <Route path="/profile" element={<Profile />} /> */}

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
