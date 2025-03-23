import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
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
  const [isTeamMember, setIsTeamMember] = useState(false); // Store if the user is a team member

  // Load tasks and check if the user is a team member when the component mounts
  useEffect(() => {
    fetchTasks();
    checkIfTeamMember();
  }, []);

  // Function to check if the user is a team member (replace this with your actual logic)
  const checkIfTeamMember = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/CheckIfTeamMemberServlet",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setIsTeamMember(data.isTeamMember); // Assume API response has a field "isTeamMember"
    } catch (error) {
      console.error("Error checking team membership:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsRes = await fetch(
        "http://localhost:8080/backend-servlet/ViewProjectServlet",
        {
          credentials: "include",
        }
      );
      const projectsData = await projectsRes.json();
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTeamMembers = async (projectId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/GetAssignedMembersForProjectServlet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
          credentials: "include",
        }
      );

      const teamMembersData = await response.json();
      setTeamMembers(teamMembersData);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/ViewTaskServlet",
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

  const handleEditClick = (task) => {
    setSelectedTask(task);
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
    fetchProjects();
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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Task List</h2>

      {tasks.length === 0 ? (
        <div className="alert alert-warning text-center">
          No tasks available.
        </div>
      ) : (
        <div className="row">
          {tasks.map((task) => {
            return (
              <div key={task.id} className="col-md-12 col-lg-12 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5
                      className="card-title text-primary cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                      style={{ cursor: "pointer" }}
                    >
                      {task.title}
                    </h5>

                    {selectedTask?.id === task.id && (
                      <div>
                        <p className="card-text text-muted">
                          {task.description}
                        </p>
                        <p>
                          <strong>Status:</strong> {task.status}
                        </p>
                        <p>
                          <strong>Deadline:</strong>{" "}
                          {new Date(task.deadline).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Assigned To:</strong>{" "}
                          {task.assignedTo || "N/A"}
                        </p>
                        <p>
                          <strong>Priority:</strong> {task.priority}
                        </p>
                        <p>
                          <strong>Project:</strong> {task.projectName || "N/A"}
                        </p>
                        <div className="d-flex justify-content-start gap-1">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditClick(task)}
                          >
                            Edit
                          </button>
                          {!isTeamMember && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(task.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                        disabled={isTeamMember}
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
                        disabled={isTeamMember}
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
                        disabled={isTeamMember ? false : false}
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
                        disabled={isTeamMember}
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
                        disabled={isTeamMember}
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
                        disabled={isTeamMember}
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
                        disabled={isTeamMember}
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

export default TaskList;
