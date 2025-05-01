"use client"

import { useEffect, useState, useRef } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
} from "chart.js"
import { Pie, Line } from "react-chartjs-2"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import AdminSidebar from "../Shared/AdminSidebar"
import { FaDownload } from "react-icons/fa"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
)

const AdminDashboard = () => {
  const [userCounts, setUserCounts] = useState({})
  const [projectsCount, setProjectsCount] = useState(0)
  const [tasksCount, setTasksCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("week")
  const [projectStatus, setProjectStatus] = useState({})
  const [taskStatus, setTaskStatus] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const taskChartRef = useRef(null)
  const dashboardRef = useRef(null); // Reference for the dashboard content

  // Fetch the data from the backend servlet
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/backend-servlet/AdminDashboardServlet")

      if (response.ok) {
        const data = await response.json()
        console.log("Received data:", data)

        // Set user counts
        setUserCounts({
          "Project manager": data["Project manager"] || 0,
          "Team Member": data["Team Member"] || 0,
        })

        // Set project and task counts
        setProjectsCount(data.projects || 0)
        setTasksCount(data.tasks || 0)

        // Update project status counts dynamically
        setProjectStatus({
          completed: data.projectStatus?.Completed || 0,
          inProgress: data.projectStatus?.["In Progress"] || 0,
          toDo: data.projectStatus?.["to Do"] || 0,
        })

        // Update task status counts dynamically
        setTaskStatus({
          completed: data.taskStatus?.["Completed"] || 0,
          inProgress: data.taskStatus?.["In Progress"] || 0,
          toDo: data.taskStatus?.["To Do"] || 0,
        })

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
        console.error("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/AdminRecentActivityServlet")
      if (response.ok) {
        const data = await response.json()
        console.log("Received activities data:", data)
        setRecentActivity(data || [])
      } else {
        console.error("Failed to fetch recent activity")
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    }
  }

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

  // Data for the "Projects Status" Pie Chart
  const projectStatusData = {
    labels: ["In Progress", "Completed", "To Do"], // Updated labels
    datasets: [
      {
        data: [
          projectStatus?.inProgress || 0, // Corrected key
          projectStatus?.completed || 0,
          projectStatus?.toDo || 0, // Added "To Do"
        ],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
        hoverBackgroundColor: ["#2e59d9", "#17a673", "#258f99"],
        borderWidth: 1,
      },
    ],
  }

  // Data for the "Task Status" Doughnut Chart
  const taskStatusData = {
    labels: ["Completed", "In Progress", "To Do"], // Updated labels
    datasets: [
      {
        data: [
          taskStatus?.completed || 0, // Corrected key (capital C)
          taskStatus?.inProgress || 0, // Corrected key
          taskStatus?.toDo || 0, // Corrected key
        ],
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

  // Function to update charts dynamically
  function updateCharts(totalTasksData, completedTasksData) {
    setMonthlyTasksData((prev) => ({
      ...prev,
      datasets: [
        { ...prev.datasets[0], data: totalTasksData },
        { ...prev.datasets[1], data: completedTasksData },
      ],
    }))
  }

  useEffect(() => {
    fetchDashboardData()
    fetchRecentActivity()
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

  // Get today's date for the greeting
  const today = new Date()
  const hours = today.getHours()
  let greeting = "Good Morning"
  if (hours >= 12 && hours < 18) {
    greeting = "Good Afternoon"
  } else if (hours >= 18) {
    greeting = "Good Evening"
  }

  // Format date
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  const formattedDate = today.toLocaleDateString("en-US", options)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

   const generatePDF = () => {
      const input = dashboardRef.current;
  
      if (!input) {
        console.error("Dashboard content is missing!");
        return;
      }
  
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
        pdf.save("Admin_Dashboard_Report.pdf");
      });
    };
  

  return (
    <div className="admin-layout"  ref={dashboardRef}>
      <AdminSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        {/* Header Section */}
        <div className="dashboard-header">
          <div>
            <h2 className="mb-1">{greeting}, Admin!</h2>
            <p className="text-muted">{formattedDate}</p>
          </div>
          <div className="d-flex">
            {/* <div className="btn-group me-3">
              <button
                className={`btn ${timeframe === "week" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimeframe("week")}
              >
                Week
              </button>
              <button
                className={`btn ${timeframe === "month" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimeframe("month")}
              >
                Month
              </button>
              <button
                className={`btn ${timeframe === "year" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setTimeframe("year")}
              >
                Year
              </button>
            </div> */}
            <button className="btn btn-success" onClick={generatePDF}>
              <FaDownload className="me-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Content */}
        <>
          {/* Key Metrics Cards */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Users</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {userCounts["Project manager"] + userCounts["Team Member"]}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-people-fill fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Projects</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{projectsCount}</div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-folder-fill fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Total Tasks</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{tasksCount}</div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-list-check fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Completion Rate</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {taskStatus.completed
                          ? Math.round(
                              (taskStatus.completed /
                                (taskStatus.completed + taskStatus.inProgress + taskStatus.toDo)) *
                                100,
                            )
                          : 0}
                        %
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-check-circle-fill fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row mb-4">
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Monthly Overview</h6>
                  <div className="dropdown no-arrow">
                    {/* <button
                      className="btn btn-sm btn-light dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button> */}
                    {/* <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                      <li>
                        <a className="dropdown-item" href="#">
                          View Details
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Export Data
                        </a>
                      </li>
                    </ul> */}
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <Line
                      ref={taskChartRef}
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

            <div className="col-xl-4 col-lg-5">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">User Distribution</h6>
                  <div className="dropdown no-arrow">
                    {/* <button
                      className="btn btn-sm btn-light dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button> */}
                    {/* <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                      <li>
                        <a className="dropdown-item" href="#">
                          View Details
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Export Data
                        </a>
                      </li>
                    </ul> */}
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <Pie data={userTypeData} options={chartOptions} />
                  </div>
                  <div className="mt-4 text-center small">
                    <span className="me-2">
                      <i className="bi bi-circle-fill text-primary"></i> Project Managers:{" "}
                      {userCounts["Project manager"]}
                    </span>
                    <span className="me-2">
                      <i className="bi bi-circle-fill text-info"></i> Team Members: {userCounts["Team Member"]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Status and Task Status */}
          <div className="row mb-4">
            <div className="col-lg-6 mb-4">
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

            <div className="col-lg-6 mb-4">
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
          </div>

          {/* Recent Activity */}
          <div className="row">
            <div className="col-lg-12 mb-4">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Recent Activity</h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="list-group-item border-0 border-bottom py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className={`bg-${
                                activity.type.includes("Project")
                                  ? "primary"
                                  : activity.type.includes("Task")
                                    ? "success"
                                    : "info"
                              } bg-opacity-10 p-2 rounded me-3`}
                            >
                              <i
                                className={`bi bi-${
                                  activity.type.includes("Project")
                                    ? "folder"
                                    : activity.type.includes("Task")
                                      ? "check-square"
                                      : "calendar-event"
                                } text-${
                                  activity.type.includes("Project")
                                    ? "primary"
                                    : activity.type.includes("Task")
                                      ? "success"
                                      : "info"
                                }`}
                              ></i>
                            </div>
                            <div>
                              <p className="mb-1">
                                <strong>{activity.actor}</strong> {activity.type} <strong>{activity.title}</strong>
                              </p>
                              <small className="text-muted">{new Date(activity.activityTime).toLocaleString()}</small>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No recent activity found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

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

        .border-left-primary {
          border-left: 0.25rem solid #4e73df !important;
        }

        .border-left-success {
          border-left: 0.25rem solid #1cc88a !important;
        }

        .border-left-info {
          border-left: 0.25rem solid #36b9cc !important;
        }

        .border-left-warning {
          border-left: 0.25rem solid #f6c23e !important;
        }

        .text-xs {
          font-size: 0.7rem;
        }

        .text-gray-800 {
          color: #5a5c69 !important;
        }

        .text-gray-300 {
          color: #dddfeb !important;
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

export default AdminDashboard
