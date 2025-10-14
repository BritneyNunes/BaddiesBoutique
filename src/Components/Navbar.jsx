import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { ShoppingCart, Heart, Search } from 'lucide-react';
import './Navbar.css';

function Navbar() {
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
          <button className="navbar-button" title="Wishlist">
            <Heart size={24} />
          </button>
          
          {/* Shopping Cart button is now wrapped in a Link to /cart */}
          <Link to="/cart">
            <button className="navbar-button" title="Cart">
              <ShoppingCart size={24}/>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;