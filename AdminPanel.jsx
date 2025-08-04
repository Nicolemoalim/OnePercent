import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminProducts from './AdminProducts';

const AdminPanel = () => {
  const { user } = useAuth();

  // Redirect to home if user is not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-panel">
      <AdminProducts />
    </div>
  );
};

export default AdminPanel;
