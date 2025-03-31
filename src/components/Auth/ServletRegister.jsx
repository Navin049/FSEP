import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../App.css";

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
    role: "Project Manager",
    Subrole: "Developer",
    availability: "Available",  // New field for availability
    skills: "",        // New field for skills
    experienceLevel: "Juinor" // New field for experience level
  });

  const [errors, setErrors] = useState({}); // To store validation errors

  const navigate = useNavigate();  // Initialize navigate function

 // Set a class or ID for the register page
 React.useEffect(() => {
  document.body.classList.add('register-page');
  return () => document.body.classList.remove('register-page');
}, []);


  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPhone = /^[0-9]{10}$/;  

    if (!userData.name) newErrors.name = "Full name is required";
    if (!userData.email) newErrors.email = "Email is required";
    else if (!regexEmail.test(userData.email)) newErrors.email = "Invalid email format";
    if (!userData.phone) newErrors.phone = "Phone number is required";
    else if (!regexPhone.test(userData.phone)) newErrors.phone = "Phone number must be 10 digits";
    if (!userData.company) newErrors.company = "Company name is required";
    if (!userData.address) newErrors.address = "Address is required";
    if (!userData.password) newErrors.password = "Password is required";
    else if (userData.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (!userData.skills) newErrors.skills = "Skills are required";
    if (!userData.availability) newErrors.availability = "Availability is required";
    if (!userData.experienceLevel) newErrors.experienceLevel = "Experience level is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if there are validation errors
    }

    try {
      const response = await fetch("http://localhost:8080/backend-servlet/RegisterServlet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      const result = await response.json();
      
      console.log("Response Data:", result);

      alert(result.message);

      if (result.redirect) {
        localStorage.setItem("loggedInUser", JSON.stringify({ email: userData.email, role: userData.role }));
        navigate(result.redirect);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Registration failed. Please try again.");
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
    <div className="container-layout">
    <div className="main-content">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter full name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Enter phone number"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className={`form-control ${errors.company ? "is-invalid" : ""}`}
                placeholder="Enter company name"
                value={userData.company}
                onChange={(e) => setUserData({ ...userData, company: e.target.value })}
              />
              {errors.company && <div className="invalid-feedback">{errors.company}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="Enter permanent address"
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
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

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Enter password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              >
                <option value="Project manager">Project Manager</option>
                <option value="Team Member">Team Member</option>
              </select>
            </div>
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

          {/* Availability Selection */}
          <div className="mb-3">
            <label className="form-label">Availability</label>
            <select
              className="form-select"
              value={userData.availability}
              onChange={(e) => setUserData({ ...userData, availability: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* Skills */}
          <div className="mb-3">
            <label className="form-label">Skills</label>
            <input
              type="text"
              className={`form-control ${errors.skills ? "is-invalid" : ""}`}
              placeholder="Enter skills (comma-separated)"
              value={userData.skills}
              onChange={(e) => setUserData({ ...userData, skills: e.target.value })}
            />
            {errors.skills && <div className="invalid-feedback">{errors.skills}</div>}
          </div>

          {/* Experience Level */}
          <div className="mb-3">
            <label className="form-label">Experience Level</label>
            <select
              className="form-select"
              value={userData.experienceLevel}
              onChange={(e) => setUserData({ ...userData, experienceLevel: e.target.value })}
            >
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
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
    </div>
  );
};

export default ServletRegister;
