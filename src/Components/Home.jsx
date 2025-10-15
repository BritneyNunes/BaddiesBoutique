import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Loader, AlertCircle } from 'lucide-react';

// --- Configuration ---
// UPDATED to HTTPS as requested
const API_BASE_URL = 'https://localhost:3000'; 

// --- 1. DressCard Component (Sub-component for displaying a single product) ---
const DressCard = ({ dress }) => {
  // Use a fallback for the image URL in case the server response is missing it
  const imageUrl = dress.imageUrl || `https://placehold.co/400x550/000000/FFFFFF?text=${dress.title.replace(/\s/g, '+')}`;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dress.price);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={dress.title}
          className="w-full h-96 object-cover object-center transition-opacity duration-500 group-hover:opacity-90"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/400x550/6B7280/FFFFFF?text=Image+Not+Found`;
          }}
        />
        <div className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full text-red-600 cursor-pointer hover:bg-white transition">
          <Heart size={20} fill="currentColor" />
        </div>
        
        {/* Quick Actions Overlay (Appears on hover) */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90">
            <button className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg shadow-md hover:bg-gray-700 transition">
                <ShoppingBag size={18} />
                <span>Add to Bag</span>
            </button>
        </div>
      </div>
      
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-gray-900 truncate">{dress.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{dress.category}</p>
        <p className="text-xl font-extrabold text-gray-800 mt-2">{formattedPrice}</p>
      </div>
    </div>
  );
};

// --- 2. Home Component (Main Component for the Page) ---
export default function App() {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches the product catalog from the Node.js API endpoint.
     * This endpoint is public and does not require authentication.
     */
    const fetchDresses = async () => {
      try {
        // Fetching from the new HTTPS endpoint
        const response = await fetch(`${API_BASE_URL}/dresses`);

        if (!response.ok) {
          // If the status is 4xx or 5xx, throw an error with the status
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDresses(data);
      } catch (err) {
        console.error("Failed to fetch dresses:", err);
        setError(err.message || "Could not connect to the API. Check your server status.");
      } finally {
        setLoading(false);
      }
    };

    fetchDresses();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Rendering Logic ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-2xl">
          <Loader className="w-12 h-12 text-pink-600 animate-spin" />
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading Baddies Boutique Catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-2xl border-2 border-red-500">
          <AlertCircle className="w-12 h-12 text-red-600" />
          <p className="mt-4 text-xl font-bold text-red-700">Connection Error</p>
          <p className="text-gray-600 mt-2 text-center">
            {error}. Please ensure your Node.js server is running on <code className="font-mono bg-gray-100 p-1 rounded">https://localhost:3000</code> and accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Baddies Boutique
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Explore the latest collection of irresistible fashion.
        </p>
      </header>
      
      {dresses.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {dresses.map((dress) => (
            // Using the MongoDB ObjectId (_id) as the key
            <DressCard key={dress._id} dress={dress} />
          ))}
        </div>
      ) : (
        <div className="text-center p-16 max-w-md mx-auto bg-white rounded-xl shadow-xl">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">No Products Found</h2>
            <p className="mt-2 text-gray-500">The API returned an empty list. Check your MongoDB "Dresses" collection.</p>
        </div>
      )}
    </div>
  );
}