import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CreditCard, Lock, ShoppingCart, Search, Heart } from 'lucide-react'; // Added missing icons
import './Checkout.css'; 

// Mock Data and Calculations (Keep the mock data simple for demonstration)
const MOCK_CART_ITEMS = [
  { price: 159.99, quantity: 1 },
  { price: 150.00, quantity: 1 },
];
const SHIPPING_COST = 15.00;
const TAX_RATE = 0.08; 

// The total calculation function remains the same
const useOrderTotals = (items) => {
  const subtotal = useMemo(() => 
   items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
   [items]
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + SHIPPING_COST + tax;
  return { subtotal, tax, total };
};


function Checkout() {
  const { subtotal, tax, total } = useOrderTotals(MOCK_CART_ITEMS);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Dummy handlers for form state (simplified)
  const handleChange = () => {};
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      console.log("Order Placed Successfully!"); 
    }, 1500);
  };
  
  const InputField = ({ label, name, type = 'text', section, required = false, maxLength = null }) => (
    <div className="form-field-group"> {/* Using new class for spacing */}
      <label 
        htmlFor={name} 
        className="input-label"
      >
        {label} {required && <span>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        onChange={(e) => handleChange(e, section)}
        className="input-field" 
      />
    </div>
  );

  return (
    <div className="checkout-page-container">

      {/* 1. Header/Navbar Section */}
      <header className="checkout-header">
        <div className="boutique-title">Baddies Boutique</div>
        <div className="flex items-center space-x-6 text-base text-gray-700">
          <span>Shop All</span>
          <Search size={20} className="cursor-pointer" />
          <Heart size={20} className="cursor-pointer" />
          <div className="relative">
            <ShoppingCart size={20} className="cursor-pointer" />
            <span className="absolute -top-2 -right-2 text-xs font-bold text-white bg-dusty-rose rounded-full h-4 w-4 flex items-center justify-center" style={{ backgroundColor: '#C48E96' }}>2</span>
          </div>
        </div>
      </header>
      
      {/* 2. Main Title */}
      <h2 className="section-title-checkout">Finalizing Your Order</h2>

      {/* 3. Main Content Layout */}
      <div className="checkout-content-wrapper">
        
        <form onSubmit={handlePlaceOrder} className="form-sections-wrapper">
          
          {/* Shipping Details */}
          <div className="form-card">
            <h3 className="section-heading">
              <Truck /> Shipping Details
            </h3>
            <div>
              <InputField label="Full Name" name="fullName" section="shipping" required={true} />
              <InputField label="Street Address" name="address" section="shipping" required={true} />
              <div className="grid-cols-2">
                <InputField label="City/State" name="city" section="shipping" required={true} />
                <InputField label="Zip Code" name="zip" section="shipping" type="number" required={true} />
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="form-card">
            <h3 className="section-heading">
              <CreditCard /> Payment Information
            </h3>
            <div>
              <InputField 
                label="Card Number" 
                name="cardNumber" 
                section="payment" 
                type="text" 
                required={true} 
                maxLength={19} 
              />
              <div className="grid-cols-2">
                <InputField label="Expiry (MM/YY)" name="expiry" section="payment" required={true} maxLength={5} />
                <InputField label="CVV" name="cvv" section="payment" type="number" required={true} maxLength={4} />
              </div>
            </div>
          </div>
        </form>

        {/* Right Column: Order Summary & Action */}
        <div className="order-summary-card-checkout">
          <h3 className="summary-heading-checkout">
            Summary
          </h3>
          
          {/* Itemized Totals */}
          <div className="summary-totals-section">
            <div className="summary-line-checkout">
              <span>Subtotal ({MOCK_CART_ITEMS.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line-checkout">
              <span>Shipping</span>
              <span>${SHIPPING_COST.toFixed(2)}</span>
            </div>
            <div className="summary-line-checkout">
              <span>Taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Grand Total - Combined layout to match the image spacing */}
          <div className="total-line-checkout">
            <span className='order-total-label'>Order Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button 
            type="submit"
            className="place-order-button"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" /></svg>
                Processing...
              </>
            ) : (
              <>
                <Lock size={20} />

                 <Link to="/confirmation">
                <span>Pay ${total.toFixed(2)} Securely</span>
                 </Link>
              </>
            )}
          </button>
          <p className="secure-text-checkout">
            By placing this order, you agree to the boutique's terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;