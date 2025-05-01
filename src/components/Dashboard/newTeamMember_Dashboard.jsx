import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProgressChart from "./ProgressChart";
import { useNavigate } from "react-router-dom";
import "../../App.css";

function TeamMember_Dashboard({ projectId }) {
  const [teamMember, setTeamMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("week");
  const [projects, setProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const handleViewAllTasksClick = () => {
    // Navigate to the 'View All Tasks' page (assuming the route is '/tasks')
    navigate("/tasks"); // Adjust the path based on your routing configuration
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = loggedInUser ? loggedInUser.userId : null;

    // Fetch the logged-in user from the backend session
    const fetchTeamMemberData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/backend-servlet/ViewProfileServlet",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const memberData = await response.json();
          setTeamMember({
            name: memberData.name,
            Subrole: memberData.Subrole || "Team Member",
            id: memberData.id || Date.now(),
            email: memberData.email || "user@example.com",
            profilePic: memberData.profilePic || null,
            experienceLevel: memberData.experienceLevel || "Junior",
          });
        } else {
          console.error("Failed to fetch team member data");
        }
      } catch (error) {
        console.error("Error fetching team member data:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        console.log("Fetching tasks...");
        const response = await fetch(
          "http://localhost:8888/backend-servlet/ViewTaskServlet",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("Fetched tasks:", data);
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Fetch tasks assigned to the logged-in user
    const fetchAssignedTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/backend-servlet/TeamMemberDashboardServlet",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const taskData = await response.json();

          setTaskStats({
            totalTasks: taskData.totalTasks || 0,
            completedTasks: taskData.completedTasks || 0,
            inProgressTasks: taskData.inProgressTasks || 0,
            pendingTasks: taskData.pendingTasks || 0,
          });
        } else {
          console.error("Failed to fetch assigned tasks");
        }
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId !== null && userId !== null) {
      const fetchProjectDetails = async () => {
        try {
          console.log("Sending projectId:", projectId, "userId:", userId);
          const response = await fetch(
            "http://localhost:8888/backend-servlet/GetAssignedMembersForProjectServlet",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ projectId, userId }),
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch project details");
          }

          const projectData = await response.json();
          console.log("Received project data:", projectData);

          setProjects(projectData.projects);
        } catch (error) {
          setError("Error fetching project details");
        }
      };

      fetchProjectDetails();
    }

    const fetchUpcomingEvent = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/backend-servlet/GetUpcomingEventsServlet",
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
    fetchTeamMemberData();
    fetchAssignedTasks();
    fetchTasks();
  }, [projectId]);

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

  // Calculate completion percentage
  const completionPercentage =
    taskStats.totalTasks > 0
      ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)
      : 0;

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-danger";
      case "medium":
        return "bg-warning text-dark";
      case "low":
        return "bg-info text-dark";
      default:
        return "bg-secondary";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success";
      case "in progress":
        return "bg-warning text-dark";
      case "pending":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const renderCalendar = (year, month, events) => {
    // Get the first day of the month (e.g., if it's a Sunday or Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    // Prepare an array for the days (in total, the calendar grid will have 42 slots: 6 rows of 7 days each)
    const calendarDays = [];
    let dayCount = 1;
  
    // Add empty slots for the days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null); // Empty slots
    }
  
    // Add the actual days of the month
    while (dayCount <= daysInMonth) {
      calendarDays.push(dayCount);
      dayCount++;
    }
  
    // Add empty slots for the days after the end of the month (if the month doesn't fit exactly into 6 rows)
    while (calendarDays.length < 42) {
      calendarDays.push(null);
    }
  
    // Generate the calendar table rows and cells
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        const day = calendarDays[i * 7 + j];
  
        // Filter events for the specific day, month, and year
        const eventOnDay = events.filter((event) => {
          const eventDate = new Date(event.eventDate);
          return (
            eventDate.getDate() === day &&
            eventDate.getMonth() === month &&
            eventDate.getFullYear() === year
          );
        });
  
        row.push(
          <td
            key={`${year}-${month}-${day}`}
            className={eventOnDay.length > 0 ? "event-day" : ""}
            onClick={() => handleDayClick(day, events)}
          >
            {day && (
              <>
                <div>{day}</div>
                {eventOnDay.map((event, idx) => (
                  <div key={idx} className="event-indicator">
                    <span className="event-title">{event.type}</span>
                  </div>
                ))}
              </>
            )}
          </td>
        );
      }
      rows.push(<tr key={i}>{row}</tr>);
    }
  
    return rows;
  };
  
  const changeMonth = (direction) => {
    if (direction === "next") {
      setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
      if (currentMonth === 11) setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
      if (currentMonth === 0) setCurrentYear(currentYear - 1);
    }
  };
  
  const handleDayClick = (day, events) => {
    const eventDetails = events.filter(
      (event) => new Date(event.eventDate).getDate() === day
    );
    console.log(eventDetails);
    // Display event details (perhaps in a modal or separate section)
  };
  
  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                {greeting}, {teamMember?.name || "Team Member"}!
              </h2>
              <p className="text-muted">{formattedDate}</p>
            </div>
            <div className="d-flex">
              <div className="btn-group me-3">
                <button
                  className={`btn ${
                    timeframe === "week" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setTimeframe("week")}
                >
                  Week
                </button>
                <button
                  className={`btn ${
                    timeframe === "month"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setTimeframe("month")}
                >
                  Month
                </button>
                <button
                  className={`btn ${
                    timeframe === "year" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setTimeframe("year")}
                >
                  Year
                </button>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-light position-relative"
                  type="button"
                  id="notificationsDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-bell"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {/* {notifications.filter((n) => !n.read).length} */}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="notificationsDropdown"
                  style={{ minWidth: "300px" }}
                >
                  <li>
                    <h6 className="dropdown-header">Notifications</h6>
                  </li>
                  {/* {notifications.map((notification) => (
                    <li key={notification.id}>
                      <a className={`dropdown-item ${!notification.read ? "bg-light" : ""}`} href="#">
                        <div className="d-flex align-items-center">
                          <div
                            className={`bg-${notification.type === "task" ? "primary" : notification.type === "meeting" ? "success" : notification.type === "reminder" ? "warning" : "info"} bg-opacity-10 p-2 rounded me-3`}
                          >
                            <i
                              className={`bi bi-${notification.type === "task" ? "clipboard-check" : notification.type === "meeting" ? "calendar-event" : notification.type === "reminder" ? "alarm" : "chat-dots"} text-${notification.type === "task" ? "primary" : notification.type === "meeting" ? "success" : notification.type === "reminder" ? "warning" : "info"}`}
                            ></i>
                          </div>
                          <div>
                            <p className="mb-0 small">{notification.message}</p>
                            <small className="text-muted">{notification.time}</small>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))} */}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item text-center" href="#">
                      View all notifications
                    </a>
                  </li>
                </ul>
              </div>
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
            {/* <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                <i className="bi bi-check2-square me-2"></i>My Tasks
              </button>
            </li> */}
            {/* <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
                onClick={() => setActiveTab("projects")}
              >
                <i className="bi bi-folder2-open me-2"></i>Projects
              </button>
            </li> */}
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "calendar" ? "active" : ""
                }`}
                onClick={() => setActiveTab("calendar")}
              >
                <i className="bi bi-calendar-week me-2"></i>Calendar
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Task Statistics */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-0 shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Tasks
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {taskStats.totalTasks}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="bg-primary bg-opacity-10 p-3 rounded">
                        <i className="bi bi-list-check text-primary fs-3"></i>
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
                        {taskStats.completedTasks}
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
                        {taskStats.inProgressTasks}
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
                        {taskStats.pendingTasks}
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

          {/* Progress and Upcoming Events */}
          <div className="row mb-4">
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 font-weight-bold">My Progress</h6>
                </div>
                <div className="card-body">
                  <div className="row align-items-center mb-4">
                    <div className="col-md-6">
                      <h4 className="mb-0">Task Completion</h4>
                      <p className="text-muted">Your task completion rate</p>
                      <div className="d-flex align-items-center">
                        <h1 className="display-4 mb-0 me-3">
                          {completionPercentage}%
                        </h1>
                      </div>
                      <div className="mt-4">
                        <h6 className="mb-2">Task Breakdown</h6>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Completed</span>
                            <span>{taskStats.completedTasks} tasks</span>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: `${
                                  (taskStats.completedTasks /
                                    taskStats.totalTasks) *
                                  100
                                }%`,
                              }}
                              aria-valuenow={taskStats.completedTasks}
                              aria-valuemin="0"
                              aria-valuemax={taskStats.totalTasks}
                            ></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>In Progress</span>
                            <span>{taskStats.inProgressTasks} tasks</span>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              style={{
                                width: `${
                                  (taskStats.inProgressTasks /
                                    taskStats.totalTasks) *
                                  100
                                }%`,
                              }}
                              aria-valuenow={taskStats.inProgressTasks}
                              aria-valuemin="0"
                              aria-valuemax={taskStats.totalTasks}
                            ></div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Pending</span>
                            <span>{taskStats.pendingTasks} tasks</span>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-danger"
                              role="progressbar"
                              style={{
                                width: `${
                                  (taskStats.pendingTasks /
                                    taskStats.totalTasks) *
                                  100
                                }%`,
                              }}
                              aria-valuenow={taskStats.pendingTasks}
                              aria-valuemin="0"
                              aria-valuemax={taskStats.totalTasks}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <ProgressChart
                        completed={taskStats.completedTasks}
                        inProgress={taskStats.inProgressTasks}
                        pending={taskStats.pendingTasks}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">Upcoming Events</h6>
                  <button   onClick={() => setActiveTab("calendar")} className="btn btn-sm btn-outline-primary">
                    View Calendar
                  </button>
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
                              <small className="text-muted">{event.eventDate}</small>
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

          {/* Recent Tasks and Projects */}
          <div className="row">
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">Recent Tasks</h6>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleViewAllTasksClick}
                  >
                    View All
                  </button>
                </div>
                <div className="card-body p-0">
                  {tasks.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Task</th>
                            <th>Project</th>
                            <th>Due Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.slice(0, 5).map((task) => (
                            <tr key={task.id}>
                              <td>{task.title}</td>
                              <td>{task.projectName}</td>
                              <td>
                                {new Date(task.deadline).toLocaleDateString()}
                              </td>
                              <td>
                                <span
                                  className={`badge ${getPriorityBadgeColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${getStatusBadgeColor(
                                    task.status
                                  )}`}
                                >
                                  {task.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-clipboard text-muted fs-1"></i>
                      <p className="mt-2 text-muted">No tasks assigned yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 font-weight-bold">My Projects</h6>
                </div>
                <div className="card-body p-0">
                  {projects.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {projects.map((project) => (
                        <div
                          key={project.projectId}
                          className="list-group-item border-0 border-bottom py-3"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div
                                className={`bg-primary bg-opacity-10 p-2 rounded me-3`}
                              >
                                <i className="bi bi-folder2 text-primary"></i>
                              </div>
                              <h6 className="mb-0">{project.projectName}</h6>
                            </div>
                            <button className="btn btn-sm btn-light">
                              <i className="bi bi-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-folder text-muted fs-1"></i>
                      <p className="mt-2 text-muted">No projects assigned</p>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white py-3">
                  {/* <button
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => setActiveTab("projects")}
                  >
                    View All Projects
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Calendar Tab Content */}
      {activeTab === "calendar" && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card border-0 shadow">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold">My Calendar</h6>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2">
                    <i className="bi bi-filter me-1"></i>Filter
                  </button>
                  <button className="btn btn-sm btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>Add Event
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-12 text-center">
                    <div className="btn-group">
                    <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => changeMonth("prev")}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                      <button className="btn btn-outline-primary" disabled>
                        {`${new Date(currentYear, currentMonth).toLocaleString(
                          "default",
                          { month: "long" }
                        )} ${currentYear}`}
                      </button>
                      <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => changeMonth("next")}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render the calendar dynamically */}
                      {renderCalendar(
                        currentYear,
                        currentMonth,
                        upcomingEvents
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <h6 className="mb-3">Upcoming Events</h6>
                  <div className="list-group">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="list-group-item border-0 border-start border-4 border-primary rounded-0 mb-2 shadow-sm"
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{event.title}</h6>
                          <small>{event.eventDate}</small>
                        </div>
                        <p className="mb-1 small text-muted">
                        {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamMember_Dashboard;
