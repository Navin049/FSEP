import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added this import

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [deleteUser, setDeleteUser] = useState();
  const navigate = useNavigate(); // Added useNavigate hook

  // Fetch users from the backend servlet
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/UserManagementServlet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // To send cookies if necessary (for session)
        });

        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          alert("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("There was an error fetching user data. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  // Handle the edit action
  const handleEditClick = (user) => {
    console.log("Editing user:", user);
    setEditUser(user);
    setShowModal(true); // Show the modal when editing a user
  };
  

  // Handle the delete action
  const handleDelete = async (user) => {
    const response = await fetch("http://localhost:8080/backend-servlet/UserManagementDeleteServlet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id: user.id}),
      credentials: "include",
    });

    if (response.ok) {
      const DeleteData = await response.json();
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== deleteResponse.id));
      alert("User deleted successfully.");
    } else {
      alert("Failed to delete users");
    }
  };

  // Handle change in modal form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle file upload for profile picture
  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditUser((prevUser) => ({
        ...prevUser,
        profilePic: URL.createObjectURL(file), // Temporary URL for preview
      }));
    }
  };

  // Save edited user data
  const handleSave = async () => {
    console.log("Saving user data:", editUser);
    const response = await fetch("http://localhost:8080/backend-servlet/UserManagementUpdateServlet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editUser),
      // credentials: "include",
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setShowModal(false); // Close the modal after save
      alert("User updated successfully.");
    } else {
      console.error("Failed to edit user:", response.statusText);
      alert("Failed to edit user");
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Manage Users</h2>
      <div className="overflow-x-auto table-responsive-sm">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Password</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Bio</th>
              <th className="p-3 border">Profile Picture</th>
              <th className="p-3 border">Subrole</th>
              <th className="p-3 border">Availability</th>
              <th className="p-3 border">Skills</th>
              <th className="p-3 border">Experience Level</th>
              <th className="p-3 border"><button>Action</button></th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3 border">{user.id}</td>
                  <td className="p-3 border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.password}</td>
                  <td className="p-3 border">{user.role}</td>
                  <td className="p-3 border">{user.phone}</td>
                  <td className="p-3 border">{user.company || "N/A"}</td>
                  <td className="p-3 border">{user.address || "N/A"}</td>
                  <td className="p-3 border">{user.bio || "No bio available"}</td>
                  <td className="p-3 border">
                    <img
                      src={user.profilePic || "default.jpg"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="p-3 border">{user.Subrole || "N/A"}</td>
                  <td className="p-3 border">{user.availability || "Available"}</td>
                  <td className="p-3 border">{user.skills || "No skills listed"}</td>
                  <td className="p-3 border">{user.experienceLevel || "Junior"}</td>
                  <td className="p-3 border">
                    <button className="btn btn-primary" onClick={() => handleEditClick(user)} >Edit</button>
                    <button className="btn btn-danger m-1" onClick={() => handleDelete(user)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="text-center p-4 text-gray-500">
                  No users registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
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
                      alt="User Profile"
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
                    Close
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

export default UserManagement;
