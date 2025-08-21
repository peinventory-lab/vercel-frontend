import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role, roles }) => {
  const user = JSON.parse(localStorage.getItem('user')); // assuming user object is stored after login

  if (!user) {
    return <Navigate to="/" />; // redirect to login
  }

  // If a single role is required
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  // If multiple roles are allowed
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;