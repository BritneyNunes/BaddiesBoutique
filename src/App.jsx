import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Cart from './Components/Cart'; 
import Checkout from './Components/Checkout';
import OrderConfirmation from './Components/OrderConfirmation';
import './App.css'; // <--- NEW: Import App CSS file

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      {/* Used className="app-container" instead of inline style */}
      <div className="app-container">
        <Navbar /> {/* Always visible */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;