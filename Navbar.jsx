import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';

// Debug function to log user info
const logUserInfo = (user) => {
  console.log('=== CURRENT USER ===');
  console.log('User object:', user);
  console.log('User role:', user?.role);
  console.log('Is authenticated:', !!user);
  console.log('LocalStorage user:', JSON.parse(localStorage.getItem('user')));
  console.log('===================');
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  // Log user info when it changes
  useEffect(() => {
    logUserInfo(user);
  }, [user]);
  
  console.log('Logged in user:', user);
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Fetch cart count when component mounts or when authentication state changes
  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await axios.get('http://localhost:3001/api/cart', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const count = response.data.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
          }
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [isAuthenticated, location.pathname]);

  // Set active category based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/women')) setActiveCategory('women');
    else if (path.includes('/men')) setActiveCategory('men');
    else setActiveCategory('');
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      // No need to reload the page, the UI will update automatically
      // because the isAuthenticated state will change
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search?.value;
    if (searchTerm) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* Top Navigation - Login/Register */}
      <div className="top-nav">
        <div className="container">
          <div className="top-nav-content">
            {isAuthenticated ? (
              <div className="user-welcome">
                <div className="account-dropdown">
                  <button className="account-button">
                    <i className="fas fa-user-circle"></i>
                    <span>My Account</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <span>Welcome, {user?.firstName || 'User'}!</span>
                      <Link to="/account" className="view-account">View Account</Link>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/account/orders" className="dropdown-item">
                      <i className="fas fa-box"></i> My Orders
                    </Link>
                    <Link to="/account/wishlist" className="dropdown-item">
                      <i className="fas fa-heart"></i> Wishlist
                    </Link>
                    <Link to="/account/settings" className="dropdown-item">
                      <i className="fas fa-cog"></i> Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-links">
                <button 
                  onClick={handleLoginClick} 
                  className="auth-button login-button"
                >
                  Login
                </button>
                <button 
                  onClick={handleRegisterClick} 
                  className="auth-button register-button"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <span className="brand-name">OnePercent</span>
            </Link>
          </div>

          <div className="navbar-links">
            <Link 
              to="/women" 
              className={`nav-link ${activeCategory === 'women' ? 'active' : ''}`}
              onClick={() => setActiveCategory('women')}
            >
              WOMEN
            </Link>
            <Link 
              to="/men" 
              className={`nav-link ${activeCategory === 'men' ? 'active' : ''}`}
              onClick={() => setActiveCategory('men')}
            >
              MEN
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin-panel" 
                className="nav-link"
              >
                Admin Panel
              </Link>
            )}

          </div>

          <div className="user-actions">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                name="search"
                placeholder="Search..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </form>
            
            <div className="add-to-cart-container">
              <button 
                className="add-to-cart-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products');
                }}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add to Cart</span>
              </button>
            </div>
            
            {isAuthenticated && (
              <Link to="/wishlist" className="nav-icon">
                <i className="fas fa-heart"></i>
              </Link>
            )}
            <Link to="/cart" className="nav-icon cart-icon" aria-label="Shopping Cart">
              <i className="fas fa-shopping-bag"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            {/* User actions like wishlist and cart icons go here */}
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <LoginModal 
              onClose={closeModals} 
              onSwitchToRegister={switchToRegister}
            />
          </div>
        </div>
      )}
      
      {showRegisterModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <RegisterModal 
              onClose={closeModals}
              onSwitchToLogin={switchToLogin}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
