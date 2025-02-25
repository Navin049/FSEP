import React from "react";
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h3>Project Management System</h3>
      <ul>
      {/* <li><Link to="/">🏡 Home</Link></li><hr/> */}
      <li><Link to="/profile">👨🏻‍💻 profile</Link></li><hr />
        <li><Link to="/dashboard">📊 Dashboard</Link></li><hr />
        {/* <li><Link to="/progress-chart">📈 Progress</Link></li><hr />
        <li><Link to="/activity-feed">📜 Activity Feed</Link></li><hr /> */}

        {/* Projects Section */}
        <li className="has-submenu">
          📂 Projects
          <ul className="submenu">
            <li><Link to="/projects">All Projects</Link></li>
            <li><Link to="/projects/ProjectForm">➕ Add Project</Link></li>
          </ul>
        </li><hr />

        {/* Tasks Section */}
        <li className="has-submenu">
          ✅ Tasks
          <ul className="submenu">
            <li><Link to="/tasks">All Tasks</Link></li>
            <li><Link to="/tasks/TaskForm">➕ Add Task</Link></li>
          </ul>
        </li><hr />

        {/* Team Section */}
        <li className="has-submenu">
          👥 Team
          <ul className="submenu">
            <li><Link to="/team">All Members</Link></li>
            <li><Link to="/team/MemberForm">➕ Add Member</Link></li>
          </ul>
        </li><hr />
{/* 
        <li><Link to="/login">Login</Link></li><hr />
        <li><Link to="/register">Register</Link></li> */}
          <li ><Link to="/logout">⤵️ logout</Link></li>
      </ul>


      {/* Footer inside Sidebar */}
      <div className="sidebar-footer">
        © 2025 MyCompany
      </div>
    </nav>
  );
};

export default Sidebar;
