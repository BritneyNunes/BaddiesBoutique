import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CreditCard, Lock, ShoppingCart, Search, Heart, Loader2, X } from 'lucide-react'; // Added Loader2 and X
import './Checkout.css'; 

const API_BASE_URL = 'http://localhost:3000';
const CART_ENDPOINT = '/carts';
const SHIPPING_COST = 15.00; // Fixed shipping cost in Rands
const TAX_RATE = 0.08; // 8% tax rate
const CURRENCY_SYMBOL = 'R'; // Changed from $ to R for Rands
const COLORS = { DUSTY_ROSE_ACCENT: '#C48E96', ERROR: '#e53e3e' };

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RETRIES = 3;

/**
 * Custom hook to calculate order totals from cart items.
 * Assumes item structure: { product: { price: number }, quantity: number }
 */
const useOrderTotals = (items) => {
    const subtotal = useMemo(() => 
        items.reduce((acc, item) => {
            const price = item.product?.price || 0;
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
        }, 0),
        [items]
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_COST + tax;
    return { subtotal, tax, total, totalItems: items.length };
};


function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { subtotal, tax, total, totalItems } = useOrderTotals(cartItems);

    // --- Data Fetching Logic ---
    const fetchCart = async (retryCount = 0) => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('basicAuthToken'); 
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${CART_ENDPOINT}`, {
                method: 'GET',
                headers: { 'Authorization': `Basic ${token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch cart data: ${response.statusText}`);
            }

            const data = await response.json();
            // Ensure we are dealing with an array, even if the cart is empty
            setCartItems(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error('Fetch Cart Error:', err);
            if (retryCount < MAX_RETRIES) {
                await sleep(Math.pow(2, retryCount) * 1000);
                fetchCart(retryCount + 1);
                return;
            }
            setError(`Could not load cart after ${MAX_RETRIES} attempts. ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    // --- Dummy Handlers ---
    const handleChange = () => {};
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // NOTE: This is where you would call the `/orders` endpoint in a real app
        setTimeout(() => {
            setIsProcessing(false);
            console.log("Order attempt finished. Redirecting to confirmation page (mock)."); 
            // window.location.href = '/confirmation'; 
        }, 1500);
    };
    
    const InputField = ({ label, name, type = 'text', section, required = false, maxLength = null }) => (
        <div className="form-field-group">
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

    // --- Loading / Error States ---
    if (loading) return (
        <div className="checkout-page-container flex justify-center items-center h-[80vh] flex-col">
            <Loader2 size={48} className="animate-spin" style={{ color: COLORS.DUSTY_ROSE_ACCENT }} />
            <h2 className="section-title-checkout mt-4">Preparing Checkout...</h2>
        </div>
    );
    
    if (error) return (
        <div className="checkout-page-container flex justify-center items-center h-[80vh] flex-col">
            <X size={48} style={{ color: COLORS.ERROR }} />
            <h2 className="section-title-checkout mt-4">Checkout Error</h2>
            <p className="text-gray-600">{error}</p>
            <Link to="/"><button className="place-order-button mt-6">Return to Shop</button></Link>
        </div>
    );

    // Redirect if cart is empty after loading
    if (cartItems.length === 0) return (
        <div className="checkout-page-container flex justify-center items-center h-[80vh] flex-col">
            <ShoppingCart size={64} style={{ color: COLORS.DUSTY_ROSE_ACCENT }} />
            <h2 className="section-title-checkout mt-4">Your Bag is Empty!</h2>
            <p className="text-gray-600">You must add items before checking out.</p>
            <Link to="/"><button className="place-order-button mt-6">Continue Shopping</button></Link>
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
                    <Link to="/cart" className="relative">
                        <ShoppingCart size={20} className="cursor-pointer" />
                        <span className="absolute -top-2 -right-2 text-xs font-bold text-white rounded-full h-4 w-4 flex items-center justify-center" style={{ backgroundColor: COLORS.DUSTY_ROSE_ACCENT }}>{totalItems}</span>
                    </Link>
                </div>
            </header>
            
            {/* 2. Main Title */}
            <h2 className="section-title-checkout">Finalizing Your Order</h2>

            {/* 3. Main Content Layout */}
            <div className="checkout-content-wrapper">
                
                {/* Form Section */}
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="form-sections-wrapper">
                    
                    {/* Shipping Details */}
                    <div className="form-card">
                        <h3 className="section-heading">
                            <Truck size={20} className="mr-2" /> Shipping Details
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
                            <CreditCard size={20} className="mr-2" /> Payment Information
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

                {/* Right Column: Order Summary & Action (Now using Rands) */}
                <div className="order-summary-card-checkout">
                    <h3 className="summary-heading-checkout">
                        Summary
                    </h3>
                    
                    {/* Itemized Totals */}
                    <div className="summary-totals-section">
                        <div className="summary-line-checkout">
                            <span>Subtotal ({totalItems} items)</span>
                            <span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-line-checkout">
                            <span>Shipping</span>
                            <span>{CURRENCY_SYMBOL}{SHIPPING_COST.toFixed(2)}</span>
                        </div>
                        <div className="summary-line-checkout">
                            <span>Taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
                            <span>{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    {/* Grand Total */}
                    <div className="total-line-checkout">
                        <span className='order-total-label'>Order Total</span>
                        <span>{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
                    </div>

                    <button 
                        type="submit"
                        className="place-order-button"
                        disabled={isProcessing}
                        form="checkout-form" 
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" size={20} />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock size={20} />
                                <span to="/confirmation">Pay {CURRENCY_SYMBOL}{total.toFixed(2)} Securely</span>
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
