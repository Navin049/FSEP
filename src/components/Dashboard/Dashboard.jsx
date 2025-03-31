import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressChart from "./ProgressChart";
import ActivityFeed from "./ActivityFeed"; // Assuming you have this component

const Dashboard = ({ projectId }) => {
  const [tasks, setTasks] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]); // New state for upcoming deadlines
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) {
      console.log("Error: projectId is missing.");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/DashboardServlet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials (cookies) if needed
        });

        if (response.ok) {
          const data = await response.json();
          setTasks({
            totalTasks: data.totalTasks || 0,
            completedTasks: data.completedTasks || 0,
            inProgressTasks: data.inProgressTasks || 0,
            pendingTasks: data.pendingTasks || 0,
          });
          setProjects(data.totalProjects || 0);
          setUpcomingDeadlines(data.upcomingDeadlines || []); // Set the upcoming deadlines
          setLoading(false);
        } else {
          console.error("Failed to fetch dashboard data", response.status);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to fetch dashboard data. Please try again.");
        setLoading(false);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/GetAssignedMembersForProjectServlet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify({ projectId: projectId }),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched team members:", data);  // Log the data to check its structure
    
          // Access the 'members' array from the response object
          setTeamMembers(data.members || []); // Use the 'members' array from the response
        } else {
          console.error("Failed to fetch team members", response.status);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        alert("Failed to fetch team members. Please try again.");
      }
    };
    

    fetchDashboardData();
    fetchTeamMembers();
  }, [navigate, projectId]);

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
    <div className="container mt-4" style={{width:"200%",margin:"auto"}}>
      <h1 className="text-center mb-4">Project Management Dashboard</h1>

      {/* Project Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Project Overview</h5>
          <p>Total Projects: {projects}</p>
          <p>Total Tasks: {tasks.totalTasks}</p>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="row">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Completed Tasks</h5>
              <p className="card-text">{tasks.completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">In Progress Tasks</h5>
              <p className="card-text">{tasks.inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Tasks</h5>
              <p className="card-text">{tasks.pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <ProgressChart
        completed={tasks.completedTasks}
        inProgress={tasks.inProgressTasks}
        pending={tasks.pendingTasks}
      />

      {/* Team Members List */}
      {/* <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Team Members</h5>
          {teamMembers.length > 0 ? (
            <ul className="list-group">
              {teamMembers.map((member) => (
                <li key={member.id} className="list-group-item">
                  {member.name} - {member.Subrole}
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members added.</p>
          )}
        </div>
      </div> */}

      {/* Upcoming Deadlines */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Upcoming Deadlines</h5>
          {upcomingDeadlines.length > 0 ? (
            <ul className="list-group">
              {upcomingDeadlines.map((task) => (
                <li key={task.id} className="list-group-item">
                  <strong>{task.title}</strong> - Due: {new Date(task.deadline).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming deadlines.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
