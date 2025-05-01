import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaChartBar,
  FaTasks,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Team_Member_Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      if (!collapsed) {
        mainContent.classList.add("collapsed");
      } else {
        mainContent.classList.remove("collapsed");
      }
    }
  };

  const menuItems = [
    { path: "/profile", icon: <FaUserCircle />, label: "Profile" },
    { path: "/TeamMember_Dashboard", icon: <FaChartBar />, label: "Dashboard" },
    { path: "/tasks", icon: <FaTasks />, label: "My Tasks" },
    { path: "/team/TeamMembers", icon: <FaUsers />, label: "Team Members" },
    { path: "/logout", icon: <FaSignOutAlt />, label: "Logout", divider: true },
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!collapsed && <h2>Project System</h2>}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
      </div>

      <div className="sidebar-menu">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={item.divider ? "with-divider" : ""}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
                title={collapsed ? item.label : ""}
              >
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          © 2025 MyCompany
        </div>
      )}

      {/* Style */}
      <style jsx>{`
        .admin-sidebar {
          background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
          color: #fff;
          height: 100vh;
          width: 250px;
          position: fixed;
          left: 0;
          top: 0;
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .admin-sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-container h2 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-menu {
          flex: 1;
          overflow-y: auto;
          padding-top: 10px;
        }

        .sidebar-menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-menu li {
          margin: 5px 0;
        }

        .sidebar-menu li.with-divider {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 15px;
          padding-top: 15px;
        }

        .sidebar-menu a {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .sidebar-menu a:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .sidebar-menu a.active {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
          border-left: 3px solid #3498db;
        }

        .sidebar-menu .icon {
          font-size: 1.2rem;
          min-width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-menu .label {
          margin-left: 10px;
          white-space: nowrap;
        }

        .sidebar-footer {
          padding: 10px 20px;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 70px;
          }

          .admin-sidebar:not(.collapsed) {
            width: 250px;
          }
        }

        .main-content {
          margin-left: 250px;
          transition: margin-left 0.3s ease;
        }

        .main-content.collapsed {
          margin-left: 70px;
        }
      `}</style>
    </div>
  );
};

export default Team_Member_Sidebar;
