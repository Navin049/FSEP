"use client"

import { useEffect, useState } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"
import AdminSidebar from "../Shared/AdminSidebar"
import { FaPlus, FaEye, FaPencilAlt, FaTrash, FaFilter, FaSearch } from "react-icons/fa"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [userCounts, setUserCounts] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalMode, setModalMode] = useState("view") // view, edit, add

  // Fetch users data
  const fetchUsersData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/backend-servlet/UserManagementServlet", {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Received users data:", data)
        setUsers(data)

        // Calculate user role counts
        const counts = {
          "Project manager": 0,
          "Team Member": 0,
        }

        data.forEach((user) => {
          if (user.role === "Project manager") counts["Project manager"]++
          else if (user.role === "Team Member") counts["Team Member"]++
        })

        setUserCounts(counts)
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsersData()
  }, [])

  // Data for the "User Types" Pie Chart
  const userTypeData = {
    labels: ["Project Manager", "Team Member"],
    datasets: [
      {
        data: [userCounts["Project manager"], userCounts["Team Member"]],
        backgroundColor: ["#4e73df", "#36b9cc"],
        hoverBackgroundColor: ["#2e59d9", "#2c9faf"],
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
    },
  }

  // Handle user actions
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setModalMode("view")
    setShowUserModal(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setModalMode("edit")
    setShowUserModal(true)
  }

  const handleAddUser = () => {
    setSelectedUser({
      name: "",
      email: "",
      role: "Team Member",
      Subrole: "",
      availability: "Available",
    })
    setModalMode("add")
    setShowUserModal(true)
  }

  const handleSaveUser = async () => {
    try {
      const url =
        modalMode === "add"
          ? "http://localhost:8080/backend-servlet/RegisterServlet"
          : "http://localhost:8080/backend-servlet/UpdateProfileServlet"

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUser),
        credentials: "include",
      })

      if (response.ok) {
        setShowUserModal(false)
        fetchUsersData() // Refresh the users list
      } else {
        console.error("Failed to save user:", response.statusText)
      }
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/UserManagementDeleteServlet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
          credentials: "include",
        })

        if (response.ok) {
          fetchUsersData() // Refresh the users list
        } else {
          console.error("Failed to delete user:", response.statusText)
        }
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  // Helper function for UI
  function getUserStatusBadge(status) {
    const lowerStatus = status?.toLowerCase() // convert once

    switch (lowerStatus) {
      case "available":
        return <span className="badge bg-success">Available</span>
      case "unavailable":
        return <span className="badge bg-warning">Unavailable</span>
      default:
        return <span className="badge bg-light text-dark">{status}</span>
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole

    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <AdminSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <div className="dashboard-header">
          <div>
            <h2 className="mb-1">User Management</h2>
            <p className="text-muted">Manage all your users in one place</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddUser}>
            <FaPlus className="me-2" />
            Add New User
          </button>
        </div>

        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select"
                style={{ maxWidth: "200px" }}
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Team Member">Team Member</option>
              </select>
              <button className="btn btn-outline-secondary">
                <FaFilter />
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">User Distribution</h6>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Pie data={userTypeData} options={chartOptions} />
                </div>
                <div className="mt-4 text-center small">
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-primary"></i> Project Managers: {userCounts["Project manager"]}
                  </span>
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-info"></i> Team Members: {userCounts["Team Member"]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">User Statistics</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-6 mb-4">
                    <div className="h4 font-weight-bold">{users.length}</div>
                    <div className="text-muted">Total Users</div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="h4 font-weight-bold">
                      {users.filter((user) => user.availability?.toLowerCase() === "available").length}
                    </div>
                    <div className="text-muted">Available Users</div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="h4 font-weight-bold">
                      {users.reduce((sum, user) => sum + (user.projectCount || 0), 0)}
                    </div>
                    <div className="text-muted">Total Assigned Projects</div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="h4 font-weight-bold">
                      {Math.round(users.reduce((sum, user) => sum + (user.projectCount || 0), 0) / (users.length || 1))}
                    </div>
                    <div className="text-muted">Avg. Projects per User</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Users</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Projects</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id || user.email}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.Subrole}</td>
                        <td>{user.projectCount}</td>
                        <td>{getUserStatusBadge(user.availability)}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-light" onClick={() => handleViewUser(user)}>
                              <FaEye />
                            </button>
                            <button className="btn btn-sm btn-light" onClick={() => handleEditUser(user)}>
                              <FaPencilAlt />
                            </button>
                            <button className="btn btn-sm btn-light" onClick={() => handleDeleteUser(user.id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "view" ? "User Details" : modalMode === "edit" ? "Edit User" : "Add New User"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowUserModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedUser?.name || ""}
                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                        readOnly={modalMode === "view"}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={selectedUser?.email || ""}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        readOnly={modalMode === "view"}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={selectedUser?.role || ""}
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                        disabled={modalMode === "view"}
                      >
                        <option value="Project Manager">Project Manager</option>
                        <option value="Team Member">Team Member</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <select
              className="form-select"
              id="subroleInput"
              value={selectedUser?.Subrole}
              onChange={(e) => setSelectedUser({ ...selectedUser, Subrole: e.target.value })}
            >
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="QA">QA</option>
              <option value="Tester">Tester</option>
            </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Availability</label>
                      <select
                        className="form-select"
                        value={selectedUser?.availability || ""}
                        onChange={(e) => setSelectedUser({ ...selectedUser, availability: e.target.value })}
                        disabled={modalMode === "view"}
                      >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                    {modalMode === "edit" && (
                      <div className="col-md-6">
                        <label className="form-label">Projects</label>
                        <input
                          type="number"
                          className="form-control"
                          value={selectedUser?.projectCount || 0}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                  {modalMode !== "view" && (
                    <div className="mb-3">
                      <label className="form-label">
                        Password {modalMode === "edit" ? "(Leave blank to keep current)" : ""}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={selectedUser?.password || ""}
                        onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                      />
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button type="button" className="btn btn-primary" onClick={handleSaveUser}>
                    {modalMode === "add" ? "Add User" : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
            margin-left: 150px;
          padding: 20px;
          transition: all 0.3s ease;
          background-color: #f8f9fc;
        }

        .main-content.expanded {
          margin-left: 70px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e3e6f0;
        }

        .card {
          border: none;
          border-radius: 0.35rem;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
        }

        .card-header {
          background-color: #f8f9fc;
          border-bottom: 1px solid #e3e6f0;
        }

        .font-weight-bold {
          font-weight: 700 !important;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 70px;
          }
          
          .main-content.expanded {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default UserManagement
