import React from "react";
import "./Home.css";

function Home() {
  const products = [
    {
      id: 1,
      title: "Ribbed Dress",
      description: "The Luxe Ribbed Dress",
      category: "Dresses",
      price: "R129.99",
      rating: 4.8,
      color: "#bbaaa4",
    },
    {
      id: 2,
      title: "Blazer",
      description: "Velvet Cropped Blazer",
      category: "Outerwear",
      price: "R95.00",
      rating: 4.5,
      color: "#c9a2a2",
    },
    {
      id: 3,
      title: "Silk Skirt",
      description: "Silk Slip Skirt",
      category: "Skirts",
      price: "R89.50",
      rating: 5.0,
      color: "#d6c7ad",
    },
    {
      id: 4,
      title: "Silk Skirt",
      description: "Silk Slip Skirt",
      category: "Skirts",
      price: "R89.50",
      rating: 5.0,
      color: "#d6c7ad",
    },
    {
      id: 5,
      title: "Silk Skirt",
      description: "Silk Slip Skirt",
      category: "Skirts",
      price: "R89.50",
      rating: 5.0,
      color: "#d6c7ad",
    },
    {
      id: 6,
      title: "Silk Skirt",
      description: "Silk Slip Skirt",
      category: "Skirts",
      price: "R89.50",
      rating: 5.0,
      color: "#d6c7ad",
    },
    {
      id: 7,
      title: "Silk Skirt",
      description: "Silk Slip Skirt",
      category: "Skirts",
      price: "R89.50",
      rating: 5.0,
      color: "#d6c7ad",
    },
    {
      id: 8,
      title: "Silk Skirt",
      description: "Silk Slip Skirt",
      category: "Skirts",
      price: "R89.50",
      rating: 5.0,
      color: "#d6c7ad",
    },
    {
      id: 9,
      title: "Silk Skirt",
      description: "Silk Slip Skirt",
      category: "Skirts",
      price: "R89.50",
      rating: 5.0,
      color: "#d6c7ad",
    },
  ];

  return (
    <div className="home">

      <h2 className="section-title">New Arrivals & Editor Picks</h2>

      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <div
              className="product-image"
              style={{ backgroundColor: item.color }}
            >
              <span className="rating">⭐ {item.rating}</span>
              <h3>{item.title}</h3>
            </div>
            <div className="product-info">
              <p className="desc">{item.description}</p>
              <p className="category">{item.category}</p>
              <p className="price">{item.price}</p>
              <button className="add-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
