import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

// --- Color Palette (Re-defined for standalone use) ---
const COLORS = {
  ALMOND_BG: '#FFEBCD', // Blanched Almond Base
  CHARCOAL_TEXT: '#3C3636', // Deep, readable primary text
  DUSTY_ROSE_ACCENT: '#C7A3A6', // Soft, chic accent for buttons
  TAUPE_BORDER: '#A8A29E', // Muted border/secondary
};

// --- Mock Product Data ---
const MOCK_PRODUCTS = [
  { id: 1, name: "The Luxe Ribbed Dress", price: 129.99, rating: 4.8, category: "Dresses", imageUrl: "https://placehold.co/400x500/A8A29E/FFEBCD?text=Ribbed+Dress" },
  { id: 2, name: "Velvet Cropped Blazer", price: 95.00, rating: 4.5, category: "Outerwear", imageUrl: "https://placehold.co/400x500/C7A3A6/3C3636?text=Blazer" },
  { id: 3, name: "Silk Slip Skirt", price: 79.50, rating: 5.0, category: "Skirts", imageUrl: "https://placehold.co/400x500/E5D9C4/3C3636?text=Silk+Skirt" },
  { id: 4, name: "Statement Gold Hoops", price: 35.00, rating: 4.2, category: "Jewelry", imageUrl: "https://placehold.co/400x500/3C3636/FFEBCD?text=Gold+Hoops" },
  { id: 5, name: "Leather Corset Top", price: 89.99, rating: 4.7, category: "Tops", imageUrl: "https://placehold.co/400x500/C7A3A6/FFEBCD?text=Corset+Top" },
  { id: 6, name: "High-Waist Trousers", price: 65.00, rating: 4.6, category: "Bottoms", imageUrl: "https://placehold.co/400x500/A8A29E/3C3636?text=Trousers" },
];


/**
 * Product Card component for displaying a single item.
 * NOTE: This component is self-contained within the ProductListingViewComponent file.
 */
const ProductCard = ({ product, onAddToCart, onViewDetails }) => (
    <div 
        className="flex flex-col rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1"
        style={{ backgroundColor: 'white', border: `1px solid ${COLORS.TAUPE_BORDER}` }}
    >
        {/* Product Image */}
        <div className="relative overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-80 object-cover transition-opacity duration-500 hover:opacity-90"
                onError={(e) => e.target.src = `https://placehold.co/400x500/${COLORS.TAUPE_BORDER.replace('#', '')}/${COLORS.CHARCOAL_TEXT.replace('#', '')}?text=Product`}
            />
            {/* Rating Overlay */}
            <div className="absolute top-3 left-3 flex items-center p-1.5 rounded-full text-xs font-semibold" 
                 style={{ backgroundColor: COLORS.DUSTY_ROSE_ACCENT, color: COLORS.ALMOND_BG }}>
                <Star size={12} fill={COLORS.ALMOND_BG} className="mr-1" />
                {product.rating.toFixed(1)}
            </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-serif mb-1 truncate" style={{ color: COLORS.CHARCOAL_TEXT }}>
                {product.name}
            </h3>
            <p className="text-sm mb-3" style={{ color: COLORS.TAUPE_BORDER }}>
                {product.category}
            </p>
            <p className="text-2xl font-bold mb-4" style={{ color: COLORS.DUSTY_ROSE_ACCENT }}>
                ${product.price.toFixed(2)}
            </p>
            
            {/* Action Button */}
            <button
                onClick={() => onAddToCart(product)}
                className="mt-auto w-full py-2 rounded-lg font-bold uppercase text-sm tracking-wider transition duration-300 hover:opacity-85 flex items-center justify-center space-x-2 shadow-md"
                style={{ 
                    backgroundColor: COLORS.DUSTY_ROSE_ACCENT, 
                    color: COLORS.ALMOND_BG
                }}
            >
                <ShoppingBag size={18} />
                <span>Add to Bag</span>
            </button>
        </div>
    </div>
);


/**
 * Main Product Listing View component for Baddies Boutique.
 */
export default function ProductListingView() {
    
    // Placeholder handlers (these would be passed down as props in the final App.jsx)
    const handleAddToCart = (product) => {
        // NOTE: Using console.log instead of alert()
        console.log(`Added ${product.name} to cart.`);
        // Note: Using a custom alert replacement would be better, but for simulation:
        alert(`Successfully added "${product.name}" to your bag!`);
    };

    const handleViewDetails = (product) => {
        console.log(`Viewing details for ${product.name}.`);
        // In the final App.jsx, this would set the selected product state and switch the view.
        alert(`Details for "${product.name}" would load here.`);
    };

    return (
        <main 
            className="max-w-7xl mx-auto p-4 sm:p-8 min-h-screen"
            style={{ backgroundColor: COLORS.ALMOND_BG }}
        >
            <h2 
                className="text-center text-4xl sm:text-5xl font-serif mb-12 tracking-wide"
                style={{ color: COLORS.CHARCOAL_TEXT }}
            >
                New Arrivals & Editor Picks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_PRODUCTS.map(product => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>
        </main>
    );
}
