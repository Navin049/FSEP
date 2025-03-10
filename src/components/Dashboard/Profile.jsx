import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in user details from the backend
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/ViewProfileServlet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",  // Include credentials (cookies) in the request
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setEditUser(data);
        } else {
          console.error("Failed to fetch user data", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again.");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditUser({ ...editUser, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/UpdateProfileServlet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editUser),
          credentials:"include",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setShowModal(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error while saving your changes. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 d-flex justify-content-center align-items-center" style={{
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", minHeight: "100vh",
    }}>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card shadow-lg text-center">
            <div className="card-body">
              <img
                src={user.profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <h2 className="card-title mb-4">{user.name}</h2>
              <p className="card-text"><strong>Email:</strong> {user.email}</p>
              <p className="card-text"><strong>Role:</strong> {user.role}</p>
              <p className="card-text"><strong>Sub Role:</strong> {user.Subrole}</p>
              <p className="card-text"><strong>Phone:</strong> {user.phone}</p>
              <p className="card-text"><strong>Company:</strong> {user.company}</p>
              <p className="card-text"><strong>Address:</strong> {user.address}</p>
              <p className="card-text"><strong>Bio:</strong> {user.bio}</p>
              <p className="card-text"><strong>Availability:</strong> {user.availability}</p>
              <p className="card-text"><strong>Skills:</strong> {user.skills}</p>
              <p className="card-text"><strong>Experience Level:</strong> {user.experienceLevel}</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>Edit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  {/* Profile Picture Upload */}
                  <div className="mb-3 text-center">
                    <label className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                    />
                    <img
                      src={editUser.profilePic || "https://via.placeholder.com/150"}
                      alt="Preview"
                      className="rounded-circle mt-2"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </div>

                  {/* Editable Fields */}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={editUser.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={editUser.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={editUser.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      name="company"
                      className="form-control"
                      value={editUser.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={editUser.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      className="form-control"
                      value={editUser.bio}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* New Fields */}
                  <div className="mb-3">
                    <label className="form-label">Availability</label>
                    <input
                      type="text"
                      name="availability"
                      className="form-control"
                      value={editUser.availability}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Skills</label>
                    <textarea
                      name="skills"
                      className="form-control"
                      value={editUser.skills}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Experience Level</label>
                    <select
                      name="experienceLevel"
                      className="form-select"
                      value={editUser.experienceLevel}
                      onChange={handleChange}
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>

                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
