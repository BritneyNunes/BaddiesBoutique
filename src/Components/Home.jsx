import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Heart, ShoppingCart } from 'lucide-react';
import "./Home.css";

const ADD_TO_CART_ENDPOINT = "http://localhost:3000";
const PRODUCTS_API_ENDPOINT = "http://localhost:3000";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSizes, setSelectedSizes] = useState({}); // productId -> selected size
    const navigate = useNavigate();

    const { getToken, isLoggedIn } = useAuth();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const authToken = getToken(); 
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Basic ${authToken}`;

        try {
            const response = await fetch(`${PRODUCTS_API_ENDPOINT}/dresses`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}. Status: ${response.status}.`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Product Fetch Error:", err);
            setError("Could not load products. Please ensure your backend is running.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddToCart = async (productId) => {
        const authToken = getToken();

        if (!authToken) {
            alert("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }

        const selectedSize = selectedSizes[productId];
        if (!selectedSize) {
            alert("Please select a size before adding to your cart!");
            return;
        }

        try {
            const response = await fetch(`${ADD_TO_CART_ENDPOINT}/carts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${authToken}`
                },
                body: JSON.stringify({ 
                    productId,
                    size: selectedSize, 
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

    if (loading) return <div className="loading-spinner">Loading products...</div>;
    if (error && products.length === 0) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="home">
            <h1 className="home-title">Shop All</h1>
            <div className="dress-grid">
                {products.map(product => (
                    <div key={product._id} className="dress-card">
                        <div className="image-container">
                            <img src={product.imageUrl} alt={product.name} className="product-image" />
                            <div className="overlay-top">
                                <div></div>
                                <div className="heart-icon">
                                    <Heart size={20} fill="#FF69B4" color="#FF69B4" />
                                </div>
                            </div>
                        </div>
                        <div className="info-container">
                            <h2 className="product-name-bottom">{product.productName}</h2>
                            <p className="product-category">{product.category}</p>
                            <div className="price-and-sizes-row">
                                <span className="product-price">R{product.price}</span>
                                <div className="size-selector-chips">
                                    {["XS", "S", "M", "L"].map(size => (
                                        <span
                                            key={size}
                                            className={`size-chip ${selectedSizes[product._id] === size ? "selected" : ""}`}
                                            onClick={() => setSelectedSizes(prev => ({ ...prev, [product._id]: size }))}
                                        >
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                className="add-to-bag-button"
                                onClick={() => handleAddToCart(product._id)}
                                disabled={!selectedSizes[product._id]}
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
