import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')); // assuming user object is stored after login

  if (!user) {
    return <Navigate to="/" />; // redirect to login if not logged in
  }

  return children; // allow all roles to access
};

export default ProtectedRoute;