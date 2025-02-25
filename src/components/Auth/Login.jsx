import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Project Manager"); // Default role
  const navigate = useNavigate(); // Redirect after login

  const handleLogin = (e) => {
    e.preventDefault();
  
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Find user with matching email, password, and role
    const user = users.find(
      (user) => user.email === email && user.password === password && user.role === role
    );
  
    if (user) {
      alert("✅ Login successful!");
      localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store logged-in user
  
      // ✅ Redirect based on role
      if (user.role === "Team Member") {
        navigate("/Dashboard/TeamMember_Dashboard");  // Redirect to Team Member Dashboard
      } else {
        navigate("/dashboard");  // Redirect to Default Dashboard
      }
    } else {
      alert("❌ Invalid email, password, or role. Try again.");
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
  
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
          <Link to="/"><button className="btn btn-outline-dark mb-3">Home</button></Link>
        </div>
  
        <button type="submit" className="btn btn-primary w-100">Login</button>
  
        <p className="text-center mt-3">
          Don't have an account? <Link to="/Register">Register</Link>
        </p>
      </form>
    </div>
  </div>
    );
};

export default Login;
