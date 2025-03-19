import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin-profile">👨🏻‍💻 Profile</Link></li><hr />
        <li><Link to="/admin-dashboard">📊 Dashboard</Link></li><hr />
        <li><Link to="/admin-users"> 👨‍💼 User Management</Link></li><hr />
        <li><Link to="/admin-projects">Project Management</Link></li><hr />
        <li><Link to="/admin-tasks">Task Management</Link></li><hr />
        <li><Link to="/logout">⤵️ Logout</Link></li>
        
      </ul>
    </div>
  );
};

export default AdminSidebar;
