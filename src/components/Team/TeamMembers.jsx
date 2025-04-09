"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const TeamMembers = ({ projectId }) => {
  const [projectDetails, setProjectDetails] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [activeProject, setActiveProject] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // grid or list

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    const userId = loggedInUser ? loggedInUser.userId : null

    if (projectId !== null && userId !== null) {
      const fetchProjectDetails = async () => {
        try {
          setLoading(true)
          console.log("Sending projectId:", projectId, "userId:", userId)
          const response = await fetch("http://localhost:8080/backend-servlet/GetAssignedMembersForProjectServlet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectId, userId }),
            credentials: "include",
          })
      
          if (!response.ok) {
            throw new Error("Failed to fetch project details")
          }
      
          const projectData = await response.json()
          console.log("Received project data:", projectData)
      
          setProjectDetails(projectData.projects || [])
          if ((projectData.projects || []).length > 0 && !activeProject) {
            setActiveProject(projectData.projects[0].projectId)
          }
        } catch (error) {
          console.error("Error fetching project details:", error)
          setError("Error fetching project details. Please try again later.")
        } finally {
          setLoading(false)
        }
      }
      

      fetchProjectDetails()
    }
  }, [projectId])

  // Get unique roles from all members across all projects
  const getAllRoles = () => {
    const roles = new Set()
    projectDetails.forEach((project) => {
      project.members.forEach((member) => {
        if (member.role) roles.add(member.role)
      })
    })
    return Array.from(roles)
  }

  // Filter members based on search term and role filter
  const getFilteredMembers = (members) => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.role && member.role.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesRole = filterRole === "" || member.role === filterRole
      return matchesSearch && matchesRole
    })
  }

  // Get the currently active project
  const getCurrentProject = () => {
    return projectDetails.find((project) => project.projectId === activeProject) || projectDetails[0]
  }

  // Get experience level badge color
  const getExperienceBadgeColor = (level) => {
    switch (level) {
      case "Junior":
        return "bg-info"
      case "Mid-level":
        return "bg-primary"
      case "Senior":
        return "bg-success"
      default:
        return "bg-secondary"
    }
  }

  // Get availability badge color
  const getAvailabilityBadgeColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-success"
      case "Busy":
        return "bg-warning text-dark"
      case "On Leave":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  // Generate a consistent color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "#4e73df",
      "#1cc88a",
      "#36b9cc",
      "#f6c23e",
      "#e74a3b",
      "#6f42c1",
      "#fd7e14",
      "#20c9a6",
      "#5a5c69",
      "#858796",
    ]

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    )
  }

  if (projectDetails.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle-fill me-2"></i>
        No project details available.
      </div>
    )
  }

  const currentProject = getCurrentProject()
  const roles = getAllRoles()

  return (
    <div className="container-fluid py-4">
      {/* Project Selection Tabs */}
      {projectDetails.length > 1 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-3">Your Projects</h5>
                <ul className="nav nav-pills">
                  {projectDetails.map((project) => (
                    <li className="nav-item" key={project.projectId}>
                      <button
                        className={`nav-link ${project.projectId === activeProject ? "active" : ""}`}
                        onClick={() => setActiveProject(project.projectId)}
                      >
                        {project.projectName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card shadow border-0 "
            style={{
              background: "linear-gradient(to right, #4e73df, #224abe)",
              borderRadius: "0.5rem",
              color: "#ffffff",
            }}
          >
            <div className="card-body text-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">{currentProject.projectName}</h2>
                  <p className="mb-0 opacity-75">
                    <i className="bi bi-person-badge me-2"></i>
                    Project Manager: <strong>{currentProject.projectManager}</strong>
                  </p>
                </div>
                <div className="d-flex">
                  <div className="bg-white bg-opacity-25 px-3 py-2 rounded-pill me-2">
                    <i className="bi bi-people-fill me-2"></i>
                    <span className="fw-bold">{currentProject.members.length}</span> Team Members
                  </div>
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-info-circle me-1"></i>
                    Project Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <div className="btn-group w-100">
            <button
              className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("grid")}
            >
              <i className="bi bi-grid-3x3-gap-fill"></i>
            </button>
            <button
              className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("list")}
            >
              <i className="bi bi-list-ul"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Team Members */}
      {currentProject.members && currentProject.members.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          No team members assigned to this project.
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="row">
              {getFilteredMembers(currentProject.members).map((member) => (
                <div key={member.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm border-0 hover-shadow">
                    <div className="card-body text-center">
                      <div className="mb-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="rounded-circle"
                            width="80"
                            height="80"
                          />
                        ) : (
                          <div
                            className="avatar-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "50%",
                              backgroundColor: getAvatarColor(member.name),
                              color: "white",
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(member.name)}
                          </div>
                        )}
                      </div>
                      <h5 className="card-title mb-1">{member.name}</h5>
                      <p className="text-muted small mb-2">{member.Subrole}</p>

                      <div className="d-flex justify-content-center mb-3">
                        <span className={`badge ${getExperienceBadgeColor(member.experienceLevel)} me-2`}>
                          {member.experienceLevel}
                        </span>
                        <span className={`badge ${getAvailabilityBadgeColor(member.availability)}`}>
                          {member.availability}
                        </span>
                      </div>

                      <div className="mb-3">
                        {(member.skills ? member.skills.split(",") : []).map(
                          (skill, index) => (
                            <span key={index}>{skill.trim()}</span>
                          )
                        )}
                      </div>

                      <div className="d-flex justify-content-center">
                        <a href={`mailto:${member.email}`} className="btn btn-sm btn-outline-primary me-2">
                          <i className="bi bi-envelope"></i>
                        </a>
                        <a href={`tel:${member.phone}`} className="btn btn-sm btn-outline-primary me-2">
                          <i className="bi bi-telephone"></i>
                        </a>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-chat"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Team Member</th>
                        <th>Role</th>
                        <th>Experience</th>
                        <th>Skills</th>
                        <th>Availability</th>
                        <th>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredMembers(currentProject.members).map((member) => (
                        <tr key={member.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="avatar-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  backgroundColor: getAvatarColor(member.name),
                                  color: "white",
                                  fontSize: "1rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {getInitials(member.name)}
                              </div>
                              <div>
                                <h6 className="mb-0">{member.name}</h6>
                                <small className="text-muted">{member.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>{member.Subrole}</td>
                          <td>
                            <span className={`badge ${getExperienceBadgeColor(member.experienceLevel)}`}>
                              {member.experienceLevel}
                            </span>
                          </td>
                          <td>
                          {(member.skills ? member.skills.split(",") : []).map(
                          (skill, index) => (
                            <span key={index}>{skill.trim()}</span>
                          )
                        )}
                          </td>
                          <td>
                            <span className={`badge ${getAvailabilityBadgeColor(member.availability)}`}>
                              {member.availability}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <a href={`mailto:${member.email}`} className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-envelope"></i>
                              </a>
                              <a href={`tel:${member.phone}`} className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-telephone"></i>
                              </a>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-chat"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Team Structure Visualization */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0">Team Structure</h5>
            </div>
            <div className="card-body">
              <div className="team-structure">
                <div className="d-flex flex-column align-items-center">
                  {/* Project Manager */}
                  <div className="mb-4">
                    <div className="team-node manager-node">
                      <div
                        className="avatar-circle d-flex align-items-center justify-content-center mb-2 mx-auto"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "#4e73df",
                          color: "white",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {getInitials(currentProject.projectManager)}
                      </div>
                      <div className="text-center">
                        <h6 className="mb-0">{currentProject.projectManager}</h6>
                        <span className="badge bg-primary">Project Manager</span>
                      </div>
                    </div>
                    <div className="team-connector"></div>
                  </div>

                  {/* Team Members by Role */}
                  <div className="d-flex flex-wrap justify-content-center">
                    {roles.map((role) => {
                      const roleMembers = currentProject.members.filter((m) => m.role === role)
                      if (roleMembers.length === 0) return null

                      return (
                        <div key={role} className="team-role mx-4 mb-3">
                          <div className="text-center mb-2">
                            <span className="badge bg-secondary">{role}</span>
                          </div>
                          <div className="d-flex flex-wrap justify-content-center" style={{ maxWidth: "300px" }}>
                            {roleMembers.map((member) => (
                              <div key={member.id} className="team-member-node mx-2">
                                <div
                                  className="avatar-circle d-flex align-items-center justify-content-center mb-1 mx-auto"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: getAvatarColor(member.name),
                                    color: "white",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {getInitials(member.name)}
                                </div>
                                <div className="text-center">
                                  <small>{member.name.split(" ")[0]}</small>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease;
        }
        .card {
          transition: all 0.3s ease;
          border-radius: 0.5rem;
        }
        .team-structure {
          padding: 20px;
        }
        .team-connector {
          width: 2px;
          height: 30px;
          background-color: #ccc;
          margin: 0 auto;
        }
        .team-node {
          padding: 10px;
          border-radius: 8px;
          background-color: #f8f9fa;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        .manager-node {
          background-color: #e8eeff;
          padding: 15px;
          border-radius: 10px;
        }
        .team-member-node {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  )
}

export default TeamMembers

