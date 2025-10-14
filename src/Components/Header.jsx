const Header = () => (
    <header className="sticky top-0 z-10 w-full shadow-md bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
        <button
          onClick={() => navigate('home')}
          className="text-2xl font-bold tracking-widest text-slate-800 transition duration-300 hover:text-amber-700"
        >
          Baddies Boutique
        </button>

        <nav className="flex items-center space-x-6">
          <button
            onClick={() => navigate('home')}
            className="hidden sm:inline-block text-slate-800 hover:text-amber-700 transition duration-300 font-medium"
          >
            Shop All
          </button>
          <button
            onClick={() => navigate('home')}
            className="hidden sm:inline-block text-slate-800 hover:text-amber-700 transition duration-300 font-medium"
          >
            New Arrivals
          </button>
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full text-slate-800 hover:text-amber-700 transition duration-300"
            aria-label="View Cart"
          >
            <ShoppingBag size={24} />
            {/* Display cart item count */}
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-amber-700 text-white text-xs font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );

export default Header
