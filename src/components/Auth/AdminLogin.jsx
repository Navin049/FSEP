import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminLogin = () => {
  const [adminData, setAdminData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded admin credentials (for demo purposes)
  const validAdmin = {
    email: 'admin@gmail.com',
    password: 'admin123',
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();

    if (
      adminData.email === validAdmin.email &&
      adminData.password === validAdmin.password
    ) {
      // Successful login
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin-dashboard'); // Redirect to Admin Dashboard
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-12">
          <div className="card shadow-lg">
            <div className="card-header text-center bg-primary text-white">
              <h3>Admin Login</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={adminData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={adminData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-muted text-center">
              {/* <small>Default Admin: admin@example.com | Password: admin123</small> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
