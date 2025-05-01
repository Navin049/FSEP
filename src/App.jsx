import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

// Components
import AdminLogin from "./components/Auth/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectList from "./components/Projects/ProjectList";
import TaskForm from "./components/Tasks/TaskForm";
import ProjectForm from "./components/Projects/ProjectForm";
import TaskList from "./components/Tasks/TaskList";
import MemberForm from "./components/Team/MemberForm";
import TeamList from "./components/Team/TeamList";
import Sidebar from "./components/Shared/Sidebar";
import Team_Member_Sidebar from "./components/Shared/Team_Member_Sidebar";
import TeamMembers from "./components/Team/TeamMembers";
import Login from "./components/Auth/Login";

import Home from "./components/Shared/Home";
import Logout from "./components/Auth/Logout";
import Profile from "./components/Dashboard/Profile";
import TeamMember_Dashboard from "./components/Dashboard/TeamMember_Dashboard";
import ServletRegister from "./components/Auth/ServletRegister";
import UserManagement from "./components/Admin/UserManagement";
import ProjectManagement from "./components/Admin/ProjectManagement";
import TaskManagement from "./components/Admin/TaskManagement";
import AdminSidebar from "./components/Shared/AdminSidebar";
import CreateEventForm from "./components/Events/CreateEventForm";

// Main App Component
function App() {
  const [projectId, setProjectId] = useState(null);

  // Fetch projectId after login
  useEffect(() => {
    // Assuming you have a logged-in user stored in localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log('Logged in user:', loggedInUser);  // Add this line
    if (loggedInUser) {
      // Logic to fetch projectId based on userId
      fetchProjectId(loggedInUser.userId);
    }
  }, []);

  // Function to fetch projectId from the backend
  const fetchProjectId = async (userId) => {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const requestBody = {
      userId: loggedInUser.userId,
      role: loggedInUser.role, // Adding the role
    };
  
    console.log("Request body:", requestBody); // Log the request body


    try {
      console.log("Request body:", { userId });
      const response = await fetch("http://localhost:8080/backend-servlet/GetProjectId", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userId }), // Sending userId in the body as JSON
      });

      if (!response.ok) {
        const errorText = await response.text(); // Log the response body for debugging
      throw new Error(`Failed to fetch project ID. Response: ${errorText}`);
      }

      if (response.ok) {
        const data = await response.json();
        console.log("recived data:", data);
        setProjectId(data.projectId); // Assuming projectId is returned as { projectId: 123 }
      } else {
        console.error("Failed to fetch project ID");
      }
    } catch (error) {
      console.error("Error fetching projectId:", error);
    }
  };


  return (
    <Router>
      <Layout projectId={projectId}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard projectId={projectId} />} />
          <Route path="/projects" element={<ProjectList projectId={projectId} />} />
          <Route path="/projects/ProjectForm" element={<ProjectForm />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/TaskForm" element={<TaskForm />} />
          <Route path="/team" element={<TeamList />} />
          <Route path="/team/MemberForm" element={<MemberForm />} />
          <Route path="/team/TeamMembers" element={<TeamMembers projectId={projectId} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ServletRegister" element={<ServletRegister />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/TeamMember_Dashboard" element={<TeamMember_Dashboard projectId={projectId}/>} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<UserManagement />} />
          <Route path="/admin-sidebar" element={<AdminSidebar />} />
          <Route path="/admin-projects" element={<ProjectManagement />} />
          <Route path="/admin-tasks" element={<TaskManagement projectId={projectId} />} />
          <Route path="/CreateEventForm" element={<CreateEventForm />} />
          <Route path="*" element={<AdminLogin />} /> {/* Default Route */}
        </Routes>
      </Layout>
    </Router>
  );
}

// Layout Component (Handles Sidebar Visibility & Role-Based Sidebar)
const Layout = ({ children, projectId }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserRole(loggedInUser.role);
    }
  }, [location.pathname]);

  const hideSidebar = ["/", "/login", "/servletregister", "/adminlogin"].includes(location.pathname.toLowerCase());

  return hideSidebar ? (
    <>{children}</>
  ) : (
    <div className="container-layout">
      {userRole === "Team Member" ? (
        <Team_Member_Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      ) : userRole === "Project Manager" ? (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />  )
      // :  userRole === "Admin" ? (
      //   <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />)
      : null}
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>{children}</div>
    </div>
  );
};


export default App;
