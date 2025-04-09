"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState({})
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch logged-in user details from the backend
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8080/backend-servlet/ViewProfileServlet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials (cookies) in the request
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data)
          setEditUser(data)
        } else {
          console.error("Failed to fetch user data", response.status)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        alert("Failed to fetch user data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value })
  }

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditUser({ ...editUser, profilePic: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/backend-servlet/UpdateProfileServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
        credentials: "include",
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setShowModal(false)
        // Show success message
        document.getElementById("successToast").classList.add("show")
        setTimeout(() => {
          document.getElementById("successToast").classList.remove("show")
        }, 3000)
      } else {
        alert("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("There was an error while saving your changes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Function to determine badge color based on experience level
  const getExperienceBadgeColor = (level) => {
    switch (level) {
      case "Junior":
        return "bg-info"
      case "Mid-level":
        return "bg-success"
      case "Senior":
        return "bg-primary"
      default:
        return "bg-secondary"
    }
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow">
            <div className="card-body text-center">
              <div className="position-relative mb-4">
                <img
                  src={user?.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="rounded-circle img-thumbnail"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <button
                  className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
              </div>
              <h4 className="mb-1">{user?.name}</h4>
              <p className="text-muted mb-3">{user?.role}</p>
              <div className="d-flex justify-content-center mb-3">
                <span className={`badge ${getExperienceBadgeColor(user?.experienceLevel)} me-2`}>
                  {user?.experienceLevel}
                </span>
                <span className="badge bg-secondary">{user?.Subrole}</span>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <i className="bi bi-pencil me-2"></i>Edit Profile
                </button>
              </div>
            </div>
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-around">
                <a href="#" className="text-decoration-none text-muted">
                  <i className="bi bi-envelope-fill"></i>
                </a>
                <a href="#" className="text-decoration-none text-muted">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="text-decoration-none text-muted">
                  <i className="bi bi-github"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow mt-4">
            <div className="card-body">
              <h5 className="card-title">Contact Information</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 px-0">
                  <i className="bi bi-envelope text-primary me-2"></i>
                  {user?.email}
                </li>
                <li className="list-group-item border-0 px-0">
                  <i className="bi bi-telephone text-primary me-2"></i>
                  {user?.phone}
                </li>
                <li className="list-group-item border-0 px-0">
                  <i className="bi bi-building text-primary me-2"></i>
                  {user?.company}
                </li>
                <li className="list-group-item border-0 px-0">
                  <i className="bi bi-geo-alt text-primary me-2"></i>
                  {user?.address}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow mb-4">
            <div className="card-header bg-white border-0">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <i className="bi bi-person me-2"></i>Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "skills" ? "active" : ""}`}
                    onClick={() => setActiveTab("skills")}
                  >
                    <i className="bi bi-gear me-2"></i>Skills
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "availability" ? "active" : ""}`}
                    onClick={() => setActiveTab("availability")}
                  >
                    <i className="bi bi-calendar-check me-2"></i>Availability
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === "overview" && (
                <div>
                  <h5 className="card-title">About Me</h5>
                  <p className="card-text">{user?.bio || "No bio information available."}</p>

                  <div className="row mt-4">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Role</h6>
                      <p>{user?.role}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Sub Role</h6>
                      <p>{user?.Subrole}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Experience Level</h6>
                      <p>{user?.experienceLevel}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Company</h6>
                      <p>{user?.company}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div>
                  <h5 className="card-title">Skills & Expertise</h5>
                  <div className="mt-3">
                    {user?.skills ? (
                      <div>
                        {user.skills.split(",").map((skill, index) => (
                          <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No skills listed.</p>
                    )}
                  </div>

                  <div className="progress-section mt-4">
                    <h6 className="fw-bold mb-3">Experience Level</h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Junior</span>
                        <span>Mid-level</span>
                        <span>Senior</span>
                      </div>
                      <div className="progress" style={{ height: "10px" }}>
                        {user?.experienceLevel === "Junior" && (
                          <div className="progress-bar bg-info" role="progressbar" style={{ width: "33%" }}></div>
                        )}
                        {user?.experienceLevel === "Mid-level" && (
                          <div className="progress-bar bg-success" role="progressbar" style={{ width: "66%" }}></div>
                        )}
                        {user?.experienceLevel === "Senior" && (
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: "100%" }}></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "availability" && (
                <div>
                  <h5 className="card-title">Availability</h5>
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Current Status: <strong>{user?.availability || "Not specified"}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <div className="card border-0 shadow">
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <div className="timeline mt-3">
                <div className="timeline-item pb-3 border-start border-2 border-primary ps-3 position-relative">
                  <div
                    className="timeline-marker position-absolute bg-primary rounded-circle"
                    style={{ width: "12px", height: "12px", left: "-6px", top: "6px" }}
                  ></div>
                  <p className="mb-1 fw-bold">Profile Updated</p>
                  <p className="text-muted small">{user?.updated_at}</p>
                </div>
                <div className="timeline-item pb-3 border-start border-2 border-primary ps-3 position-relative">
                  <div
                    className="timeline-marker position-absolute bg-primary rounded-circle"
                    style={{ width: "12px", height: "12px", left: "-6px", top: "6px" }}
                  ></div>
                  <p className="mb-1 fw-bold">Joined Project "Website Redesign"</p>
                  <p className="text-muted small">3 days ago</p>
                </div>
                <div className="timeline-item pb-3 border-start border-2 border-primary ps-3 position-relative">
                  <div
                    className="timeline-marker position-absolute bg-primary rounded-circle"
                    style={{ width: "12px", height: "12px", left: "-6px", top: "6px" }}
                  ></div>
                  <p className="mb-1 fw-bold">Completed Task "Database Migration"</p>
                  <p className="text-muted small">1 week ago</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-gear me-2"></i>
                  Edit Profile
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      {/* Profile Picture Upload */}
                      <div className="text-center">
                        <img
                          src={editUser.profilePic || "https://via.placeholder.com/150"}
                          alt="Preview"
                          className="rounded-circle img-thumbnail mb-3"
                          style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                        <div className="d-grid">
                          <label className="btn btn-outline-primary">
                            <i className="bi bi-camera me-2"></i>
                            Change Photo
                            <input type="file" className="d-none" accept="image/*" onChange={handleProfilePicUpload} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="row">
                        {/* Basic Information */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Name</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              value={editUser.name || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-envelope"></i>
                            </span>
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              value={editUser.email || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-telephone"></i>
                            </span>
                            <input
                              type="text"
                              name="phone"
                              className="form-control"
                              value={editUser.phone || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Company</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-building"></i>
                            </span>
                            <input
                              type="text"
                              name="company"
                              className="form-control"
                              value={editUser.company || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          value={editUser.address || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Bio</label>
                      <textarea
                        name="bio"
                        className="form-control"
                        rows="4"
                        value={editUser.bio || ""}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Availability</label>
                      <select
                        name="availability"
                        className="form-select"
                        value={editUser.availability || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select availability</option>
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Away">Away</option>
                        <option value="On Vacation">On Vacation</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Experience Level</label>
                      <select
                        name="experienceLevel"
                        className="form-select"
                        value={editUser.experienceLevel || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select level</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Skills (comma separated)</label>
                      <textarea
                        name="skills"
                        className="form-control"
                        value={editUser.skills || ""}
                        onChange={handleChange}
                        placeholder="e.g. JavaScript, React, Node.js, Project Management"
                      ></textarea>
                      <div className="form-text">Enter your skills separated by commas</div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  <i className="bi bi-check-circle me-2"></i>Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          id="successToast"
          className="toast align-items-center text-white bg-success border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <i className="bi bi-check-circle me-2"></i>
              Profile updated successfully!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

