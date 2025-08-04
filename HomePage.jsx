import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Header is now in the App.jsx */}
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <h1>ONE<br />PERCENT  <br />%</h1>
              <Link to="/products?gender=all" className="shop-now-btn">SHOP NOW</Link>
            </div>
          </div>
        </section>

        {/* Additional sections can be added here */}
      </div>
    </div>
  );
};

export default HomePage;
