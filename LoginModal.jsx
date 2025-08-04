import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const trimmedEmail = formData.email.trim();
      const trimmedPassword = formData.password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        throw new Error('Please fill in all required fields');
      }

      console.log("🧪 Trying to log in with:", { email: trimmedEmail, password: trimmedPassword });

      const result = await login(trimmedEmail, trimmedPassword);

      if (!result || !result.success) {
        throw new Error(result.message || 'Login failed. Please try again.');
      }

      // Close modal and reload page
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>

        <div className="auth-form-container">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="form-control"
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={onSwitchToRegister}
                className="auth-link-button"
              >
                Register now
              </button>
            </p>
            <p>
              <button 
                type="button" 
                className="auth-link-button"
                onClick={onClose}
              >
                Close
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
