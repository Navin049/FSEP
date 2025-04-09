"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
    deadline: "",
    assignedTo: "",
    priority: "",
    projectName: "",
  })
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [isTeamMember, setIsTeamMember] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterProject, setFilterProject] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("deadline")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("board") // board, list
  const navigate = useNavigate();

  const handleNewTaskClick = () => {
    // Navigate to the 'New Project' form (assuming the route is '/project-form')
    navigate("/tasks/TaskForm"); // Adjust the path based on your routing configuration
  };


  useEffect(() => {
    console.log("Fetching tasks...")
    fetchTasks()
    checkIfTeamMember()
    fetchProjects()
  }, [])

  const checkIfTeamMember = async () => {
    try {
      console.log("Checking if user is a team member...")
      const response = await fetch("http://localhost:8080/backend-servlet/CheckIfTeamMemberServlet", {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      console.log("User team membership:", data)
      setIsTeamMember(data.isTeamMember)
    } catch (error) {
      console.error("Error checking team membership:", error)
    }
  }

  const fetchProjects = async () => {
    try {
      console.log("Fetching projects...")
      const projectsRes = await fetch("http://localhost:8080/backend-servlet/ViewProjectServlet", {
        credentials: "include",
      })
      const projectsData = await projectsRes.json()
      console.log("Fetched projects:", projectsData)
      setProjects(projectsData.projects || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const fetchTeamMembers = async (projectId) => {
    try {
      console.log("Fetching team members for project ID:", projectId)
      const response = await fetch("http://localhost:8080/backend-servlet/TeamMemberINProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
        credentials: "include",
      })
      const teamMembersData = await response.json()
      console.log("Fetched team members:", teamMembersData)

      // Ensure teamMembersData contains the members array
      setTeamMembers(teamMembersData.members || [])
    } catch (error) {
      console.error("Error fetching team members:", error)
      setTeamMembers([]) // Fallback to an empty array in case of an error
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      console.log("Fetching tasks...")
      const response = await fetch("http://localhost:8080/backend-servlet/ViewTaskServlet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      const data = await response.json()
      console.log("Fetched tasks:", data)
      setTasks(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setLoading(false)
    }
  }

  const handleEditClick = (task) => {
    console.log("Handling edit for task:", task)
    setSelectedTask(task)
    setEditData({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline,
      assignedTo: task.assignedTo,
      priority: task.priority,
      projectName: task.projectName,
    })

    // Find the project ID for the current task's project name
    const selectedProject = projects.find((project) => project.name === task.projectName)

    if (selectedProject) {
      fetchTeamMembers(selectedProject.projectId)
    }

    setShowModal(true)
  }

  const handleProjectChange = (e) => {
    console.log("Project changed:", e.target.value)
    const selectedProjectName = e.target.value
    setEditData({ ...editData, projectName: selectedProjectName })

    const selectedProject = projects.find((project) => project.name === selectedProjectName)

    if (selectedProject) {
      console.log("Fetching team members for project:", selectedProject)
      fetchTeamMembers(selectedProject.projectId)
    }
  }

  const handleSaveChanges = async () => {
    console.log("Saving changes for task:", editData)
    if (!editData.id) {
      console.error("Task ID is missing")
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/backend-servlet/UpdateTaskServlet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        console.log("Task updated successfully")
        fetchTasks()
        setShowModal(false)
      } else {
        console.error("Error updating task:", response.statusText)
      }
    } catch (error) {
      console.error("Error saving task changes:", error)
    }
  }

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?")
    if (isConfirmed) {
      console.log("Deleting task with ID:", id)
      try {
        const response = await fetch(`http://localhost:8080/backend-servlet/DeleteTaskServlet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })

        if (response.ok) {
          console.log("Task deleted successfully")
          fetchTasks()
        } else {
          console.error("Error deleting task:", response.statusText)
        }
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-secondary"
      case "In Progress":
        return "bg-primary"
      case "Completed":
        return "bg-success"
      default:
        return "bg-secondary"
    }
  }

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-danger"
      case "Medium":
        return "bg-warning text-dark"
      case "Low":
        return "bg-info text-dark"
      default:
        return "bg-secondary"
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return "bi-exclamation-triangle-fill"
      case "Medium":
        return "bi-exclamation-circle"
      case "Low":
        return "bi-info-circle"
      default:
        return "bi-dash-circle"
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline"

    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date"

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    }

    // Otherwise return formatted date
    return date.toLocaleDateString()
  }

  // Check if a deadline is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false

    const date = new Date(dateString)
    const today = new Date()

    // Set both dates to midnight for comparison
    date.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    return date < today
  }

  // Filter and sort tasks
  const getFilteredAndSortedTasks = () => {
    return tasks
      .filter((task) => {
        // Apply status filter
        if (filterStatus !== "all" && task.status !== filterStatus) {
          return false
        }

        // Apply priority filter
        if (filterPriority !== "all" && task.priority !== filterPriority) {
          return false
        }

        // Apply project filter
        if (filterProject !== "all" && task.projectName !== filterProject) {
          return false
        }

        // Apply search term
        if (
          searchTerm &&
          !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !task.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === "deadline") {
          const dateA = new Date(a.deadline || "9999-12-31")
          const dateB = new Date(b.deadline || "9999-12-31")
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        } else if (sortBy === "priority") {
          const priorityOrder = { High: 3, Medium: 2, Low: 1 }
          const priorityA = priorityOrder[a.priority] || 0
          const priorityB = priorityOrder[b.priority] || 0
          return sortOrder === "asc" ? priorityA - priorityB : priorityB - priorityA
        } else if (sortBy === "title") {
          return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        }
        return 0
      })
  }

  // Group tasks by status for board view
  const getTasksByStatus = () => {
    const filteredTasks = getFilteredAndSortedTasks()
    const tasksByStatus = {
      "To Do": [],
      "In Progress": [],
      Completed: [],
    }

    filteredTasks.forEach((task) => {
      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(task)
      } else {
        tasksByStatus["To Do"].push(task)
      }
    })

    return tasksByStatus
  }

  // Get unique project names for filter
  const getUniqueProjectNames = () => {
    const projectNames = new Set()
    tasks.forEach((task) => {
      if (task.projectName) {
        projectNames.add(task.projectName)
      }
    })
    return Array.from(projectNames)
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

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Task Management</h2>
        <div className="d-flex">
          <div className="btn-group me-2">
            <button
              className={`btn ${viewMode === "board" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("board")}
            >
              <i className="bi bi-kanban me-1"></i> Board
            </button>
            <button
              className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("list")}
            >
              <i className="bi bi-list-ul me-1"></i> List
            </button>
          </div>
          {!isTeamMember && (
            <button className="btn btn-success" onClick={handleNewTaskClick}>
              <i className="bi bi-plus-lg me-1"></i> New Task
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
                <option value="all">All Projects</option>
                {getUniqueProjectNames().map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="deadline">Sort by Deadline</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="title">Sort by Title</option>
                </select>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  <i className={`bi bi-sort-${sortOrder === "asc" ? "down" : "up"}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No tasks available. Create a new task to get started.
        </div>
      ) : getFilteredAndSortedTasks().length === 0 ? (
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No tasks match your current filters.
        </div>
      ) : (
        <>
          {viewMode === "board" ? (
            // Board View
            <div className="row">
              {Object.entries(getTasksByStatus()).map(([status, statusTasks]) => (
                <div key={status} className="col-md-4 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className={`card-header bg-opacity-10 ${getStatusBadgeColor(status).replace("bg-", "bg-")}`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          <span className={`badge ${getStatusBadgeColor(status)} me-2`}>{statusTasks.length}</span>
                          {status}
                        </h5>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="task-list" style={{ maxHeight: "600px", overflowY: "auto" }}>
                        {statusTasks.map((task) => (
                          <div
                            key={task.id}
                            className="task-card p-3 border-bottom"
                            onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0 text-truncate" style={{ maxWidth: "80%" }}>
                                {task.title}
                              </h6>
                              <span className={`badge ${getPriorityBadgeColor(task.priority)}`}>
                                <i className={`bi ${getPriorityIcon(task.priority)} me-1`}></i>
                                {task.priority}
                              </span>
                            </div>

                            {selectedTask?.id === task.id ? (
                              <div className="mt-2">
                                <p className="text-muted small mb-2">{task.description}</p>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                  <div className="small">
                                    <i className="bi bi-calendar me-1"></i>
                                    <span className={isOverdue(task.deadline) ? "text-danger fw-bold" : ""}>
                                      {formatDate(task.deadline)}
                                      {isOverdue(task.deadline) && " (Overdue)"}
                                    </span>
                                  </div>
                                  {task.assignedTo && (
                                    <div className="small">
                                      <i className="bi bi-person me-1"></i>
                                      {task.assignedTo}
                                    </div>
                                  )}
                                  {task.projectName && (
                                    <div className="small">
                                      <i className="bi bi-folder me-1"></i>
                                      {task.projectName}
                                    </div>
                                  )}
                                </div>
                                <div className="d-flex mt-2">
                                  <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditClick(task)
                                    }}
                                  >
                                    <i className="bi bi-pencil me-1"></i>
                                    Edit
                                  </button>
                                  {!isTeamMember && (
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(task.id)
                                      }}
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="d-flex flex-wrap gap-2 mt-1">
                                <div className="small text-muted">
                                  <i className="bi bi-calendar me-1"></i>
                                  <span className={isOverdue(task.deadline) ? "text-danger" : ""}>
                                    {formatDate(task.deadline)}
                                  </span>
                                </div>
                                {task.assignedTo && (
                                  <div className="small text-muted">
                                    <i className="bi bi-person me-1"></i>
                                    {task.assignedTo}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Deadline</th>
                        <th>Assigned To</th>
                        <th>Project</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredAndSortedTasks().map((task) => (
                        <tr
                          key={task.id}
                          className={selectedTask?.id === task.id ? "table-active" : ""}
                          onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                        >
                          <td>
                            <div className="fw-bold">{task.title}</div>
                            {selectedTask?.id === task.id && (
                              <div className="small text-muted mt-1">{task.description}</div>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeColor(task.status)}`}>{task.status}</span>
                          </td>
                          <td>
                            <span className={`badge ${getPriorityBadgeColor(task.priority)}`}>
                              <i className={`bi ${getPriorityIcon(task.priority)} me-1`}></i>
                              {task.priority}
                            </span>
                          </td>
                          <td>
                            <span className={isOverdue(task.deadline) ? "text-danger fw-bold" : ""}>
                              {formatDate(task.deadline)}
                              {isOverdue(task.deadline) && " (Overdue)"}
                            </span>
                          </td>
                          <td>{task.assignedTo || "-"}</td>
                          <td>{task.projectName || "-"}</td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditClick(task)
                                }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              {!isTeamMember && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(task.id)
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
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

      {/* Edit Task Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Task
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-8">
                      <label className="form-label">Task Title</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-type"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          disabled={isTeamMember}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-check2-circle"></i>
                        </span>
                        <select
                          className="form-select"
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
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
                        disabled={isTeamMember}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Deadline</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-calendar"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          value={editData.deadline}
                          onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                          disabled={isTeamMember}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Priority</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-flag"></i>
                        </span>
                        <select
                          className="form-select"
                          value={editData.priority}
                          onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                          disabled={isTeamMember}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Project</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-folder"></i>
                        </span>
                        <select
                          className="form-select"
                          value={editData.projectName}
                          onChange={handleProjectChange}
                          disabled={isTeamMember}
                        >
                          <option value="">Select a project</option>
                          {projects.map((project) => (
                            <option key={project.projectId} value={project.name}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Assigned To</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <select
                        className="form-select"
                        value={editData.assignedTo}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            assignedTo: e.target.value,
                          })
                        }
                        disabled={isTeamMember}
                      >
                        <option value="">Select a team member</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                  <i className="bi bi-check-circle me-1"></i>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .task-card {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .task-card:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .card {
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        .task-list {
          scrollbar-width: thin;
        }
        .task-list::-webkit-scrollbar {
          width: 6px;
        }
        .task-list::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .task-list::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
        .task-list::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  )
}

export default TaskList

