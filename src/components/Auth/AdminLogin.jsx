import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminLogin = () => {
  const [adminData, setAdminData] = useState({ email: '', password: '', role: 'Admin' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/backend-servlet/AdminLoginServlet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Send data as JSON
      },
      body: JSON.stringify(adminData),  // Send the admin data (email, password, role) as JSON
    });

    const result = await response.json();

    if (response.ok) {
      // If login is successful, save user info in localStorage
      alert("✅ Login successful!");
      localStorage.setItem("loggedInUser", JSON.stringify({ email: adminData.email, role: adminData.role }));

      // Redirect to the admin dashboard based on role
      if (adminData.role === 'Admin') {
        navigate('/admin-dashboard'); // For Admin, go to /admin-dashboard
      } else {
        navigate('/home'); // Default page (e.g., user dashboard, home, etc.)
      }
    } else {
      // If login fails, show the error message
      alert(`❌ ${result.message || "Login failed!"}`);
    }
  };

  return (
    <div
    className="w-100 d-flex justify-content-center align-items-center"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      minHeight: "100vh",
    }}
  >
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-12">
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
            {/* <div className="card-footer text-muted text-center"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
