import React from 'react'
import { Link } from "react-router-dom";


function Team_Member_Sidebar() {
  return (
    <nav className="sidebar">
    <h3>Project Management System</h3>
    <ul>
      <li><Link to="/profile">👨🏻‍💻 Profile</Link></li><hr />
      <li><Link to="/Dashboard/TeamMember_Dashboard">📊 Dashboard</Link></li><hr />

      {/* Tasks Section */}
      <li className="has-submenu">
        ✅ Tasks
        <ul className="submenu">
          <li><Link to="/tasks">My Tasks</Link></li>  {/* Only assigned tasks */}
        </ul>
      </li><hr />

      {/* Team Section */}
      <li><Link to="/team">👥 Team Members</Link></li><hr /> {/* View only */}

      <li><Link to="/logout">⤵️ Logout</Link></li>
    </ul>

    {/* Footer inside Sidebar */}
    <div className="sidebar-footer">
      © 2025 MyCompany
    </div>
  </nav>
);
};

export default Team_Member_Sidebar;