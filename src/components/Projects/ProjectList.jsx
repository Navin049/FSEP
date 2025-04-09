"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProjectList = ({ projectId }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    description: "",
    startdate: "",
    enddate: "",
    budget: "",
    status:"",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("cards"); // cards or list
  const navigate = useNavigate();

  // Load projects from backend when the component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNewProjectClick = () => {
    // Navigate to the 'New Project' form (assuming the route is '/project-form')
    navigate("/projects/ProjectForm"); // Adjust the path based on your routing configuration
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/backend-servlet/ViewProjectServlet",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        // If the response contains a 'projects' array, set it to the state
        if (data.projects) {
          setProjects(data.projects); // Set the 'projects' array directly

          // If a projectId was provided, select that project
          if (projectId) {
            const projectToSelect = data.projects.find(
              (p) => p.projectId === projectId
            );
            if (projectToSelect) {
              setSelectedProject(projectToSelect);
              fetchTeamMembers(projectToSelect.projectId);
            }
          }
        } else {
          console.error(
            "Received data does not contain 'projects' array:",
            data
          );
          setProjects([]); // Set empty projects if data format is unexpected
        }
      } else {
        console.error("Error fetching projects:", response.statusText);
        setProjects([]); // Set empty projects on error
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]); // Set empty projects on error
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (projectId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/TeamMemberINProject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ projectId }),
        }
      );

      if (response.ok) {
        const membersData = await response.json();

        // Check if the response has a 'members' property
        if (membersData && Array.isArray(membersData.members)) {
          setTeamMembers(membersData.members); // Set the team members data
        } else {
          console.error("Invalid data format for team members:", membersData);
          setTeamMembers([]); // Reset to empty array if data format is unexpected
        }
      } else {
        console.error("Error fetching team members:", response.statusText);
        setTeamMembers([]); // Reset to empty array on error
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]); // Reset to empty array on error
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditData({
      id: project.projectId,
      name: project.name,
      description: project.description,
      startdate: project.startDate,
      enddate: project.endDate,
      budget: project.budget,
      status:project.status,
    });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    console.log("Editing project:", editData);

    if (!editData.id) {
      console.error("Project ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/backend-servlet/UpdateProjectServlet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        fetchProjects(); // Re-fetch projects after successful update
        setShowModal(false); // Close the modal
      } else {
        console.error("Error updating project:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting project with ID:", id);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/backend-servlet/DeleteProjectServlet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Project_ID: id }),
          }
        );

        if (response.ok) {
          fetchProjects(); // Re-fetch projects after deletion
          if (selectedProject && selectedProject.projectId === id) {
            setSelectedProject(null);
            setTeamMembers([]);
          }
        } else {
          console.error("Error deleting project:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleDeleteMember = async (memberId, projectId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this team member?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/backend-servlet/RemoveMemberFromProjectServlet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              member_id: memberId,
              project_id: projectId,
            }),
          }
        );

        if (response.ok) {
          fetchTeamMembers(projectId); // Re-fetch team members after deletion
        } else {
          console.error("Error removing team member:", response.statusText);
        }
      } catch (error) {
        console.error("Error removing team member:", error);
      }
    }
  };

  const handleSelectProject = (project) => {
    if (selectedProject && selectedProject.projectId === project.projectId) {
      setSelectedProject(null);
      setTeamMembers([]);
    } else {
      setSelectedProject(project);
      fetchTeamMembers(project.projectId); // Fetch team members for the selected project
    }
  };

// Calculate project status with manual override
const getProjectStatus = (startDate, endDate, manualStatus) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Manual status mapping to badge classes
  const manualStatusMap = {
    "To Do": { badgeClass: "bg-warning", progress: 0 },
    "In Progress": { badgeClass: "bg-primary", progress: 50 },
    "Completed": { badgeClass: "bg-success", progress: 100 },
  };

  // If manual status is provided and valid
  if (manualStatus && manualStatusMap[manualStatus]) {
    return {
      status: manualStatus,
      badgeClass: manualStatusMap[manualStatus].badgeClass,
      progress: manualStatusMap[manualStatus].progress,
    };
  }

  // Fallback to automatic status calculation
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { status: "Unknown", badgeClass: "bg-secondary" };
  }

  if (now < start) {
    return { status: "Not Started", badgeClass: "bg-info", progress: 0 };
  } else if (now > end) {
    return { status: "Completed", badgeClass: "bg-success", progress: 100 };
  } else {
    const totalDuration = end - start;
    const elapsed = now - start;
    const progress = Math.round((elapsed / totalDuration) * 100);

    return {
      status: "In Progress",
      badgeClass: "bg-primary",
      progress,
    };
  }
};


  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;

    const end = new Date(endDate);
    if (isNaN(end.getTime())) return null;

    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Filter and sort projects
  const getFilteredAndSortedProjects = () => {
    return projects
      .filter((project) => {
        if (!searchTerm) return true;

        return (
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        let comparison = 0;

        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "startDate") {
          comparison = new Date(a.startDate) - new Date(b.startDate);
        } else if (sortBy === "endDate") {
          comparison = new Date(a.endDate) - new Date(b.endDate);
        } else if (sortBy === "budget") {
          comparison =
            Number.parseFloat(a.budget) - Number.parseFloat(b.budget);
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name) => {
    if (!name) return "#6c757d";

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
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Project Management</h2>
        <div className="d-flex">
          <div className="btn-group me-2">
            <button
              className={`btn ${
                viewMode === "cards" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setViewMode("cards")}
            >
              <i className="bi bi-grid-3x3-gap me-1"></i> Cards
            </button>
            <button
              className={`btn ${
                viewMode === "list" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setViewMode("list")}
            >
              <i className="bi bi-list-ul me-1"></i> List
            </button>
          </div>
          <button className="btn btn-success" onClick={handleNewProjectClick}>
            <i className="bi bi-plus-lg me-1"></i> New Project
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="startDate">Sort by Start Date</option>
                  <option value="endDate">Sort by End Date</option>
                  <option value="budget">Sort by Budget</option>
                </select>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  <i
                    className={`bi bi-sort-${
                      sortOrder === "asc" ? "down" : "up"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No projects available. Create a new project to get started.
        </div>
      ) : getFilteredAndSortedProjects().length === 0 ? (
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No projects match your search criteria.
        </div>
      ) : (
        <>
          {viewMode === "cards" ? (
            // Cards View
            <div className="row">
              {getFilteredAndSortedProjects().map((project) => {
                const { status, badgeClass, progress } = getProjectStatus(
                  project.startDate,
                  project.endDate,
                  project.status 
                );
                const daysRemaining = getDaysRemaining(project.endDate);

                return (
                  <div
                    key={project.projectId}
                    className="col-md-6 col-lg-4 mb-4"
                  >
                    <div
                      className={`card shadow-sm border-0 h-100 ${
                        selectedProject?.projectId === project.projectId
                          ? "border-primary"
                          : ""
                      }`}
                    >
                      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                        <h5
                          className="card-title mb-0 text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectProject(project)}
                        >
                          {project.name}
                        </h5>
                        <span className={`badge ${badgeClass}`}>{status}</span>
                      </div>
                      <div className="card-body">
                        <p className="card-text text-muted mb-3">
                          {project.description.length > 100
                            ? `${project.description.substring(0, 100)}...`
                            : project.description}
                        </p>

                        <div className="d-flex justify-content-between mb-2">
                          <div className="small text-muted">
                            <i className="bi bi-calendar me-1"></i>{" "}
                            {formatDate(project.startDate)}
                          </div>
                          <div className="small text-muted">
                            <i className="bi bi-calendar-check me-1"></i>{" "}
                            {formatDate(project.endDate)}
                          </div>
                        </div>

                        {progress !== undefined && (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <small>Progress</small>
                              <small>{progress}%</small>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${progress}%` }}
                                aria-valuenow={progress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="fw-bold">
                              {formatCurrency(project.budget)}
                            </span>
                            <span className="text-muted ms-1">budget</span>
                          </div>
                          {daysRemaining !== null && (
                            <div
                              className={`small ${
                                daysRemaining < 0
                                  ? "text-danger"
                                  : daysRemaining < 7
                                  ? "text-warning"
                                  : "text-success"
                              }`}
                            >
                              {daysRemaining < 0
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : daysRemaining === 0
                                ? "Due today"
                                : `${daysRemaining} days remaining`}
                            </div>
                          )}
                        </div>

                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleSelectProject(project)}
                          >
                            {selectedProject?.projectId === project.projectId
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                          <div>
                            <button
                              className="btn btn-sm btn-outline-secondary me-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project.projectId);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      {selectedProject?.projectId === project.projectId && (
                        <div className="card-footer bg-light">
                          <h6 className="mb-3">Team Members</h6>
                          {teamMembers.length === 0 ? (
                            <p className="text-muted small">
                              No team members assigned to this project.
                            </p>
                          ) : (
                            <div className="row g-2">
                              {teamMembers.map((member) => (
                                <div key={member.id} className="col-md-6">
                                  <div className="d-flex align-items-center p-2 bg-white rounded shadow-sm">
                                    <div
                                      className="avatar-circle me-2 d-flex align-items-center justify-content-center"
                                      style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "50%",
                                        backgroundColor: getAvatarColor(
                                          member.name
                                        ),
                                        color: "white",
                                        fontSize: "0.9rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {getInitials(member.name)}
                                    </div>
                                    <div className="flex-grow-1 min-width-0">
                                      <div className="fw-medium text-truncate">
                                        {member.name}
                                      </div>
                                      <div className="small text-muted text-truncate">
                                        {member.Subrole || "Team Member"}
                                      </div>
                                    </div>
                                    <button
                                      className="btn btn-sm btn-light rounded-circle p-1"
                                      onClick={() =>
                                        handleDeleteMember(
                                          member.id,
                                          project.projectId
                                        )
                                      }
                                      title="Remove member"
                                    >
                                      <i className="bi bi-x"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <button className="btn btn-sm btn-primary mt-3">
                            <i className="bi bi-person-plus me-1"></i> Add Team
                            Member
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Timeline</th>
                        <th>Budget</th>
                        <th>Team Size</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredAndSortedProjects().map((project) => {
                        const { status, badgeClass, progress } =
                          getProjectStatus(project.startDate, project.endDate);
                        const daysRemaining = getDaysRemaining(project.endDate);

                        return (
                          <React.Fragment key={project.projectId}>
                            <tr
                              className={
                                selectedProject?.projectId === project.projectId
                                  ? "table-active"
                                  : ""
                              }
                              onClick={() => handleSelectProject(project)}
                              style={{ cursor: "pointer" }}
                            >
                              <td>
                                <div className="fw-bold">{project.name}</div>
                                {selectedProject?.projectId !==
                                  project.projectId && (
                                  <div
                                    className="small text-muted text-truncate"
                                    style={{ maxWidth: "300px" }}
                                  >
                                    {project.description}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${badgeClass}`}>
                                  {status}
                                </span>
                                {progress !== undefined && (
                                  <div
                                    className="progress mt-1"
                                    style={{ height: "5px", width: "100px" }}
                                  >
                                    <div
                                      className="progress-bar"
                                      role="progressbar"
                                      style={{ width: `${progress}%` }}
                                      aria-valuenow={progress}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="small">
                                  {formatDate(project.startDate)} -{" "}
                                  {formatDate(project.endDate)}
                                </div>
                                {daysRemaining !== null && (
                                  <div
                                    className={`small ${
                                      daysRemaining < 0
                                        ? "text-danger"
                                        : daysRemaining < 7
                                        ? "text-warning"
                                        : "text-success"
                                    }`}
                                  >
                                    {daysRemaining < 0
                                      ? `${Math.abs(
                                          daysRemaining
                                        )} days overdue`
                                      : daysRemaining === 0
                                      ? "Due today"
                                      : `${daysRemaining} days remaining`}
                                  </div>
                                )}
                              </td>
                              <td>{formatCurrency(project.budget)}</td>
                              <td>
                                {selectedProject?.projectId ===
                                project.projectId ? (
                                  teamMembers.length
                                ) : (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-6"></span>
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(project);
                                    }}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(project.projectId);
                                    }}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {selectedProject?.projectId ===
                              project.projectId && (
                              <tr className="table-light">
                                <td colSpan="6" className="p-0">
                                  <div className="p-3">
                                    <h6 className="mb-3">
                                      Project Description
                                    </h6>
                                    <p>{project.description}</p>

                                    <h6 className="mb-3 mt-4">Team Members</h6>
                                    {teamMembers.length === 0 ? (
                                      <p className="text-muted">
                                        No team members assigned to this
                                        project.
                                      </p>
                                    ) : (
                                      <div className="row g-3">
                                        {teamMembers.map((member) => (
                                          <div
                                            key={member.id}
                                            className="col-md-4"
                                          >
                                            <div className="d-flex align-items-center p-2 bg-white rounded shadow-sm">
                                              <div
                                                className="avatar-circle me-2 d-flex align-items-center justify-content-center"
                                                style={{
                                                  width: "36px",
                                                  height: "36px",
                                                  borderRadius: "50%",
                                                  backgroundColor:
                                                    getAvatarColor(member.name),
                                                  color: "white",
                                                  fontSize: "0.9rem",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {getInitials(member.name)}
                                              </div>
                                              <div className="flex-grow-1 min-width-0">
                                                <div className="fw-medium text-truncate">
                                                  {member.name}
                                                </div>
                                                <div className="small text-muted text-truncate">
                                                  {member.Subrole ||
                                                    "Team Member"}
                                                </div>
                                              </div>
                                              <button
                                                className="btn btn-sm btn-light rounded-circle p-1"
                                                onClick={() =>
                                                  handleDeleteMember(
                                                    member.id,
                                                    project.projectId
                                                  )
                                                }
                                                title="Remove member"
                                              >
                                                <i className="bi bi-x"></i>
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <button className="btn btn-sm btn-primary mt-3">
                                      <i className="bi bi-person-plus me-1"></i>{" "}
                                      Add Team Member
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Project Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Project
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-briefcase"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        placeholder="Enter project name"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-text-paragraph"></i>
                      </span>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-calendar"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          value={editData.startdate}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              startdate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-calendar-check"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          value={editData.enddate}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              enddate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Budget</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-currency-rupee"></i>
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          value={editData.budget}
                          onChange={(e) =>
                            setEditData({ ...editData, budget: e.target.value })
                          }
                          placeholder="Enter project budget"
                        />
                      </div>
                      <div className="form-text">
                        Enter the budget amount in Indian Rupees (₹)
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-check-circle"></i>
                        </span>
                        <select
                          className="form-select"
                          value={editData.status}
                          onChange={(e) => setEditData({...editData,status:e.target.value})}
                          required
                        >
                          <option value="to Do">to Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                  disabled={
                    !editData.name || !editData.description || !editData.budget
                  }
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .card {
          transition: all 0.3s ease;
          border-radius: 0.5rem;
        }
        .card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .min-width-0 {
          min-width: 0;
        }
      `}</style>
    </div>
  );
};

export default ProjectList;
