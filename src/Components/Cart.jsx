import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Loader2 } from 'lucide-react';
import "./Cart.css"

const API_BASE_URL = 'https://baddiesboutiquebackend.onrender.com';
const CART_ENDPOINT = '/carts';
// Note: Changed from R150.00 to R0.00 to match the CSS placeholder for simplicity, 
// but kept R in calculation. You should use the actual value here.
const DEFAULT_SHIPPING_COST = 150.00; 
const COLORS = { DUSTY_ROSE_ACCENT: '#C48E96', TAUPE_BORDER: '#D9C4C0', ERROR: '#e53e3e' };

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RETRIES = 3;

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setCartItems(data);

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

    const handleRemoveItem = async (itemId) => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            await fetch(`${API_BASE_URL}${CART_ENDPOINT}/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${token}` }
            });
            setCartItems(prev => prev.filter(item => item._id !== itemId));
        } catch (err) { console.error("Remove item error:", err); }
    };

    const { subtotal, totalItems } = useMemo(() => {
        const subtotalCalc = cartItems.reduce((acc, item) => {
            // Ensure item.product.price and item.quantity exist and are numbers (thanks to server fix)
            const price = item.product?.price || 0; 
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
        }, 0);
        
        const totalItemsCalc = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
        
        return { subtotal: subtotalCalc, totalItems: totalItemsCalc };
    }, [cartItems]);

    const estimatedTotal = subtotal + DEFAULT_SHIPPING_COST;

    // ----------------------------------------------------
    // --- Loading, Error, Empty States (FIXED CLASS NAMES)
    // ----------------------------------------------------
    
    // NOTE: For consistency with your CSS, the loading and error screens
    // now use the .empty-cart-container styles.
    
    if (loading) return (
        <div className="empty-cart-container">
            <Loader2 size={48} className="animate-spin" style={{ color: COLORS.DUSTY_ROSE_ACCENT }} />
            <h2 className="empty-cart-title">Loading Your Bag...</h2>
        </div>
    );
    
    if (error) return (
        <div className="empty-cart-container">
            <X size={48} style={{ color: COLORS.ERROR }} />
            <h2 className="empty-cart-title">Error Loading Cart</h2>
            <p>{error}</p>
        </div>
    );
    
    if (cartItems.length === 0) return (
        <div className="empty-cart-container">
            <ShoppingBag size={64} style={{ color: COLORS.DUSTY_ROSE_ACCENT }} />
            <h2 className="empty-cart-title">Your Bag is Empty</h2>
            <Link to="/"><button className="continue-shopping-button">Continue Shopping</button></Link>
        </div>
    );

    // ----------------------------------------------------
    // --- Main Cart Display 
    // ----------------------------------------------------
    return (
        <main className="cart-page-container">
            <h2 className="cart-title">Your Shopping Bag</h2>
            <div className="cart-content-wrapper">
                <div className="cart-items-list">
                    {cartItems.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="item-image-container">
                                <img 
                                    // Use the nested product data from the server fix
                                    src={item.product?.imageUrl} 
                                    alt={item.product?.productName || "Cart Item"} 
                                    className="item-image" 
                                    onError={(e) => { e.target.src=`https://placehold.co/80x110/${COLORS.TAUPE_BORDER.replace('#','')}/FFFFFF?text=Item`; }} 
                                />
                            </div>
                            <div className="item-details">
                                <h3 className="item-name">{item.product?.productName || "Cart Item" }</h3>
                                <p className="item-qty">Size: {item.size}</p>
                                <p className="item-qty">Qty: {item.quantity}</p>
                            </div>
                            <div className="item-actions">
                                <span className="item-price">R{((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                                <button className="item-remove-button" onClick={() => handleRemoveItem(item._id)}><X size={18}/> Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-summary-card">
                    <h3 className="summary-title">Order Summary</h3>
                    <div className="summary-line"><span>Subtotal ({totalItems} items)</span><span>R{subtotal.toFixed(2)}</span></div>
                    <div className="summary-line"><span>Shipping (Standard)</span><span>R{DEFAULT_SHIPPING_COST.toFixed(2)}</span></div>
                    <div className="summary-line total-line"><span>Estimated Total</span><span>R{estimatedTotal.toFixed(2)}</span></div>
                    <Link to="/checkout"><button className="checkout-button">PROCEED TO CHECKOUT</button></Link>
                </div>
            </div>
        </main>
    );
}

export default Cart;