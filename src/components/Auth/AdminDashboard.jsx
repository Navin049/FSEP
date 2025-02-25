import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/AdminLogin'); // Redirect to login if not authenticated
    }
  }, [navigate]);


  return (
    <div className="container mt-5">
      <h2>Welcome, Admin 👋</h2>
     
    </div>
  );
};

export default AdminDashboard;
