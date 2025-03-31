import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import ProgressChart from "./ProgressChart"; // Assuming you have a ProgressChart component

function TeamMember_Dashboard() {
  const [teamMember, setTeamMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    // Fetch the logged-in user from the backend session (assuming servlet handles session and returns user info)
    const fetchTeamMemberData = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/ViewProfileServlet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Make sure session cookies are included
        });

        if (response.ok) {
          const memberData = await response.json();
          setTeamMember({
            name: memberData.name,
            Subrole: memberData.Subrole || "N/A",
            id: memberData.id || Date.now(), // Use existing id or generate one
          });
        } else {
          console.error("Failed to fetch team member data");
        }
      } catch (error) {
        console.error("Error fetching team member data:", error);
      }
    };

    // Fetch tasks assigned to the logged-in user
    const fetchAssignedTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/DashboardServlet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include session cookies for user context
        });

        if (response.ok) {
          const taskData = await response.json();
          
          // setTasks(taskData);
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
      }
    };

    // Call functions to fetch user data and assigned tasks
    fetchTeamMemberData();
    fetchAssignedTasks();
    
    setLoading(false); // Set loading state to false once data is fetched
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!teamMember) {
    return <div className="text-center mt-5">Loading Dashboard...</div>;
  }

  return (
    <div className="container mt-4" style={{width:"150%",margin:"auto"}}>
      <h2>Welcome, {teamMember.name} 👋</h2>
      <p className="text-muted">Sub-Role: {teamMember.Subrole}</p>

     {/* Task Statistics */}
     <div className="row">
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="card-text">{taskStats.totalTasks}</p>
            </div>
          </div>
        </div>


        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Completed Tasks</h5>
              <p className="card-text">{taskStats.completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">In Progress Tasks</h5>
              <p className="card-text">{taskStats.inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Tasks</h5>
              <p className="card-text">{taskStats.pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Progress Chart */}
      <ProgressChart
        completed={taskStats.completedTasks}
        inProgress={taskStats.inProgressTasks}
        pending={taskStats.pendingTasks}
      />

      {/* My Tasks Preview
      <h4>📋 My Tasks</h4>
      {tasks.length === 0 ? (
        <div className="alert alert-info">No tasks assigned yet.</div>
      ) : (
        <ul className="list-group">
          {tasks.slice(0, 5).map((task, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {task.title}
              <span className={`badge ${task.status === "Completed" ? "bg-success" : "bg-secondary"}`}>
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}

export default TeamMember_Dashboard;
