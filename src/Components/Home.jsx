import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // ⭐ IMPORTED useAuth
import { Heart, ShoppingCart } from 'lucide-react';

// NOTE: Ensure your API URL is correct here or imported from a config file
const ADD_TO_CART_ENDPOINT = "http://localhost/3000";
const PRODUCTS_API_ENDPOINT = "http://localhost/3000";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // ⭐ Get the necessary functions/state from AuthContext
    const { getToken, isLoggedIn } = useAuth(); 

    /**
     * UPDATED: Function to fetch products. It now conditionally sends the Basic Auth token.
     */
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const authToken = getToken(); 
        
        // Prepare headers object
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // CRITICAL FIX: Only add the Authorization header if a token exists.
        if (authToken) {
            headers['Authorization'] = `Basic ${authToken}`;
        }

        try {
            const response = await fetch(`${PRODUCTS_API_ENDPOINT}/dresses`, {
                method: 'GET',
                headers: headers, 
            });

            if (!response.ok) {
                // We'll treat any failure as an error but stop if it's a hard error.
                throw new Error(`Failed to fetch products: ${response.statusText}. Status: ${response.status}.`);
            }
            
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Product Fetch Error:", err);
            // Set error state for display, and clear products array
            setError("Could not load products. Please ensure your backend is running.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /**
     * UPDATED: Handles adding a product to the cart with Basic Auth.
     * @param {string} productId - The ID of the product to add.
     */
    const handleAddToCart = async (productId) => {
        
        // 1. Get the Auth Token using the centralized function
        const authToken = getToken(); 

        if (!authToken) {
            // Handle the missing token error gracefully
            console.error("ADD TO CART FAILED: AuthToken is missing. Check your Login component.");
            alert("Please log in to add items to your cart.");
            navigate('/login'); // Redirect user to log in
            return;
        }

        try {
            const response = await fetch(`${ADD_TO_CART_ENDPOINT}/carts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 2. Use the retrieved token with the 'Basic' prefix
                    'Authorization': `Basic ${authToken}` 
                },
                body: JSON.stringify({ 
                    productId: productId, 
                    quantity: 1
                })
            });

            if (response.ok) {
                alert('Item added to cart successfully!');
            } else {
                const errorData = await response.json();
                console.error('Failed to add to cart:', errorData);
                alert(`Failed to add item: ${errorData.message || 'Server error'}`);
            }

        } catch (error) {
            console.error('Network or application error during Add to Cart:', error);
            alert("Could not connect to the server. Please try again.");
        }
    };

    if (loading) {
        // Class name 'loading-spinner' is still correct based on the NOTE/CSS comment
        return <div className="loading-spinner">Loading products...</div>;
    }

    // Display error message if the fetch failed
    if (error && products.length === 0) {
        // Class name 'error-message' is still correct based on the NOTE/CSS comment
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        // Corrected classname: home-page -> home
        <div className="home"> 
            {/* Corrected classname: page-title -> home-title */}
            <h1 className="home-title">Shop All</h1>
            
            {/* Corrected classname: product-grid -> dress-grid */}
            <div className="dress-grid"> 
                {products.map(product => (
                    // Corrected classname: product-card -> dress-card
                    <div key={product._id} className="dress-card"> 
                        {/* Corrected classname: product-image-container -> image-container */}
                        <div className="image-container"> 
                            {/* Class name 'product-image' is correct in both */}
                            <img src={product.imageUrl} alt={product.name} className="product-image" />
                            {/* The CSS uses overlay-top for this section, and 'heart-icon' for the inner div */}
                            <div className="overlay-top"> 
                                {/* Placeholder for rating, if needed, otherwise an empty div */}
                                <div></div> 
                                {/* Corrected class structure: simplified the heart container */}
                                <div className="heart-icon">
                                    <Heart size={20} fill="#FF69B4" color="#FF69B4" />
                                </div>
                            </div>
                        </div>
                        {/* Corrected classname: product-details -> info-container */}
                        <div className="info-container"> 
                            {/* Corrected classname: product-name -> product-name-bottom */}
                            <h2 className="product-name-bottom">{product.name}</h2>
                            {/* Class name 'product-category' is correct in both */}
                            <p className="product-category">{product.category}</p>
                            
                            {/* Corrected classname: product-price-size -> price-and-sizes-row */}
                            <div className="price-and-sizes-row"> 
                                {/* Class name 'product-price' is correct in both */}
                                <span className="product-price">R{product.price}</span>
                                
                                {/* Corrected classname: product-sizes -> size-selector-chips */}
                                <div className="size-selector-chips"> 
                                    {/* Corrected classname: size-pill -> size-chip */}
                                    <span className="size-chip">XS</span>
                                    <span className="size-chip">S</span>
                                    <span className="size-chip">M</span>
                                    <span className="size-chip">L</span>
                                </div>
                            </div>
                            
                            {/* Corrected classname: add-to-cart-button -> add-to-bag-button */}
                            <button 
                                className="add-to-bag-button"
                                onClick={() => handleAddToCart(product._id)} 
                                disabled={!isLoggedIn} // Disable if not logged in
                            >
                                <ShoppingCart size={20} />
                                ADD TO BAG
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;