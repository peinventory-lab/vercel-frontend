import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user')); // assuming user object is stored after login

  if (!user) {
    return <Navigate to="/" />; // redirect to login
  }

 // if (role && user.role !== role) {
    //return <Navigate to="/unauthorized" />; // redirect if wrong role
  //}

  return children;
};

export default ProtectedRoute;