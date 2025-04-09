import React, { useState, useEffect } from "react";

const TaskForm = ({ onSubmit, task }) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [status, setStatus] = useState(task ? task.status : "To Do");
  const [deadline, setDeadline] = useState(task ? task.deadline : "");
  const [assignedTo, setAssignedTo] = useState(task ? task.assignedTo : "");
  const [priority, setPriority] = useState(task ? task.priority : "Medium");
  const [projectName, setProjectName] = useState(task ? task.projectName : "");
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch available projects
    const fetchProjects = async () => {
      try {
        const projectsRes = await fetch("http://localhost:8080/backend-servlet/ViewProjectServlet", {
          credentials: "include",
        });
        const projectsData = await projectsRes.json();
        console.log("Projects Data:", projectsData); // Log to check the response
        setProjects(projectsData.projects || []); // Ensure projectsData is in correct format
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const fetchTeamMembers = async (projectId) => {
    console.log("Fetching team members for project ID:", projectId); // Log the project ID being sent to the backend
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/TeamMemberINProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }), // Pass projectId here
        credentials: "include",
      });
  
      if (response.ok) {
        const teamMembersData = await response.json();
        console.log("Team members data:", teamMembersData); // Log the team members data from the response
  
        // Set the team members from the 'members' array in the response
        setTeamMembers(teamMembersData.members || []); // Safely access 'members' array
      } else {
        console.error("Error fetching team members:", response.statusText);
        setTeamMembers([]); // Reset team members on error
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]); // Reset team members on error
    }
  };
  
  

  const handleProjectChange = (e) => {
    const selectedProjectName = e.target.value;
    setProjectName(selectedProjectName);
    console.log("Project selected:", selectedProjectName); // Log the selected project name

    // Find the selected project by name and fetch the team members
    const selectedProject = projects.find((project) => project.name === selectedProjectName);
    console.log("Selected project object:", selectedProject); // Log the selected project object

    if (selectedProject && selectedProject.projectId) {
      fetchTeamMembers(selectedProject.projectId); // Fetch team members based on the selected projectId
    } else {
      setTeamMembers([]); // Reset if no valid project is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, description, status, deadline, assignedTo, priority, projectName };
    console.log("Task data on submit:", newTask); // Log the task data that is being submitted

    try {
      const response = await fetch("http://localhost:8080/backend-servlet/CreateTaskServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Task created successfully:", data); // Log the response from creating the task
        if (onSubmit) {
          onSubmit(data);
        }

        // Reset form fields after successful task creation
        setTitle("");
        setDescription("");
        setStatus("To Do");
        setDeadline("");
        setAssignedTo();
        setPriority("Medium");
        setProjectName("");
      } else {
        console.error("Error creating task:", response.statusText);
        alert("Error creating task.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the task.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 m-3">
      <div className="card p-4 shadow-lg ">
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

          <div className="mb-3">
            <label className="form-label w-100">
              Project Name:
              <select className="form-control" value={projectName} onChange={handleProjectChange} required>
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
