import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import './Cart.css'; // Ensure this path correctly points to your CSS file

// Constants for mock data and colors (matching CSS variables)
const COLORS = {
    DUSTY_ROSE_ACCENT: '#C48E96',
    TAUPE_BORDER: '#D9C4C0',
};

const initialMockCart = [
    { id: 4, name: "Statement Gold Hoops", quantity: 1, price: 35.00, imageUrl: "https://placehold.co/80x80/CCCCCC/333333?text=EARRINGS" },
    { id: 2, name: "Velvet Cropped Blazer", quantity: 1, price: 95.00, imageUrl: "https://placehold.co/80x80/CCCCCC/333333?text=BLAZER" },
    { id: 3, name: "Silk Slip Skirt", quantity: 1, price: 79.50, imageUrl: "https://placehold.co/80x80/CCCCCC/333333?text=SKIRT" },
];

const DEFAULT_SHIPPING_COST = 15.00;

function Cart() {
  const [cartItems, setCartItems] = useState(initialMockCart);
  
  // Calculate subtotal and total items
  const { subtotal, totalItems } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const calculatedTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    return { subtotal: calculatedSubtotal, totalItems: calculatedTotalItems };
  }, [cartItems]);
  
  const estimatedTotal = subtotal + DEFAULT_SHIPPING_COST;

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout with total: $" + estimatedTotal.toFixed(2));
  };

  // State for empty cart
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <ShoppingBag size={64} style={{ color: COLORS.DUSTY_ROSE_ACCENT }} />
        <h2 className="empty-cart-title">Your Bag is Empty</h2>
        <p className="empty-cart-message">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/">
          <button className="continue-shopping-button">
              Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  // State for cart with items
  return (
    <main className="cart-page-container">
      <h2 className="cart-title">Your Shopping Bag</h2>

      <div className="cart-content-wrapper">
        
        {/* Left Column: Cart Items List */}
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div 
              key={item.id} 
              className="cart-item" // Target class for individual item box
            >
              {/* Image Container */}
              <div className="item-image-container">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="item-image"
                  onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/80x80/${COLORS.TAUPE_BORDER.replace('#', '')}/FFFFFF?text=Item`; }}
                />
              </div>
              
              {/* Item Details */}
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-qty">Qty: {item.quantity}</p>
              </div>
              
              {/* Price and Remove Button */}
              <div className="item-actions">
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="item-remove-button"
                  title="Remove Item"
                >
                  <X size={18} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="order-summary-card"> {/* Target class for summary box */}
          <h3 className="summary-title">Order Summary</h3>
          
          <div className="summary-line">
            <span>Subtotal ({totalItems} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-line">
            <span>Shipping (Standard)</span>
            <span>${DEFAULT_SHIPPING_COST.toFixed(2)}</span>
          </div>
          
          <div className="summary-line total-line">
            <span>Estimated Total</span>
            <span>${estimatedTotal.toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button 
            onClick={handleCheckout}
            className="checkout-button"
          >
            PROCEED TO CHECKOUT
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Cart;