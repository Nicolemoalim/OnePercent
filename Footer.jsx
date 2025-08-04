import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-newsletter">
            <h3>Join Our Newsletter</h3>
            <p>Subscribe for updates on new arrivals and special offers</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
                required 
              />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/men">Men</Link></li>
                <li><Link to="/women">Women</Link></li>
                
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Help</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                <li><Link to="/shipping">Shipping</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>About</h4>
              <ul>
                <li><Link to="/about">Our Story</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/accessibility">Accessibility</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="social-icon" />
            </a>
          </div>
          
          <div className="payment-methods">
            <span className="payment-icon">💳</span>
            <span className="payment-icon">💵</span>
            <span className="payment-icon">💲</span>
            <span className="payment-icon">💱</span>
          </div>
          
          <div className="copyright">
            &copy; {currentYear} OnePercent. All rights reserved.
          </div>
          
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
