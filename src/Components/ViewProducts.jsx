import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Filter, ChevronDown } from 'lucide-react';
import './styles/ViewProducts.css';

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
    { id: 1, name: "Silk Slip Dress", price: 159.99, imageUrl: "https://via.placeholder.com/400x400?text=Slip+Dress", category: "Dresses" },
    { id: 2, name: "Lace Trim Bodysuit", price: 89.00, imageUrl: "https://via.placeholder.com/400x400?text=Bodysuit", category: "Tops" },
    { id: 3, name: "Velvet Blazer", price: 210.50, imageUrl: "https://via.placeholder.com/400x400?text=Blazer", category: "Outerwear" },
    { id: 4, name: "Ribbed Knit Skirt", price: 75.00, imageUrl: "https://via.placeholder.com/400x400?text=Knit+Skirt", category: "Bottoms" },
    { id: 5, name: "High-Waist Trousers", price: 110.00, imageUrl: "https://via.placeholder.com/400x400?text=Trousers", category: "Bottoms" },
    { id: 6, name: "Cashmere Sweater", price: 299.00, imageUrl: "https://via.placeholder.com/400x400?text=Sweater", category: "Tops" },
    { id: 7, name: "Denim Jacket", price: 135.00, imageUrl: "https://via.placeholder.com/400x400?text=Denim+Jacket", category: "Outerwear" },
    { id: 8, name: "Leather Boots", price: 185.00, imageUrl: "https://via.placeholder.com/400x400?text=Boots", category: "Accessories" },
];

// Individual Product Card Component
const ProductCard = ({ product }) => (
    <div className="product-card">
        <div className="product-image-container">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
    </div>
);

function ViewProducts() {
    // State for filtering and sorting logic (for demonstration)
    const [sortOption, setSortOption] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <main className="products-page-container">
            
            {/* 1. Header/Navbar Section (Reuses Checkout style for site consistency) */}
            <header className="checkout-header">
                <div className="boutique-title">Baddies Boutique</div>
                <div className="flex items-center space-x-6 text-base text-gray-700">
                    {/* "Shop All" is visible in the header on your checkout pages */}
                    <span>Shop All</span> 
                    <Search className="header-icon" />
                    <Heart className="header-icon" />
                    <div className="relative">
                        <ShoppingCart className="header-icon" />
                        {/* Assuming 2 items in cart based on your previous images */}
                        <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-8px', height: '16px', width: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>2</span>
                    </div>
                </div>
            </header>

            {/* 2. Main Content Wrapper */}
            <div className="products-content-wrapper">
                
                <h2 className="products-page-title">Shop All</h2>

                {/* 3. Filter and Sort Bar */}
                <div className="filter-sort-bar">
                    <button 
                        className="filter-button" 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter className="header-icon" style={{ marginRight: '0.5rem', width: '18px', height: '18px' }}/> 
                        Filter
                    </button>
                    
                    {/* Mock Sort Dropdown */}
                    <div className="flex items-center">
                        <label htmlFor="sort-select" style={{ marginRight: '1rem' }}>Sort By:</label>
                        <select 
                            id="sort-select"
                            className="sort-dropdown"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="newest">Newest</option>
                        </select>
                    </div>
                </div>

                {/* 4. Product Grid */}
                <div className="product-grid">
                    {MOCK_PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

            </div>
        </main>
    );
}

export default ViewProducts;