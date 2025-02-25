import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in user details from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
      setEditUser(loggedInUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handle input changes in edit form
  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
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

  // Save updated details and update localStorage
  const handleSave = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? editUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedInUser", JSON.stringify(editUser));
    setUser(editUser);
    setShowModal(false);
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card shadow-lg text-center">
            <div className="card-body">
              {/* Profile Picture */}
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
                    <input type="file" className="form-control" accept="image/*" onChange={handleProfilePicUpload} />
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
                    <input type="text" name="name" className="form-control" value={editUser.name} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={editUser.email} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" name="phone" className="form-control" value={editUser.phone} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input type="text" name="company" className="form-control" value={editUser.company} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" name="address" className="form-control" value={editUser.address} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea name="bio" className="form-control" value={editUser.bio} onChange={handleChange}></textarea>
                  </div>

                  {/* Role Field */}
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select name="role" className="form-select" value={editUser.role} onChange={handleChange}>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Team Member">Team Member</option>
                    </select>
                  </div>

                  {/* Sub Role Field */}
                  <div className="mb-3">
                    <label className="form-label">Sub Role</label>
                    <select name="Subrole" className="form-select" value={editUser.Subrole} onChange={handleChange}>
                      <option>---Select the Sub Role---</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Manager">Manager</option>
                      <option value="QA">QA</option>
                      <option value="Tester">Tester</option>
                    </select>
                  </div>

                  <button type="button" className="btn btn-success w-100" onClick={handleSave}>Save Changes</button>
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
