import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Project Manager"); // Default role
  const [errors, setErrors] = useState({}); // To store validation errors
  const navigate = useNavigate(); // Redirect after login

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Email is required";
    else if (!regexEmail.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return; // Don't submit if there are validation errors
    }
  
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/LoginServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password,
          role,
        }),
        credentials: "include", 
      });
  
      const data = await response.json();
      
      console.log('Response data:', data); // Log the data object to check its contents
  
      if (response.ok) {
        // If HTTP request was successful, check if message indicates success
        if (data.message === 'Login successful!') {
          alert("✅ Login successful!");
          localStorage.setItem("loggedInUser", JSON.stringify({ email, role }));
  
          // Check if `data.redirect` exists and if it's a valid URL or path
          if (data.redirect) {
            console.log('Redirecting to:', data.redirect); // Log the redirect URL
            navigate(data.redirect); // Perform navigation
          } else {
            alert('❌ Redirect path is missing in response.');
          }
        } else {
          // If message is not 'Login successful!', display the message
          alert(`❌ ${data.message || "Login failed!"}`);
        }
      } else {
        // If HTTP request fails, show a generic error
        alert("❌ Login failed due to server error.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("❌ An error occurred while logging in.");
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
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Project Manager">Project Manager</option>
              <option value="Team Member">Team Member</option>
            </select>
          </div>

          <div className="text-center">
            <Link to="/">
              <button className="btn btn-outline-dark mb-3">Home</button>
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/ServletRegister">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
