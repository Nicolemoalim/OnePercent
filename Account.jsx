import React from 'react';
import { useAuth } from '../context/AuthContext';


const Account = () => {
  const { user } = useAuth();

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>My Account</h1>
        <p>Welcome back, {user?.username || 'Guest'}</p>
      </div>
      
      <div className="account-details">
        <div className="account-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="account-section">
          <h2>Order History</h2>
          <p>You haven't placed any orders yet.</p>
          <a href="/orders" className="btn btn-primary">View All Orders</a>
        </div>

        <div className="account-section">
          <h2>Account Settings</h2>
          <div className="settings-actions">
            <button className="btn btn-outline">Change Password</button>
            <button className="btn btn-outline">Update Email</button>
            <button className="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
