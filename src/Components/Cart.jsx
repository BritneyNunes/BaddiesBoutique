import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';
const CART_ENDPOINT = '/carts';
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

        const token = localStorage.getItem('authToken');
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
        const token = localStorage.getItem('authToken');
        try {
            await fetch(`${API_BASE_URL}${CART_ENDPOINT}/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${token}` }
            });
            setCartItems(prev => prev.filter(item => item._id !== itemId));
        } catch (err) { console.error("Remove item error:", err); }
    };

    const { subtotal, totalItems } = useMemo(() => {
        const subtotalCalc = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalItemsCalc = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        return { subtotal: subtotalCalc, totalItems: totalItemsCalc };
    }, [cartItems]);

    const estimatedTotal = subtotal + DEFAULT_SHIPPING_COST;

    if (loading) return <div className="cart-feedback-container"><Loader2 size={48} className="animate-spin text-gray-700" /><h2>Loading Your Bag...</h2></div>;
    if (error) return <div className="cart-feedback-container"><X size={48} style={{ color: COLORS.ERROR }} /><h2>Error Loading Cart</h2><p>{error}</p></div>;
    if (cartItems.length === 0) return <div className="empty-cart-container"><ShoppingBag size={64} style={{ color: COLORS.DUSTY_ROSE_ACCENT }} /><h2>Your Bag is Empty</h2><Link to="/"><button>Continue Shopping</button></Link></div>;

    return (
        <main className="cart-page-container">
            <h2>Your Shopping Bag</h2>
            <div className="cart-content-wrapper">
                <div className="cart-items-list">
                    {cartItems.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="item-image-container">
                                <img src={item.imageUrl} alt={item.name} onError={(e) => { e.target.src=`https://placehold.co/80x80/${COLORS.TAUPE_BORDER.replace('#','')}/FFFFFF?text=Item`; }} />
                            </div>
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p>Qty: {item.quantity}</p>
                            </div>
                            <div className="item-actions">
                                <span>R{(item.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => handleRemoveItem(item._id)}><X size={18}/> Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-summary-card">
                    <h3>Order Summary</h3>
                    <div><span>Subtotal ({totalItems} items)</span><span>R{subtotal.toFixed(2)}</span></div>
                    <div><span>Shipping (Standard)</span><span>R{DEFAULT_SHIPPING_COST.toFixed(2)}</span></div>
                    <div><span>Estimated Total</span><span>R{estimatedTotal.toFixed(2)}</span></div>
                    <Link to="/checkout"><button>PROCEED TO CHECKOUT</button></Link>
                </div>
            </div>
        </main>
    );
}

export default Cart;
