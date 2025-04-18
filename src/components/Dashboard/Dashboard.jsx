import { useState, useEffect , useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProgressChart from "./ProgressChart";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const Dashboard = ({ projectId }) => {
  const [tasks, setTasks] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [totalProjects, setTotalProjects] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("week");
  const navigate = useNavigate();

  const dashboardRef = useRef(null); // Reference for the dashboard content

  const handleViewAllTasksClick = () => {
    // Navigate to the 'View All Tasks' page (assuming the route is '/tasks')
    navigate("/tasks"); // Adjust the path based on your routing configuration
  };

  useEffect(() => {
    // Early return if projectId is missing
    if (!projectId) {
      console.log("Error: projectId is missing.");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        const response = await fetch(
          `http://localhost:8080/backend-servlet/DashboardServlet?timeframe=${timeframe}`, // Pass timeframe to API
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
          console.log("Dashboard data received:", data);

          // Setting tasks data
          setTasks({
            totalTasks: data.totalTasks || 0,
            completedTasks: data.completedTasks || 0,
            inProgressTasks: data.inProgressTasks || 0,
            pendingTasks: data.pendingTasks || 0,
          });

          setTotalProjects(data.totalProjects || 0); // Set the total number of projects
          setProjects(
            Array.isArray(data.projectProgress) ? data.projectProgress : []
          );
          setUpcomingDeadlines(data.upcomingDeadlines || []); // Assuming it's an array
        } else {
          console.error("Failed to fetch dashboard data", response.status);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/backend-servlet/TeamMemberINProject",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ projectId: projectId }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members || []); // Assuming `members` is an array
        } else {
          console.error("Failed to fetch team members", response.status);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    const fetchUpcomingEvent = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/backend-servlet/GetUpcomingEventsServlet",
          {
            method: "GET", // Use GET request to fetch data
            headers: {
              "Content-Type": "application/json", // Set content type
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching events: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Upcoming Events:", data);

        setUpcomingEvents(data.upcomingEvents);
      } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvent();

    // Fetch the dashboard data and team members
    fetchDashboardData();
    fetchTeamMembers();
  }, [navigate, projectId]); // Dependencies include navigate and projectId

  // Calculate completion percentage
  const completionPercentage =
    tasks.totalTasks > 0
      ? Math.round((tasks.completedTasks / tasks.totalTasks) * 100)
      : 0;

  // Get today's date for the greeting
  const today = new Date();
  const hours = today.getHours();
  let greeting = "Good Morning";
  if (hours >= 12 && hours < 18) {
    greeting = "Good Afternoon";
  } else if (hours >= 18) {
    greeting = "Good Evening";
  }

  // Format date
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Mock data for activity timeline
  const activityTimeline = [];

  // Mock data for team workload
  const teamWorkload = teamMembers.map((member, index) => {
    const randomTaskCount = Math.floor(Math.random() * 10) + 1;
    const randomCompletedCount = Math.floor(Math.random() * randomTaskCount);
    return {
      ...member,
      assignedTasks: randomTaskCount,
      completedTasks: randomCompletedCount,
      progress: Math.round((randomCompletedCount / randomTaskCount) * 100),
    };
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
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
      pdf.save("Dashboard_Report.pdf");
    });
  };


  return (
    <div className="container-fluid py-4" ref={dashboardRef}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">{greeting}!</h2>
              <p className="text-muted">{formattedDate}</p>
            </div>
            <div className="d-flex">
              <button className="btn btn-success" onClick={generatePDF}>
                <i className="bi bi-download me-2"></i>Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <i className="bi bi-grid-1x2-fill me-2"></i>Overview
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Projects
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totalProjects}
                      </div>
                      <div className="mt-2 text-success small">
                        {/* <i className="bi bi-arrow-up me-1"></i> */}
                        {/* <span>3.48% Since last month</span> */}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="bg-primary bg-opacity-10 p-3 rounded">
                        <i className="bi bi-folder-fill text-primary fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Completed Tasks
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {tasks.completedTasks}
                      </div>
                      <div className="mt-2 text-success small">
                        {/* <i className="bi bi-arrow-up me-1"></i> */}
                        {/* <span>12% Since last week</span> */}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="bg-success bg-opacity-10 p-3 rounded">
                        <i className="bi bi-check-circle-fill text-success fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        In Progress
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {tasks.inProgressTasks}
                      </div>
                      <div className="mt-2 text-warning small">
                        {/* <i className="bi bi-arrow-right me-1"></i>
                        <span>Steady progress</span> */}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="bg-warning bg-opacity-10 p-3 rounded">
                        <i className="bi bi-clock-fill text-warning fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                        Pending Tasks
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {tasks.pendingTasks}
                      </div>
                      <div className="mt-2 text-danger small">
                        {/* <i className="bi bi-arrow-down me-1"></i>
                        <span>5% Since last week</span> */}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="bg-danger bg-opacity-10 p-3 rounded">
                        <i className="bi bi-exclamation-circle-fill text-danger fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Progress and Upcoming Deadlines */}
          <div className="row mb-4">
            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">Project Progress</h6>
                </div>
                <div className="card-body">
                  <div className="row align-items-center mb-4">
                    <div className="col-md-6">
                      <h4 className="mb-0">Overall Completion</h4>
                      <p className="text-muted">
                        Project tasks completion rate
                      </p>
                      <div className="d-flex align-items-center">
                        <h1 className="display-4 mb-0 me-3">
                          {completionPercentage}%
                        </h1>
                        <div className="text-success">
                          {/* <i className="bi bi-arrow-up me-1"></i> */}
                          {/* <span>8% from last period</span> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <ProgressChart
                        completed={tasks.completedTasks}
                        inProgress={tasks.inProgressTasks}
                        pending={tasks.pendingTasks}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mt-4">
                    <h6 className="mb-3">Project Status</h6>
                    {projects.map((project) => (
                      <div key={project.id} className="mb-4">
                        <div className="d-flex justify-content-between mb-1">
                          <span>{project.project_name}</span>
                          <span>{project.completionPercentage}%</span>
                        </div>
                        <div className="progress" style={{ height: "10px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{
                              width: `${project.completionPercentage}%`,
                            }}
                            aria-valuenow={project.completionPercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 font-weight-bold">Upcoming Deadlines</h6>
                </div>
                <div className="card-body p-0">
                  {upcomingDeadlines.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {upcomingDeadlines.map((task) => {
                        const dueDate = new Date(task.deadline);
                        const today = new Date();
                        const diffTime = dueDate - today;
                        const diffDays = Math.ceil(
                          diffTime / (1000 * 60 * 60 * 24)
                        );
                        let badgeClass = "bg-success";

                        if (diffDays <= 1) {
                          badgeClass = "bg-danger";
                        } else if (diffDays <= 3) {
                          badgeClass = "bg-warning";
                        }

                        return (
                          <div
                            key={task.id}
                            className="list-group-item border-0 border-bottom py-3"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1">{task.title}</h6>
                                <p className="text-muted small mb-0">
                                  Due: {dueDate.toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`badge ${badgeClass}`}>
                                {diffDays <= 0
                                  ? "Today"
                                  : diffDays === 1
                                  ? "Tomorrow"
                                  : `${diffDays} days`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-calendar-check text-muted fs-1"></i>
                      <p className="mt-2 text-muted">No upcoming deadlines</p>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white py-3">
                  <a
                    onClick={handleViewAllTasksClick}
                    className="btn btn-sm btn-outline-primary w-100"
                  >
                    View All Tasks
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-3 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">Upcoming Events</h6>
                  {/* <button   onClick={() => setActiveTab("calendar")} className="btn btn-sm btn-outline-primary">
                    View Calendar
                  </button> */}
                </div>
                <div className="card-body p-0">
                  {upcomingEvents.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="list-group-item border-0 border-bottom py-3"
                        >
                          <div className="d-flex align-items-center">
                            <div
                              className={`bg-${
                                event.type === "meeting"
                                  ? "primary"
                                  : event.type === "deadline"
                                  ? "danger"
                                  : "info"
                              } bg-opacity-10 p-2 rounded me-3`}
                            >
                              <i
                                className={`bi bi-${
                                  event.type === "meeting"
                                    ? "people"
                                    : event.type === "deadline"
                                    ? "calendar-check"
                                    : "code-square"
                                } text-${
                                  event.type === "meeting"
                                    ? "primary"
                                    : event.type === "deadline"
                                    ? "danger"
                                    : "info"
                                }`}
                              ></i>
                            </div>
                            <div>
                              <h6 className="mb-0">{event.title}</h6>
                              <small className="text-muted">
                                {event.eventDate}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-calendar text-muted fs-1"></i>
                      <p className="mt-2 text-muted">No upcoming events</p>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white py-3">
                  {/* <button className="btn btn-sm btn-outline-primary w-100">
                    <i className="bi bi-plus-lg me-1"></i>Add Event
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
