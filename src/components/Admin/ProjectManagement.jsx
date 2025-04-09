"use client"

import { useEffect, useState, useRef } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"
import AdminSidebar from "./../Shared/AdminSidebar"
import { FaPlus, FaEye, FaPencilAlt, FaTrash, FaFilter, FaSearch } from "react-icons/fa"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const ProjectManagement = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [projectStatus, setProjectStatus] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [modalMode, setModalMode] = useState("view") // view, edit, add

  const projectChartRef = useRef(null)

  // Fetch projects data
  const fetchProjectsData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/backend-servlet/ProjectManagementServlet", {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Received projects data:", data)
        setProjects(data.projects || [])

        // Calculate project status counts
        const statusCounts = {
          completed: 0,
          inProgress: 0,
          toDo: 0,
        }

        data.projects?.forEach((project) => {
          const status = project.status?.toLowerCase() || ""
          if (status.includes("complete")) statusCounts.completed++
          else if (status.includes("progress")) statusCounts.inProgress++
          else statusCounts.toDo++
        })

        setProjectStatus(statusCounts)

        // Update monthly projects data
        updateMonthlyProjectsData(data.monthlyProjects)

      } else {
        console.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  // Data for the "Projects Status" Pie Chart
  const projectStatusData = {
    labels: ["In Progress", "Completed", "To Do"],
    datasets: [
      {
        data: [projectStatus?.inProgress || 0, projectStatus?.completed || 0, projectStatus?.toDo || 0],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
        hoverBackgroundColor: ["#2e59d9", "#17a673", "#258f99"],
        borderWidth: 1,
      },
    ],
  }

  // Data for the "Monthly Projects" Bar Chart
  const [monthlyProjectsData, setMonthlyProjectsData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Projects Created",
        data: new Array(12).fill(0),
        backgroundColor: "#4e73df",
        borderColor: "#4e73df",
        borderWidth: 1,
      },
    ],
  })

  // Function to update monthly projects data
  const updateMonthlyProjectsData = (monthlyProjectsObj) => {
    const monthlyData = new Array(12).fill(0)
  
    for (const [month, count] of Object.entries(monthlyProjectsObj)) {
      const monthIndex = parseInt(month) - 1 // Month is 1-based (1 = Jan)
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex] = count
      }
    }
  
    setMonthlyProjectsData((prev) => ({
      ...prev,
      datasets: [{ ...prev.datasets[0], data: monthlyData }],
    }))
  }
  

  useEffect(() => {
    fetchProjectsData()
  }, [])

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

  // Handle project actions
  const handleViewProject = (project) => {
    setSelectedProject(project)
    setModalMode("view")
    setShowProjectModal(true)
  }

  const handleEditProject = (project) => {
    setSelectedProject(project)
    setModalMode("edit")
    setShowProjectModal(true)
  }

  const handleAddProject = () => {
    setSelectedProject({
      projectName: "",
      manager: "",
      status: "To Do",
      deadline: "",
      description: "",
    })
    setModalMode("add")
    setShowProjectModal(true)
  }

  const handleSaveProject = async () => {
    try {
      const url =
        modalMode === "add"
          ? "http://localhost:8080/backend-servlet/AddProjectServlet"
          : "http://localhost:8080/backend-servlet/UpdateProjectServlet"

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProject),
        credentials: "include",
      })

      if (response.ok) {
        setShowProjectModal(false)
        fetchProjectsData() // Refresh the projects list
      } else {
        console.error("Failed to save project:", response.statusText)
      }
    } catch (error) {
      console.error('Error saving project:", error)ror("Error saving project:', error)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/DeleteProjectServlet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
          credentials: "include",
        })

        if (response.ok) {
          fetchProjectsData() // Refresh the projects list
        } else {
          console.error("Failed to delete project:", response.statusText)
        }
      } catch (error) {
        console.error("Error deleting project:", error)
      }
    }
  }

  // Helper function for UI
  function getStatusBadge(status) {
    const lowerStatus = status?.toLowerCase() // convert once

    switch (lowerStatus) {
      case "in progress":
        return <span className="badge bg-warning text-dark">In Progress</span>
      case "completed":
        return <span className="badge bg-success">Completed</span>
      case "to do":
        return <span className="badge bg-secondary">To Do</span>
      default:
        return <span className="badge bg-light text-dark">{status}</span>
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Filter projects based on search term and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && project.status?.toLowerCase().includes("complete")) ||
      (filterStatus === "inProgress" && project.status?.toLowerCase().includes("progress")) ||
      (filterStatus === "toDo" &&
        !project.status?.toLowerCase().includes("complete") &&
        !project.status?.toLowerCase().includes("progress"))

    return matchesSearch && matchesStatus
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
            <h2 className="mb-1">Project Management</h2>
            <p className="text-muted">Manage all your projects in one place</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddProject}>
            <FaPlus className="me-2" />
            Add New Project
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select"
                style={{ maxWidth: "200px" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="toDo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
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
                <h6 className="m-0 font-weight-bold text-primary">Projects by Month</h6>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Bar
                    ref={projectChartRef}
                    data={monthlyProjectsData}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Project Status</h6>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Pie data={projectStatusData} options={chartOptions} />
                </div>
                <div className="mt-4 text-center small">
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-primary"></i> In Progress: {projectStatus.inProgress}
                  </span>
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-success"></i> Completed: {projectStatus.completed}
                  </span>
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-info"></i> To Do: {projectStatus.toDo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Projects</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Project Name</th>
                    <th>Manager</th>
                    <th>Team Size</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.projectId}>
                        <td>{project.projectName}</td>
                        <td>{project.manager}</td>
                        <td>{project.teamSize}</td>
                        <td>{getStatusBadge(project.status)}</td>
                        <td>{project.deadline}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-light" onClick={() => handleViewProject(project)}>
                              <FaEye />
                            </button>
                            <button className="btn btn-sm btn-light" onClick={() => handleEditProject(project)}>
                              <FaPencilAlt />
                            </button>
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => handleDeleteProject(project.projectId)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "view" ? "Project Details" : modalMode === "edit" ? "Edit Project" : "Add New Project"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowProjectModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Project Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedProject?.projectName || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, projectName: e.target.value })}
                        readOnly={modalMode === "view"}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Manager</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedProject?.manager || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, manager: e.target.value })}
                        readOnly={modalMode === "view"}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={selectedProject?.status || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value })}
                        disabled={modalMode === "view"}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedProject?.deadline || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, deadline: e.target.value })}
                        readOnly={modalMode === "view"}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={selectedProject?.description || ""}
                      onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                      readOnly={modalMode === "view"}
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button type="button" className="btn btn-primary" onClick={handleSaveProject}>
                    {modalMode === "add" ? "Add Project" : "Save Changes"}
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

export default ProjectManagement
