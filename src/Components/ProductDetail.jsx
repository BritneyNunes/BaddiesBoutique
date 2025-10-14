const ProductDetail = () => {
    // Fallback if the product is somehow undefined
    if (!selectedProduct) return <Home />; 

    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
            onClick={() => navigate('home')} 
            className="text-slate-600 hover:text-amber-700 mb-6 flex items-center transition duration-200"
        >
            <HomeIcon size={18} className="mr-2" /> Back to Shop
        </button>

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section: height constrained for better mobile layout */}
          <div className="rounded-lg overflow-hidden shadow-xl h-80 md:h-auto max-h-[70vh]">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/cccccc/333333?text=Product+Image' }}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
                <p className="text-sm text-amber-700 font-semibold uppercase tracking-widest mb-2">{selectedProduct.category}</p>
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4">{selectedProduct.name}</h1>
                <p className="text-3xl font-bold text-slate-800 mb-6">${selectedProduct.price.toFixed(2)}</p>
                
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-2">Description</h2>
                <p className="text-slate-600 leading-relaxed border-l-4 border-amber-700 pl-4 py-1 mb-6">
                    {selectedProduct.description}
                </p>

                {/* Size Selector Placeholder */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                        <div className="flex space-x-2">
                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                <button key={size} className="w-10 h-10 border border-slate-300 text-slate-600 rounded-full hover:bg-slate-200 transition duration-150">
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(selectedProduct)}
              className="w-full mt-8 flex items-center justify-center bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-amber-700 transition duration-300 transform hover:scale-[1.01]"
            >
              <ShoppingBag size={20} className="mr-3" /> Add to Cart
            </button>
          </div>
        </div>
      </main>
    );
  };