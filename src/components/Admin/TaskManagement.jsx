import React, { useState, useEffect } from "react";

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    // const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({
      id: "",
      title: "",
      description: "",
      status: "",
      deadline: "",
      assignedTo: "",
      priority: "",
      projectName: "",
    });
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

  // Fetch tasks and projects when the component mounts
  useEffect(() => {
    
    fetchTasks();
    fetchProjects();
    // fetchTeamMembers();  // Fetch team members
  }, []);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/TaskManagementServlet",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const projectsRes = await fetch(
        "http://localhost:8080/backend-servlet/TaskManagementUpdateServlet",
        {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!projectsRes.ok) {  
        // Handle the case where the admin might not be authorized or other HTTP errors  
        throw new Error(`Error: ${projectsRes.status}`);  
    }  

      const projectsData = await projectsRes.json();
      console.log(projectsData);
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch team members from the backend
  const fetchTeamMembers = async (projectId) => {
    if (!projectId) return;
  
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/AdminGetAssignedMembersForProjectServlet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
          credentials: "include",
        }
      );
  
      // Check if the response status is OK (200-299)
      if (!response.ok) {
        console.error("Failed to fetch team members:", response.statusText);
        return;
      }
  
      // Try parsing the response as JSON
      const teamMembersData = await response.json();
      console.log("Fetched team members:", teamMembersData);  

      // Check if the response contains a message (error or no members)
      if (teamMembersData.message) {
        console.error("Server message:", teamMembersData.message);
        return;
      }
  
      // If data is valid, set the team members
      setTeamMembers(teamMembersData);
     
  
    } catch (error) {
      // Catch any other errors (network, parsing, etc.)
      console.error("Error fetching team members:", error);
    }
  };
  

  const handleEditClick = (task) => {
    // setSelectedTask(task);
    setEditData({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline,
      assignedTo: task.assignedTo,
      priority: task.priority,
      projectName: task.projectName,
    });
    // fetchProjects();
    setShowModal(true);
  };

  const handleProjectChange = (e) => {
    const selectedProjectName = e.target.value;
    setEditData({ ...editData, projectName: selectedProjectName });

    // Find the project ID corresponding to the selected project name
    const selectedProject = projects.find(
      (project) => project.name === selectedProjectName
    );

    if (selectedProject) {
      // Fetch team members for the selected project
      fetchTeamMembers(selectedProject.projectId);
    }
  };

  // Handle the delete action
  const handleDeleteClick = (taskId) => {
    handleDelete(taskId);
  };

  // Perform deletion of task
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/backend-servlet/DeleteTaskServlet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );

        if (response.ok) {
          fetchTasks();
        } else {
          console.error("Error deleting task:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // Handle change in modal form inputs
  const handleSaveChanges = async () => {
    if (!editData.id) {
      console.error("Task ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/backend-servlet/UpdateTaskServlet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        fetchTasks();
        setShowModal(false);
      } else {
        console.error("Error updating task:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving task changes:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Manage Tasks</h2>
      <div className="overflow-x-auto table-responsive-sm">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Project Name</th>
              <th className="p-3 border">Deadline</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Assigned To</th>
              <th className="p-3 border">Priority</th>
              <th className="p-3 border">Created At</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="p-3 border">{task.id}</td>
                  <td className="p-3 border">{task.title}</td>
                  <td className="p-3 border">{task.description}</td>
                  <td className="p-3 border">{task.projectName}</td>
                  <td className="p-3 border">{task.deadline}</td>
                  <td className="p-3 border">{task.status}</td>
                  <td className="p-3 border">{task.assignedTo}</td>
                  <td className="p-3 border">{task.priority}</td>
                  <td className="p-3 border">{task.createdAt}</td>
                  <td className="p-3 border">
                    <button className="btn btn-primary" onClick={() => handleEditClick(task)}>Edit</button>
                    <button className="btn btn-danger m-1" onClick={() => handleDeleteClick(task.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Task Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        type="text"
                        className="form-control"
                        value={editData.status}
                        onChange={(e) =>
                          setEditData({ ...editData, status: e.target.value })
                        }
                        
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.deadline}
                        onChange={(e) =>
                          setEditData({ ...editData, deadline: e.target.value })
                        }
                        
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Assigned To</label>
                      <select
                        type="text"
                        className="form-control"
                        value={editData.assignedTo}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            assignedTo: e.target.value,
                          })
                        }
                        
                      >
                        <option value="">Select a team member</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <select
                        type="text"
                        className="form-control"
                        value={editData.priority}
                        onChange={(e) =>
                          setEditData({ ...editData, priority: e.target.value })
                        }
                        
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Project Name</label>
                      <select
                        className="form-control"
                        value={editData.projectName}
                        onChange={handleProjectChange} // Call the function to update the project and fetch team members
                        
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project.projectId} value={project.name}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveChanges}
                    disabled={
                      !editData.title ||
                      !editData.description ||
                      !editData.status ||
                      !editData.deadline
                    }
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskManagement;
