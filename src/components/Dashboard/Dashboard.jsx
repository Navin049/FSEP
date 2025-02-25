import React, { useState, useEffect } from "react";
import ProgressChart from "./ProgressChart";
import ActivityFeed from "./ActivityFeed";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    setTasks(storedTasks);
    setTeamMembers(storedMembers);
    setProjects(storedProjects);
  }, []);

  // Task statistics
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;
  const pendingTasks = tasks.filter((task) => task.status === "To Do").length;

  // Get upcoming deadlines
  const upcomingTasks = tasks
    .filter((task) => new Date(task.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Project Management Dashboard</h1>

      {/* Project Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Project Overview</h5>
          <p>Total Projects: {projects.length}</p>
          <p>Total Tasks: {tasks.length}</p>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="row">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Completed Tasks</h5>
              <p className="card-text">{completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">In Progress Tasks</h5>
              <p className="card-text">{inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Tasks</h5>
              <p className="card-text">{pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <ProgressChart completed={completedTasks} inProgress={inProgressTasks} pending={pendingTasks} />


      {/* Upcoming Deadlines */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Upcoming Deadlines</h5>
          {upcomingTasks.length > 0 ? (
            <ul className="list-group">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="list-group-item">
                  {task.title} - Due: {task.deadline}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming deadlines.</p>
          )}
        </div>
      </div>

      {/* Team Members List */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Team Members</h5>
          {teamMembers.length > 0 ? (
            <ul className="list-group">
              {teamMembers.map((member) => (
                <li key={member.id} className="list-group-item">
                  {member.name} - {member.role}
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members added.</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {/* <ActivityFeed /> */}

    
    </div>
  );
};

export default Dashboard;
