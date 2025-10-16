import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User } from 'lucide-react';
import { useAuth } from './AuthContext';
import './Navbar.css';

function Navbar() {
  // Use the global authentication state and functions
  const { isLoggedIn, user, logout } = useAuth();
  
  // Local state to control the dropdown menu visibility
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Use the global logout function and close the menu
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <div className="navbar">
      {/* Left: Boutique logo - Links to Home ("/") */}
      <Link to="/">
        <h1 className="navbar-logo">Baddies Boutique</h1>
      </Link>

      {/* Right: Icons and Shop All */}
      <div className="navbar-nav">
        {/* "Shop All" links to Home ("/") */}
        <Link to="/" className="shop-all">Shop All</Link>
        
        {/* Wrap icons in their own div for better control */}
        <div className="navbar-icons">
          <button className="navbar-button" title="Search">
            <Search size={24} />
          </button>
          
          {/* Wishlist button is authenticated (only show if logged in, or link to auth page) */}
          <Link to={isLoggedIn ? "/wishlist" : "/auth"}>
            <button className="navbar-button" title="Wishlist">
              <Heart size={24} />
            </button>
          </Link>

          
          {/* Shopping Cart button */}
          <Link to="/cart">
            <button className="navbar-button" title="Cart">
              <ShoppingCart size={24}/>
            </button>
          </Link>

           {/* New Profile Icon and Dropdown Container */}
          <div className="navbar-profile-container">
            {isLoggedIn ? (
              // LOGGED IN: Show icon that toggles the dropdown
              <button 
                className="navbar-button profile-toggle" 
                title="Profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <User size={24} />
              </button>
            ) : (
              // LOGGED OUT: Link directly to the authentication page
              <Link to="/auth" className="navbar-button" title="Sign Up / Log In">
                <User size={24} />
              </Link>
            )}

            {/* Dropdown Menu (only visible when logged in and toggled) */}
            {isLoggedIn && showProfileMenu && (
              <div className="profile-dropdown">
                {/* Use the actual user name if available, otherwise a generic greeting */}
                <span className="profile-username">Hi, {user?.name || 'Baddie'}!</span>
                
                {/* Link to the user's main profile page
                <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                  View Profile
                </Link> */}

                {/* Log Out button */}
                <button className="dropdown-item logout-button" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Navbar;