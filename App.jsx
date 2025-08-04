import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Components
import HomePage from './pages/HomePage';
import AdminProducts from './pages/AdminProducts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
// Authentication is now handled via modals
import ContactUs from './components/pages/ContactUs';
import Account from './pages/Account';
import Orders from './pages/Orders';
import AdminPanel from './pages/AdminPanel';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to home page instead of login page since we're using modals
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

// Public Route Component (for auth pages when already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin-panel" element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              } />
              <Route path="/women" element={<Products gender="women" />} />
              <Route path="/men" element={<Products gender="men" />} />
              <Route path="/new-arrivals" element={<Products sortBy="newest" />} />
              <Route path="/bestsellers" element={<Products sortBy="bestsellers" />} />
              <Route path="/collections" element={<Products />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Protected Routes */}
              
              <Route path="/checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              
              <Route path="/admin/products" element={
                <PrivateRoute>
                  <AdminProducts />
                </PrivateRoute>
              } />
              <Route path="/order-confirmation" element={
                <PrivateRoute>
                  <OrderConfirmation />
                </PrivateRoute>
              } />
              
              <Route path="/account" element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              } />
              <Route path="/wishlist" element={
                <PrivateRoute>
                  <Products wishlist={true} />
                </PrivateRoute>
              } />
              <Route path="/orders" element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              } />
              <Route path="/contact" element={<ContactUs />} />
              
              <Route path="/orders" element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              } />
              
              {/* Public Routes */}
              <Route path="/contact" element={<ContactUs />} />
              
              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;