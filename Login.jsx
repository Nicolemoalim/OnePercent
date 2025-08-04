import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // כאן את יכולה להוסיף קריאה ל־API
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="brand-name">ONEPERCENT</h1>
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit">Sign In</button>
        </form>

        <div className="register-link">
          Don't have an account? <Link to="/register"><strong>Create account</strong></Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
