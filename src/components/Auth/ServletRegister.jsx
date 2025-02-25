import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const ServletRegister = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    bio: "",
    profilePic: "",
    password: "",
    role: "Project manager",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Ensure all fields are filled
    // if (!userData.name || !userData.email || !userData.password || !userData.role) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }
  
    try {
      // Send data to the backend
      const response = await fetch("http://localhost:8080/backend-servlet/RegisterServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  

      if (!response.ok) {
        alert(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    alert(result.message);
} catch (error) {
    console.error("Error registering user:", error);
    alert(error);
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
    <div className="container d-flex justify-content-center align-items-center min-vh-100 m-3 ">
      <div className="card p-4 shadow-lg w-100 " style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          
          {/* Full Name */}
          <div className="mb-3 ">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              
            />
          </div>

          {/* Phone */}
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

          {/* Company */}
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

          {/* Address */}
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter address"
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
          </div>

          {/* Bio */}
          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              placeholder="Write something about yourself"
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            ></textarea>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleProfilePicUpload}
            />
            {userData.profilePic && (
              <img
                src={userData.profilePic}
                alt="Profile Preview"
                className="mt-2 rounded"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              
            />
          </div>

          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option value="Project manager">Project Manager</option>
              <option value="Team Member">Team Member</option>
              <option value="Client">Client</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>

          {/* Login Link */}
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ServletRegister;
