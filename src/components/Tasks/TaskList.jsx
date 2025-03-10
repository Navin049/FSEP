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

  // Load tasks from backend when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/ViewTaskServlet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the response is an array, directly use it
        if (Array.isArray(data)) {
          setTasks(data);  // Set the fetched task data directly
        } else {
          console.error("Received data is not an array:", data);
          setTasks([]);  // Reset to empty tasks if data is not an array
        }
      } else {
        console.error("Error fetching tasks:", response.statusText);
        setTasks([]);  // Set empty tasks on error
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);  // Set empty tasks on error
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
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    if (!editData.id) {
      console.error("Task ID is missing");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/backend-servlet/UpdateTaskServlet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        fetchTasks();  // Re-fetch tasks after successful update
        setShowModal(false);  // Close the modal
      } else {
        console.error("Error updating task:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving task changes:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/backend-servlet/DeleteTaskServlet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          fetchTasks();  // Re-fetch tasks after deletion
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
        <div className="alert alert-warning text-center">No tasks available.</div>
      ) : (
        <div className="row">
          {tasks.map((task) => {
  console.log(task); // Add this line to check the data structure
  return (
    <div key={task.id} className="col-md-12 col-lg-12 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5
            className="card-title text-primary cursor-pointer"
            onClick={() => setSelectedTask(task)}  // Handle task selection
            style={{ cursor: "pointer" }}
          >
            {task.title}
          </h5>

          {selectedTask?.id === task.id && (
            <div>
              <p className="card-text text-muted">{task.description}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              <p><strong>Assigned To:</strong> {task.assignedTo || "N/A"}</p> {/* Display fallback if missing */}
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Project:</strong> {task.projectName || "N/A"}</p> {/* Display fallback if missing */}

              <div className="d-flex justify-content-start gap-1">
                <button className="btn btn-primary" onClick={() => handleEditClick(task)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
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

      {/* Edit Task Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={() => setShowModal(false)}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Task</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Task Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.deadline}
                        onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Assigned To</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.assignedTo}
                        onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.priority}
                        onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Project Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.projectName}
                        onChange={(e) => setEditData({ ...editData, projectName: e.target.value })}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveChanges}
                    disabled={!editData.title || !editData.description || !editData.status || !editData.deadline}
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
