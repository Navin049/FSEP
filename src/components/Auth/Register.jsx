import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Validation functions
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleValidation = () => {
    let newErrors = {};
    if (!userData.name.trim()) newErrors.name = "Full name is required.";
    if (!userData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(userData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!userData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(userData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!userData.password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(userData.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === userData.email);
    if (userExists) {
      alert("User with this email already exists!");
      return;
    }

    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    sessionStorage.setItem("loggedInUser", JSON.stringify(userData));

    alert("Registration successful!");

    navigate(userData.role === "Team Member" ? "/Dashboard/TeamMember_Dashboard" : "/dashboard");
  };

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
    <div className="w-100 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
              {errors.name && <p className="text-danger">{errors.name}</p>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-danger">{errors.phone}</p>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                value={userData.company}
                onChange={(e) => setUserData({ ...userData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
            {errors.password && <p className="text-danger">{errors.password}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleProfilePicUpload} />
            {userData.profilePic && <img src={userData.profilePic} alt="Preview" className="mt-2 rounded" style={{ width: "100px", height: "100px" }} />}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
                <option value="Project Manager">Project Manager</option>
                <option value="Team Member">Team Member</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Sub Role</label>
              <select className="form-select" value={userData.Subrole} onChange={(e) => setUserData({ ...userData, Subrole: e.target.value })}>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="QA">QA</option>
                <option value="Tester">Tester</option>
              </select>
            </div>
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
