import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';
import { FaShoppingBag } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLoginClick = () => setShowLoginModal(true);
  const handleRegisterClick = () => setShowRegisterModal(true);
  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };
  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="brand">
              <Link to="/">ONEPERCENT</Link>
            </div>

            <nav className="main-nav">
              <ul className="nav-links">
                <li><Link to="/women">WOMEN</Link></li>
                <li><Link to="/men">MEN</Link></li>
                <li><Link to="/about">ABOUT</Link></li>
                <li><Link to="/contact">CONTACT</Link></li>
              </ul>
            </nav>

            <div className="user-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="auth-link">My Account</Link>
                  <button onClick={logout} className="auth-link">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={handleLoginClick} className="auth-link">Login</button>
                  <button onClick={handleRegisterClick} className="auth-link">Register</button>
                </>
              )}
              <Link to="/cart" className="cart-icon">
                <FaShoppingBag />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseModals}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Register Modal */}
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Header;
