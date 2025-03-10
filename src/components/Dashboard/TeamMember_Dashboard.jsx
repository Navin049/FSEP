import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

function TeamMember_Dashboard() {
  const [teamMember, setTeamMember] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // ✅ Fetch user data from "users" key
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // Get logged-in user

    if (loggedInUser) {
      // ✅ Find matching user by email
      const member = storedUsers.find((m) => m.email === loggedInUser.email);

      if (member) {
        // ✅ Only pick name, Subrole, and id
        setTeamMember({
          name: member.name,
          Subrole: member.Subrole || "N/A",
          id: member.id || Date.now(), // Use existing id or generate one
        });
      } else {
        console.warn("No matching team member found");
      }

      // ✅ Fetch assigned tasks
      const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const assignedTasks = allTasks.filter(task => task.assignedTo === loggedInUser.name);
      setTasks(assignedTasks);
    } else {
      console.warn("No logged-in user found");
    }
  }, []);

  if (!teamMember) {
    return <div className="text-center mt-5">Loading Dashboard...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Welcome, {teamMember.name} 👋</h2>
      {/* <p className="text-muted">ID: {teamMember.id}</p> */}
      <p className="text-muted">Sub-Role: {teamMember.Subrole}</p>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="card-text">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Completed Tasks</h5>
              <p className="card-text">{tasks.filter(t => t.status === "Completed").length}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Tasks</h5>
              <p className="card-text">{tasks.filter(t => t.status !== "Completed").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Tasks Preview */}
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
      )}
    </div>
  );
}

export default TeamMember_Dashboard;
