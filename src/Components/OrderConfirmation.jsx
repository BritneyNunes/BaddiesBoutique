import React from 'react';
import { Link } from "react-router-dom"
import { CheckCircle, Search, Heart } from 'lucide-react';
import './OrderConfirmation.css'; 

function OrderConfirmation() {
    
    return (
        <main className="confirmation-page-container">
            
            {/* 1. Header/Navbar Section */}
            <header className="checkout-header">
                <div className="boutique-title">Baddies Boutique</div>
                <div className="flex items-center space-x-6 text-base text-gray-700">
                    <span>Shop All</span>
                    <Search className="header-icon" />
                    <Heart className="header-icon" />
                    <div className="relative">
                        {/* Mail/Envelope Icon */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="header-icon"
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2" fill="none" stroke="currentColor"/>
                            <path d="m22 7-8.97 5.7a1.83 1.83 0 0 1-2.06 0L2 7"/>
                        </svg>
                        {/* Small, empty badge to match the image */}
                        <span className="cart-badge"></span>
                    </div>
                </div>
            </header>

            {/* 2. Main Centering Content Area */}
            <div className="confirmation-content-wrapper">
                
                {/* 3. Confirmation Card */}
                <div className="confirmation-card">
                    
                    {/* Checkmark Icon and Wrapper */}
                    <div className="confirmation-icon-wrapper">
                        <CheckCircle size={40} />
                    </div>
    
                    {/* Main Message */}
                    <h1 className="order-placed-title">
                        Order Placed!
                    </h1>
                    
                    <p className="order-placed-text">
                        Thank you for shopping at Baddies Boutique.
                        <br />
                        Your order confirmation has been sent to your email.
                    </p>
    
                    {/* Action Buttons */}
                    <div className="button-group">
                        
                        {/* Continue Shopping Button */}
                        <Link to="/">
                          <button 
                            className="continue-shopping-button"
                            onClick={() => console.log("Navigate to Shop All")}
                        >
                            CONTINUE SHOPPING
                        </button>
                        </Link>
    
                        {/* View History Button */}
                        <Link to="/">
                           <button 
                            className="view-history-button"
                            onClick={() => console.log("Navigate to Order History")}
                        >
                            VIEW ORDER HISTORY
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderConfirmation;