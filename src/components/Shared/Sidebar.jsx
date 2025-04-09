import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h3>Project Management System</h3>
      <ul>
        {/* <li><Link to="/">🏡 Home</Link></li><hr/> */}
        <li>
          <Link to="/profile">👨🏻‍💻 profile</Link>
        </li>
        <hr />
        <li>
          <Link to="/dashboard">📊 Dashboard</Link>
        </li>
        <hr />
        {/* <li><Link to="/progress-chart">📈 Progress</Link></li><hr />
        <li><Link to="/activity-feed">📜 Activity Feed</Link></li><hr /> */}

        {/* Projects Section */}

        <li>
          <Link to="/projects"> 📂 Projects</Link>
        </li>
        {/* <li><Link to="/projects/ProjectForm">➕ Add Project</Link></li> */}

        <hr />

        {/* Tasks Section */}

        <li>
          <Link to="/tasks"> ✅ Tasks</Link>
        </li>
        {/* <li><Link to="/tasks/TaskForm">➕ Add Task</Link></li> */}

        <hr />
        <li>
          <Link to="/CreateEventForm">📜 Events</Link>
        </li>
        <hr />
        {/* Team Section */}

        <li>
          <Link to="/team">👥 Team</Link>
        </li>
        {/* <li><Link to="/team/MemberForm">➕ Add Member</Link></li> */}

        <hr />
        {/* 
        <li><Link to="/login">Login</Link></li><hr />
        <li><Link to="/register">Register</Link></li> */}
        <li>
          <Link to="/logout">⤵️ logout</Link>
        </li>
      </ul>

      {/* Footer inside Sidebar */}
      <div className="sidebar-footer">© 2025 Project Management System</div>
    </nav>
  );
};

export default Sidebar;
