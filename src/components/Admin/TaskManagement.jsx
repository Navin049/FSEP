"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js"
import { Pie, Line } from "react-chartjs-2"
import AdminSidebar from "../Shared/AdminSidebar"
import { FaPlus, FaEye, FaPencilAlt, FaTrash, FaFilter, FaSearch } from "react-icons/fa"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

const TaskManagement = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [taskStatus, setTaskStatus] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [modalMode, setModalMode] = useState("view") // view, edit, add
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])

  // Fetch tasks data
  const fetchTasksData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/backend-servlet/TaskManagementServlet", {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Received tasks data:", data)
        setTasks(data.tasks || [])

        // Calculate task status counts
        const statusCounts = {
          completed: 0,
          inProgress: 0,
          toDo: 0,
        }

        data.tasks?.forEach((task) => {
          const status = task.status?.toLowerCase() || ""
          if (status.includes("complete")) statusCounts.completed++
          else if (status.includes("progress")) statusCounts.inProgress++
          else statusCounts.toDo++
        })

        setTaskStatus(statusCounts)



        // Extract Monthly Tasks Data
        const totalTasksData = Array(12).fill(0)
        const completedTasksData = Array(12).fill(0)
        if (data.monthlyTasks) {
          Object.keys(data.monthlyTasks).forEach((month) => {
            const monthIndex = Number.parseInt(month, 10) - 1
            if (monthIndex >= 0 && monthIndex < 12) {
              totalTasksData[monthIndex] = data.monthlyTasks[month]
            }
          })
        }
        if (data.completedTasks) {
          Object.keys(data.completedTasks).forEach((month) => {
            const monthIndex = Number.parseInt(month, 10) - 1
            if (monthIndex >= 0 && monthIndex < 12) {
              completedTasksData[monthIndex] = data.completedTasks[month]
            }
          })
        }

        // Update Chart Data
        updateCharts(totalTasksData, completedTasksData)


      } else {
        console.error("Failed to fetch tasks")
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects for task assignment
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/ProjectManagementServlet", {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      } else {
        console.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  // Fetch users for task assignment
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/UserManagementServlet", {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchTasksData()
    fetchProjects()
    fetchUsers()
  }, [])

  // Data for the "Task Status" Pie Chart
  const taskStatusData = {
    labels: ["Completed", "In Progress", "To Do"],
    datasets: [
      {
        data: [taskStatus?.completed || 0, taskStatus?.inProgress || 0, taskStatus?.toDo || 0],
        backgroundColor: ["#1cc88a", "#f6c23e", "#e74a3b"],
        hoverBackgroundColor: ["#17a673", "#dda20a", "#be2617"],
        borderWidth: 1,
      },
    ],
  }

  const [monthlyTasksData, setMonthlyTasksData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Tasks Created",
        data: new Array(12).fill(0),
        fill: false,
        borderColor: "#1cc88a",
        tension: 0.1,
      },
      {
        label: "Tasks Completed",
        data: new Array(12).fill(0),
        fill: false,
        borderColor: "#f6c23e",
        tension: 0.1,
      },
    ],
  })

  // Function to update task completion trend
  function updateCharts(totalTasksData, completedTasksData) {
    setMonthlyTasksData((prev) => ({
      ...prev,
      datasets: [
        { ...prev.datasets[0], data: totalTasksData },
        { ...prev.datasets[1], data: completedTasksData },
      ],
    }))
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

  // Handle task actions
  const handleViewTask = (task) => {
    setSelectedTask(task)
    setModalMode("view")
    setShowTaskModal(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setModalMode("edit")
    setShowTaskModal(true)
  }

  const handleAddTask = () => {
    setSelectedTask({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      deadline: "",
      // projectId: "",
      projectName:"",
      assignedTo: "",
    })
    setModalMode("add")
    setShowTaskModal(true)
  }

  const handleSaveTask = async () => {
    console.log("sending tasks data", selectedTask);
    try {
      const url =
        modalMode === "add"
          ? "http://localhost:8080/backend-servlet/AdminCreateTaskServlet"
          : "http://localhost:8080/backend-servlet/UpdateTaskServlet"

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTask),
        // credentials: "include",
      })

      if (response.ok) {
        setShowTaskModal(false)
        fetchTasksData() // Refresh the tasks list
      } else {
        console.error("Failed to save task:", response.statusText)
      }
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/DeleteTaskServlet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: taskId }),
          // credentials: "include",
        })

        if (response.ok) {
          fetchTasksData() // Refresh the tasks list
        } else {
          console.error("Failed to delete task:", response.statusText)
        }
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  // Helper functions for UI
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

  function getPriorityBadge(priority) {
    const lowerPriority = priority?.toLowerCase() // convert once

    switch (lowerPriority) {
      case "high":
        return <span className="badge bg-danger">High</span>
      case "medium":
        return <span className="badge bg-warning text-dark">Medium</span>
      case "low":
        return <span className="badge bg-info text-dark">Low</span>
      default:
        return <span className="badge bg-light text-dark">{priority}</span>
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Filter tasks based on search term, status and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.status?.toLowerCase().includes("complete")) ||
      (filterStatus === "inProgress" && task.status?.toLowerCase().includes("progress")) ||
      (filterStatus === "toDo" &&
        !task.status?.toLowerCase().includes("complete") &&
        !task.status?.toLowerCase().includes("progress"))
    const matchesPriority = filterPriority === "all" || task.priority?.toLowerCase() === filterPriority.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority
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
            <h2 className="mb-1">Task Management</h2>
            <p className="text-muted">Manage all your tasks in one place</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddTask}>
            <FaPlus className="me-2" />
            Add New Task
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
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select"
                style={{ maxWidth: "150px" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="toDo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="form-select"
                style={{ maxWidth: "150px" }}
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
                <h6 className="m-0 font-weight-bold text-primary">Task Status</h6>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Pie data={taskStatusData} options={chartOptions} />
                </div>
                <div className="mt-4 text-center small">
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-success"></i> Completed: {taskStatus.completed}
                  </span>
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-warning"></i> In Progress: {taskStatus.inProgress}
                  </span>
                  <span className="me-2">
                    <i className="bi bi-circle-fill text-danger"></i> To Do: {taskStatus.toDo}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Task Completion Trend</h6>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Line
                    data={monthlyTasksData}
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
        </div>

        <div className="card shadow">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Tasks</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.projectName}</td>
                        <td>{task.assignedTo}</td>
                        <td>{getStatusBadge(task.status)}</td>
                        <td>{getPriorityBadge(task.priority)}</td>
                        <td>{task.deadline}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-light" onClick={() => handleViewTask(task)}>
                              <FaEye />
                            </button>
                            <button className="btn btn-sm btn-light" onClick={() => handleEditTask(task)}>
                              <FaPencilAlt />
                            </button>
                            <button className="btn btn-sm btn-light" onClick={() => handleDeleteTask(task.id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "view" ? "Task Details" : modalMode === "edit" ? "Edit Task" : "Add New Task"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-8">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTask?.title || ""}
                        onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                        readOnly={modalMode === "view"}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={selectedTask?.status || ""}
                        onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                        disabled={modalMode === "view"}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={selectedTask?.description || ""}
                      onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                      readOnly={modalMode === "view"}
                    ></textarea>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={selectedTask?.priority || ""}
                        onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                        disabled={modalMode === "view"}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedTask?.deadline || ""}
                        onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
                        readOnly={modalMode === "view"}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Project</label>
                      <select
                        className="form-select"
                        value={selectedTask?.projectName || ""}
                        onChange={(e) => setSelectedTask({ ...selectedTask, projectName: e.target.value })}
                        disabled={modalMode === "view"}
                      >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                          <option key={project.projectName} value={project.projectName}>
                            {project.projectName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assigned To</label>
                    <select
                      className="form-select"
                      value={selectedTask?.assignedTo || ""}
                      onChange={(e) => setSelectedTask({ ...selectedTask, assignedTo: e.target.value })}
                      disabled={modalMode === "view"}
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user.id || user.email} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button type="button" className="btn btn-primary" onClick={handleSaveTask}>
                    {modalMode === "add" ? "Add Task" : "Save Changes"}
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

export default TaskManagement
