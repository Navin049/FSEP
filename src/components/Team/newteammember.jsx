import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TeamMembers = ({ projectId }) => {
  // State management
  const [projectDetails, setProjectDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [activeProject, setActiveProject] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Project details modal state
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Collaboration features state
  const [activeTab, setActiveTab] = useState("members"); // members, chat, tasks, files, announcements
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    status: "todo",
  });
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Socket.io reference
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mock data for demonstration
  const mockComments = [
    {
      id: 1,
      author: "John Doe",
      authorRole: "Project Manager",
      content: "Great progress on the frontend tasks!",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      avatar: null,
    },
    {
      id: 2,
      author: "Jane Smith",
      authorRole: "Developer",
      content: "I've completed the API integration. Ready for testing.",
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      avatar: null,
    },
    {
      id: 3,
      author: "Mike Johnson",
      authorRole: "Designer",
      content: "Updated the design assets in the shared folder.",
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      avatar: null,
    },
  ];

  const mockChatMessages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Good morning team! How's everyone doing today?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      avatar: null,
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "Morning! I'm working on the authentication module today.",
      timestamp: new Date(Date.now() - 3540000).toISOString(),
      avatar: null,
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "I'm finalizing the dashboard UI components.",
      timestamp: new Date(Date.now() - 3480000).toISOString(),
      avatar: null,
    },
    {
      id: 4,
      sender: "Sarah Williams",
      content:
        "I'll be reviewing the API documentation and will update the test cases.",
      timestamp: new Date(Date.now() - 3420000).toISOString(),
      avatar: null,
    },
  ];

  // const mockTasks = [
  //   {
  //     id: 1,
  //     title: "Implement user authentication",
  //     description: "Add login, registration, and password reset functionality",
  //     assignee: "Jane Smith",
  //     priority: "high",
  //     status: "in-progress",
  //     dueDate: new Date(Date.now() + 172800000).toISOString(),
  //   },
  //   {
  //     id: 2,
  //     title: "Design dashboard layout",
  //     description: "Create wireframes and mockups for the main dashboard",
  //     assignee: "Mike Johnson",
  //     priority: "medium",
  //     status: "completed",
  //     dueDate: new Date(Date.now() - 86400000).toISOString(),
  //   },
  //   {
  //     id: 3,
  //     title: "API integration",
  //     description: "Connect frontend components to backend APIs",
  //     assignee: "Jane Smith",
  //     priority: "high",
  //     status: "todo",
  //     dueDate: new Date(Date.now() + 259200000).toISOString(),
  //   },
  //   {
  //     id: 4,
  //     title: "User testing",
  //     description: "Conduct user testing sessions and gather feedback",
  //     assignee: "Sarah Williams",
  //     priority: "medium",
  //     status: "todo",
  //     dueDate: new Date(Date.now() + 345600000).toISOString(),
  //   },
  // ];

  const mockAnnouncements = [
    {
      id: 1,
      title: "Project Timeline Update",
      content:
        "We've adjusted the project timeline to accommodate the new requirements. The new deadline is now June 15th.",
      author: "John Doe",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: 2,
      title: "New Team Member",
      content:
        "Please welcome Sarah Williams to our team! She'll be joining us as a QA Engineer starting next week.",
      author: "John Doe",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 3,
      title: "Client Meeting",
      content:
        "We have a client review meeting scheduled for Friday at 2 PM. Please prepare your progress reports.",
      author: "John Doe",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const mockFiles = [
    {
      id: 1,
      name: "Project_Requirements.pdf",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      timestamp: new Date(Date.now() - 604800000).toISOString(),
      type: "pdf",
    },
    {
      id: 2,
      name: "Dashboard_Mockups.fig",
      size: "8.7 MB",
      uploadedBy: "Mike Johnson",
      timestamp: new Date(Date.now() - 432000000).toISOString(),
      type: "fig",
    },
    {
      id: 3,
      name: "API_Documentation.docx",
      size: "1.2 MB",
      uploadedBy: "Jane Smith",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      type: "docx",
    },
    {
      id: 4,
      name: "Meeting_Notes.txt",
      size: "45 KB",
      uploadedBy: "Sarah Williams",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: "txt",
    },
  ];

  useEffect(() => {
    // Initialize mock data for demonstration
    setComments(mockComments);
    setChatMessages(mockChatMessages);
    setAnnouncements(mockAnnouncements);
    setFiles(mockFiles);

    // Initialize Socket.io connection
    // In a real implementation, connect to your actual Socket.io server
    // socketRef.current = io("http://localhost:8080");

    // // Socket event listeners would go here
    // socketRef.current.on("new_message", (message) => {
    //   setChatMessages((prevMessages) => [...prevMessages, message]);
    // });

    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //   }
    // };
  }, []);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current && activeTab === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = loggedInUser ? loggedInUser.userId : null;

    if (projectId !== null && userId !== null) {
      const fetchProjectDetails = async () => {
        try {
          setLoading(true);
          console.log("Sending projectId:", projectId, "userId:", userId);

          // Try to fetch from API, fall back to mock data if it fails
          try {
            const response = await fetch(
              "http://localhost:8080/backend-servlet/GetAssignedMembersForProjectServlet",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectId, userId }),
                credentials: "include",
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch project details");
            }

            const projectData = await response.json();
            console.log("Received project data:", projectData);

            // Process the data
            const enhancedProjects = (projectData.projects || []).map(
              (project) => ({
                ...project,
                members: (project.members || []).map((member) => ({
                  ...member,
                  experienceLevel:
                    member.experienceLevel ||
                    ["Junior", "Mid-level", "Senior"][
                      Math.floor(Math.random() * 3)
                    ],
                  availability:
                    member.availability ||
                    ["Available", "Busy", "On Leave"][
                      Math.floor(Math.random() * 3)
                    ],
                  skills: member.skills || "JavaScript, React, Node.js",
                })),
                description:
                  project.description ||
                  "This project aims to develop a comprehensive team management system with features for task tracking, communication, and resource allocation.",
                startDate: project.startDate || "2023-01-15",
                endDate: project.endDate || "2023-12-31",
                status: project.status || "In Progress",
                completionPercentage: project.completionPercentage || 65,
                budget: project.budget || "$120,000",
                client: project.client || "Acme Corporation",
              })
            );

            setProjectDetails(enhancedProjects);
            if (enhancedProjects.length > 0 && !activeProject) {
              setActiveProject(enhancedProjects[0].projectId);
            }
          } catch (apiError) {
            console.error("API error, using mock data:", apiError);

            // Use mock data as fallback
            const mockProjectData = {
              projects: [
                {
                  projectId: "1",
                  projectName: "Team Management System",
                  projectManager: "John Doe",
                  description:
                    "This project aims to develop a comprehensive team management system with features for task tracking, communication, and resource allocation.",
                  startDate: "2023-01-15",
                  endDate: "2023-12-31",
                  status: "In Progress",
                  completionPercentage: 65,
                  budget: "$120,000",
                  client: "Acme Corporation",
                  members: [
                    {
                      id: "1",
                      name: "Jane Smith",
                      email: "jane.smith@example.com",
                      Subrole: "Lead Developer",
                      experienceLevel: "Senior",
                      availability: "Available",
                      skills: "JavaScript, React, Node.js, MongoDB",
                    },
                    {
                      id: "2",
                      name: "Mike Johnson",
                      email: "mike.johnson@example.com",
                      Subrole: "UI/UX Designer",
                      experienceLevel: "Mid-level",
                      availability: "Busy",
                      skills: "Figma, Adobe XD, CSS, HTML",
                    },
                    {
                      id: "3",
                      name: "Sarah Williams",
                      email: "sarah.williams@example.com",
                      Subrole: "QA Engineer",
                      experienceLevel: "Junior",
                      availability: "Available",
                      skills: "Testing, Automation, Selenium",
                    },
                    {
                      id: "4",
                      name: "David Brown",
                      email: "david.brown@example.com",
                      Subrole: "Backend Developer",
                      experienceLevel: "Senior",
                      availability: "Available",
                      skills: "Java, Spring, SQL, AWS",
                    },
                  ],
                },
              ],
            };

            setProjectDetails(mockProjectData.projects);
            if (mockProjectData.projects.length > 0) {
              setActiveProject(mockProjectData.projects[0].projectId);
            }
          }
        } catch (error) {
          console.error("Error fetching project details:", error);
          setError("Error fetching project details. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchProjectDetails();
    }
  }, [projectId]);

  // Get unique roles from all members across all projects
  const getAllRoles = () => {
    const roles = new Set();
    projectDetails.forEach((project) => {
      project.members.forEach((member) => {
        if (member.Subrole) roles.add(member.Subrole);
      });
    });
    return Array.from(roles);
  };

  // Filter members based on search term and role filter
  const getFilteredMembers = (members) => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.Subrole &&
          member.Subrole.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = filterRole === "" || member.Subrole === filterRole;
      return matchesSearch && matchesRole;
    });
  };

  // Get the currently active project
  const getCurrentProject = () => {
    return (
      projectDetails.find((project) => project.projectId === activeProject) ||
      projectDetails[0]
    );
  };

  // Get experience level badge color
  const getExperienceBadgeColor = (level) => {
    switch (level) {
      case "Junior":
        return "bg-info";
      case "Mid-level":
        return "bg-primary";
      case "Senior":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // Get availability badge color
  const getAvailabilityBadgeColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-success";
      case "Busy":
        return "bg-warning text-dark";
      case "On Leave":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name) => {
    if (!name) return "#6c757d";

    const colors = [
      "#4e73df",
      "#1cc88a",
      "#36b9cc",
      "#f6c23e",
      "#e74a3b",
      "#6f42c1",
      "#fd7e14",
      "#20c9a6",
      "#5a5c69",
      "#858796",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Get task priority badge color
  const getTaskPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-danger";
      case "medium":
        return "bg-warning text-dark";
      case "low":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  // Get task status badge color
  const getTaskStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "in-progress":
        return "bg-primary";
      case "todo":
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date without time
  const formatDateNoTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get time ago string
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "bi-file-earmark-pdf";
      case "doc":
      case "docx":
        return "bi-file-earmark-word";
      case "xls":
      case "xlsx":
        return "bi-file-earmark-excel";
      case "ppt":
      case "pptx":
        return "bi-file-earmark-ppt";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "bi-file-earmark-image";
      case "zip":
      case "rar":
        return "bi-file-earmark-zip";
      case "txt":
        return "bi-file-earmark-text";
      case "fig":
        return "bi-file-earmark-richtext";
      default:
        return "bi-file-earmark";
    }
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      author: "You", // In a real app, get from logged-in user
      authorRole: "Team Member", // In a real app, get from logged-in user
      content: newComment,
      timestamp: new Date().toISOString(),
      avatar: null,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: chatMessages.length + 1,
      sender: "You", // In a real app, get from logged-in user
      content: newMessage,
      timestamp: new Date().toISOString(),
      avatar: null,
    };

    // In a real app, send via Socket.io
    // socketRef.current.emit("send_message", message);

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: tasks.length + 1,
      ...newTask,
      dueDate: new Date(Date.now() + 604800000).toISOString(), // Default to 1 week from now
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      status: "todo",
    });
  };

  // Handle adding a new announcement
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim())
      return;

    const announcement = {
      id: announcements.length + 1,
      ...newAnnouncement,
      author: "You", // In a real app, get from logged-in user
      timestamp: new Date().toISOString(),
    };

    setAnnouncements([...announcements, announcement]);
    setNewAnnouncement({ title: "", content: "" });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
  
    setUploadingFile(true);
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("uploadedBy", "You"); // Optional - replace with actual username
  
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/UploadFileServlet", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
  
      const result = await response.json();
      console.log("Upload result:", result);
  
      if (result.success) {
        const fileExtension = selectedFile.name.split(".").pop();
        const newFile = {
          id: result.id,
          name: selectedFile.name,
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadedBy: "You",
          timestamp: new Date().toISOString(),
          type: fileExtension,
        };
        setFiles((prevFiles) => [...prevFiles, newFile]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  
    setUploadingFile(false);
    e.target.value = null; // reset
  };
  

  // Handle task status change
  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (projectDetails.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle-fill me-2"></i>
        No project details available.
      </div>
    );
  }

  const currentProject = getCurrentProject();
  const roles = getAllRoles();

  return (
    <div className="container-fluid py-4">
      {/* Project Selection Tabs */}
      {projectDetails.length > 1 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-3">Your Projects</h5>
                <ul className="nav nav-pills">
                  {projectDetails.map((project) => (
                    <li className="nav-item" key={project.projectId}>
                      <button
                        className={`nav-link ${
                          project.projectId === activeProject ? "active" : ""
                        }`}
                        onClick={() => setActiveProject(project.projectId)}
                      >
                        {project.projectName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card shadow border-0"
            style={{
              background: "linear-gradient(to right, #4e73df, #224abe)",
              borderRadius: "0.5rem",
            }}
          >
            <div className="card-body text-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">{currentProject.projectName}</h2>
                  <p className="mb-0 opacity-75">
                    <i className="bi bi-person-badge me-2"></i>
                    Project Manager:{" "}
                    <strong>{currentProject.projectManager}</strong>
                  </p>
                </div>
                <div className="d-flex">
                  <div className="bg-white bg-opacity-25 px-3 py-2 rounded-pill me-2">
                    <i className="bi bi-people-fill me-2"></i>
                    <span className="fw-bold">
                      {currentProject.members.length}
                    </span>{" "}
                    Team Members
                  </div>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => setShowProjectModal(true)}
                  >
                    <i className="bi bi-info-circle me-1"></i>
                    Project Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "members" ? "active" : ""
                }`}
                onClick={() => setActiveTab("members")}
              >
                <i className="bi bi-people me-2"></i>
                Team Members
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "chat" ? "active" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Chat
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "files" ? "active" : ""}`}
                onClick={() => setActiveTab("files")}
              >
                <i className="bi bi-file-earmark me-2"></i>
                Files
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "announcements" ? "active" : ""
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                <i className="bi bi-megaphone me-2"></i>
                Announcements
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "comments" ? "active" : ""
                }`}
                onClick={() => setActiveTab("comments")}
              >
                <i className="bi bi-chat-square-text me-2"></i>
                Comments
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Team Members Tab Content */}
      {activeTab === "members" && (
        <>
          {/* Search and Filter */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <div className="btn-group w-100">
                <button
                  className={`btn ${
                    viewMode === "grid" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button
                  className={`btn ${
                    viewMode === "list" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Team Members */}
          {currentProject.members && currentProject.members.length === 0 ? (
            <div className="alert alert-warning" role="alert">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              No team members assigned to this project.
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="row">
                  {getFilteredMembers(currentProject.members).map((member) => (
                    <div
                      key={member.id}
                      className="col-xl-3 col-lg-4 col-md-6 mb-4"
                    >
                      <div className="card h-100 shadow-sm border-0 hover-shadow">
                        <div className="card-body text-center">
                          <div className="mb-3">
                            {member.avatar ? (
                              <img
                                src={member.avatar || "/placeholder.svg"}
                                alt={member.name}
                                className="rounded-circle"
                                width="80"
                                height="80"
                              />
                            ) : (
                              <div
                                className="avatar-circle mx-auto d-flex align-items-center justify-content-center"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  borderRadius: "50%",
                                  backgroundColor: getAvatarColor(member.name),
                                  color: "white",
                                  fontSize: "1.5rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {getInitials(member.name)}
                              </div>
                            )}
                          </div>
                          <h5 className="card-title mb-1">{member.name}</h5>
                          <p className="text-muted small mb-2">
                            {member.Subrole}
                          </p>

                          <div className="d-flex justify-content-center mb-3">
                            <span
                              className={`badge ${getExperienceBadgeColor(
                                member.experienceLevel
                              )} me-2`}
                            >
                              {member.experienceLevel}
                            </span>
                            <span
                              className={`badge ${getAvailabilityBadgeColor(
                                member.availability
                              )}`}
                            >
                              {member.availability}
                            </span>
                          </div>

                          <div className="mb-3">
                            {(member.skills
                              ? member.skills.split(",")
                              : []
                            ).map((skill, index) => (
                              <span
                                key={index}
                                className="badge bg-light text-dark me-1 mb-1"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>

                          <div className="d-flex justify-content-center">
                            <a
                              href={`mailto:${member.email}`}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="bi bi-envelope"></i>
                            </a>
                            <a
                              href={`tel:${member.phone}`}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="bi bi-telephone"></i>
                            </a>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-chat"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card shadow-sm border-0">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Team Member</th>
                            <th>Role</th>
                            <th>Experience</th>
                            <th>Skills</th>
                            <th>Availability</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredMembers(currentProject.members).map(
                            (member) => (
                              <tr key={member.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="avatar-circle d-flex align-items-center justify-content-center me-3"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: getAvatarColor(
                                          member.name
                                        ),
                                        color: "white",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {getInitials(member.name)}
                                    </div>
                                    <div>
                                      <h6 className="mb-0">{member.name}</h6>
                                      <small className="text-muted">
                                        {member.email}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td>{member.Subrole}</td>
                                <td>
                                  <span
                                    className={`badge ${getExperienceBadgeColor(
                                      member.experienceLevel
                                    )}`}
                                  >
                                    {member.experienceLevel}
                                  </span>
                                </td>
                                <td>
                                  {(member.skills
                                    ? member.skills.split(",")
                                    : []
                                  ).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="badge bg-light text-dark me-1 mb-1"
                                    >
                                      {skill.trim()}
                                    </span>
                                  ))}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${getAvailabilityBadgeColor(
                                      member.availability
                                    )}`}
                                  >
                                    {member.availability}
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group">
                                    <a
                                      href={`mailto:${member.email}`}
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      <i className="bi bi-envelope"></i>
                                    </a>
                                    <a
                                      href={`tel:${member.phone}`}
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      <i className="bi bi-telephone"></i>
                                    </a>
                                    <button className="btn btn-sm btn-outline-primary">
                                      <i className="bi bi-chat"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Chat Tab Content */}
      {activeTab === "chat" && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div
                  className="chat-container"
                  style={{
                    height: "500px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="chat-messages flex-grow-1 overflow-auto mb-3 p-3"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "0.5rem",
                    }}
                  >
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`chat-message mb-3 ${
                          message.sender === "You" ? "text-end" : ""
                        }`}
                      >
                        <div
                          className={`d-inline-block p-3 rounded-3 ${
                            message.sender === "You"
                              ? "bg-primary text-white"
                              : "bg-light"
                          }`}
                          style={{ maxWidth: "75%", textAlign: "left" }}
                        >
                          <div className="d-flex align-items-center mb-1">
                            {message.sender !== "You" && (
                              <div
                                className="avatar-circle d-flex align-items-center justify-content-center me-2"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: getAvatarColor(
                                    message.sender
                                  ),
                                  color: "white",
                                  fontSize: "0.8rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {getInitials(message.sender)}
                              </div>
                            )}
                            <strong>{message.sender}</strong>
                            <small className="ms-2 text-muted">
                              {getTimeAgo(message.timestamp)}
                            </small>
                          </div>
                          <div>{message.content}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef}></div>
                  </div>
                  <div className="chat-input">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSendMessage}
                      >
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* Files Tab Content */}
      {activeTab === "files" && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Project Files</h5>
                  <div>
                    <input
                      type="file"
                      id="fileUpload"
                      className="d-none"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="fileUpload"
                      className="btn btn-primary mb-0"
                    >
                      <i className="bi bi-upload me-2"></i>
                      Upload File
                    </label>
                  </div>
                </div>

                {uploadingFile && (
                  <div className="progress mb-3">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: "75%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      Uploading...
                    </div>
                  </div>
                )}

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>File Name</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Uploaded By</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr key={file.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i
                                className={`bi ${getFileIcon(
                                  file.type
                                )} fs-4 me-2 text-primary`}
                              ></i>
                              <span>{file.name}</span>
                            </div>
                          </td>
                          <td className="text-uppercase">{file.type}</td>
                          <td>{file.size}</td>
                          <td>{file.uploadedBy}</td>
                          <td>{formatDateNoTime(file.timestamp)}</td>
                          <td>
                            <div className="btn-group">
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-download"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <i className="bi bi-share"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {files.length === 0 && (
                  <div className="text-center text-muted py-5">
                    <i className="bi bi-file-earmark-x fs-1"></i>
                    <p className="mt-3">No files uploaded yet</p>
                    <p>Upload files to share with your team</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Tab Content
      {activeTab === "announcements" && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Announcements</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#newAnnouncementForm"
                  aria-expanded="false"
                  aria-controls="newAnnouncementForm"
                >
                  <i className="bi bi-plus"></i> New Announcement
                </button>
              </div>
              <div className="collapse" id="newAnnouncementForm">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="announcementTitle" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="announcementTitle"
                        value={newAnnouncement.title}
                        onChange={(e) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="announcementContent"
                        className="form-label"
                      >
                        Content
                      </label>
                      <textarea
                        className="form-control"
                        id="announcementContent"
                        rows="3"
                        value={newAnnouncement.content}
                        onChange={(e) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            content: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleAddAnnouncement}
                      >
                        Post Announcement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="card shadow-sm border-0 mb-4"
              >
                <div className="card-body">
                  <h5 className="card-title">{announcement.title}</h5>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="avatar-circle d-flex align-items-center justify-content-center me-2"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: getAvatarColor(announcement.author),
                        color: "white",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(announcement.author)}
                    </div>
                    <span className="me-2">{announcement.author}</span>
                    <small className="text-muted">
                      {formatDate(announcement.timestamp)}
                    </small>
                  </div>
                  <p className="card-text">{announcement.content}</p>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <i className="bi bi-hand-thumbs-up"></i> Acknowledge
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-chat-dots"></i> Comment
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {announcements.length === 0 && (
              <div className="text-center text-muted py-5">
                <i className="bi bi-megaphone fs-1"></i>
                <p className="mt-3">No announcements yet</p>
                <p>Create an announcement to inform your team</p>
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TeamMembers;
