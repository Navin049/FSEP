import React, { useState, useEffect } from "react";

const TaskForm = ({ onSubmit, task }) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [status, setStatus] = useState(task ? task.status : "To Do");
  const [deadline, setDeadline] = useState(task ? task.deadline : "");
  const [assignedTo, setAssignedTo] = useState(task ? task.assignedTo : "");
  const [priority, setPriority] = useState(task ? task.priority : "Medium");
  const [projectName, setProjectName] = useState(task ? task.projectName : "");
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);

    const storedMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
    setTeamMembers(storedMembers);

    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: task ? task.id : new Date().getTime(),
      title,
      description,
      status,
      deadline,
      assignedTo,
      priority,
      projectName, // ✅ Added project name to task object
    };

    let updatedTasks;
    if (task) {
      updatedTasks = tasks.map((t) => (t.id === task.id ? newTask : t));
    } else {
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    if (onSubmit) onSubmit(newTask);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 m-3">
      <div className="card p-4 shadow-lg w-100">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">{task ? "Edit Task" : "Add New Task"}</h2>

          <div className="mb-3">
            <label className="form-label w-100">
              Title:
              <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Description:
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </label>
          </div>

          {/* ✅ Added Project Name Dropdown */}
          <div className="mb-3">
            <label className="form-label w-100">
              Project Name:
              <select className="form-control" value={projectName} onChange={(e) => setProjectName(e.target.value)} required>
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Status:
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Deadline:
              <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Assigned To:
              <select className="form-control" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                <option value="">Select a team member</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Priority:
              <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)} required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <button className="btn btn-dark text-center w-100" type="submit">
            {task ? "Update Task" : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
