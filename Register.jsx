import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Register.css';

// Form validation function
const validateForm = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.username) errors.push('Username is required');
  if (!data.email) errors.push('Email is required');
  if (!data.password) errors.push('Password is required');
  if (!data.confirmPassword) errors.push('Please confirm your password');
  if (!data.firstName) errors.push('First name is required');
  if (!data.lastName) errors.push('Last name is required');
  
  // Email format
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  // Password strength
  if (data.password) {
    if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push('Password must contain at least one number');
    }
  }
  
  // Password match
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check for success message in URL (e.g., after email verification)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    console.log('Form submission started with data:', formData);

    // Client-side validation
    const validation = validateForm(formData);
    if (!validation.isValid) {
      console.error('Form validation failed:', validation.errors);
      setError(validation.errors[0]);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        // Optional fields
        phone: formData.phone?.trim() || '',
        address: formData.address || ''
      };
      
      console.log('Sending registration request to /api/auth/register with:', userData);
      
      // Register the user using the API utility
      const response = await api.post('/auth/register', userData, {
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Registration response:', response.data);

      if (response.data && response.data.success && response.data.accessToken) {
        // Store the token
        localStorage.setItem('token', response.data.accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        // Update auth context
        const { accessToken, ...userData } = response.data;
        login(userData);
        
        // Show success message
        const successMsg = 'Registration successful! Redirecting to your dashboard...';
        setSuccessMessage(successMsg);
        console.log(successMsg);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/', { 
            state: { 
              message: 'Welcome to OnePercent!',
              user: userData
            },
            replace: true 
          });
        }, 1500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
      
      // Handle different types of errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.status === 400) {
          errorMessage = err.response.data?.message || 'Invalid registration data. Please check your input.';
        } else if (err.response.status === 409) {
          errorMessage = 'A user with this email or username already exists. Please log in or use different credentials.';
        } else if (err.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Could not connect to the server. Please check your internet connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-container">
          <h1>CREATE AN ACCOUNT</h1>
          <p className="register-subtitle">
            Join OnePercent today and enjoy a personalized shopping experience.
          </p>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 6 characters)"
                required
                minLength="6"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="form-input"
              />
            </div>

            <div className="form-options">
              <label className="terms-checkbox">
                <input type="checkbox" name="terms" required />
                <span>I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link></span>
              </label>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            <p className="login-redirect">
              Already have an account? <Link to="/login" className="login-link">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;