import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate(); // For navigation
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    bio: "",
    profilePic: "",
    password: "",
    role: "Project Manager",
    Subrole: "Developer",
  });

  // ✅ Redirect user if already logged in
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
  
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === userData.email);
    if (userExists) {
      alert("User with this email already exists!");
      return;
    }
  
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
  
    // ✅ Store user session
    sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
  
    alert("Registration successful!");
  
    // ✅ Redirect based on role
    if (userData.role === "Team Member") {
      navigate("/Dashboard/TeamMember_Dashboard");  // Redirect to Team Member Dashboard
    } else {
      navigate("/dashboard");  // Redirect to Default Dashboard
    }
  };
  

  // Handle profile picture upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData({ ...userData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 m-3">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px"  }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone number"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter company name"
              value={userData.company}
              onChange={(e) => setUserData({ ...userData, company: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter permanent address"
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              placeholder="Write something about yourself"
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleProfilePicUpload} />
            {userData.profilePic && (
              <img
                src={userData.profilePic}
                alt="Profile Preview"
                className="mt-2 rounded"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option value="Project Manager">Project Manager</option>
              <option value="Team Member">Team Member</option>
              {/* <option value="Client">Client</option> */}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Sub Role</label>
            <select
              className="form-select"
              value={userData.Subrole}
              onChange={(e) => setUserData({ ...userData, Subrole: e.target.value })}
            >
               <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="QA">QA</option>
                <option value="Tester">Tester</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100">Register</button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
