import React, { useState } from "react";

const ProjectForm = ({ onSubmit, project }) => {
  const [name, setName] = useState(project ? project.name : "");
  const [description, setDescription] = useState(project ? project.description : "");
  const [startdate, setstartdate] = useState(project ? project.startdate : "");
  const [enddate, setenddate] = useState(project ? project.enddate : "");
  const [budget, setbudget] = useState(project ? project.budget : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = { id: Date.now(), name, description, startdate, enddate, budget };

    // Retrieve existing projects from localStorage
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // Add new project to the array
    storedProjects.push(newProject);

    // Save updated array to localStorage
    localStorage.setItem("projects", JSON.stringify(storedProjects));

    // Pass data to parent component (if needed)
    if (onSubmit) {
      onSubmit(newProject);
    }

    // Clear form fields
    setName("");
    setDescription("");
    setstartdate("");
    setenddate("");
    setbudget("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 m-3">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">{project ? "Edit Project" : "Create New Project"}</h2>
          
          <div className="mb-3">
            <label className="form-label w-100">
              Project Name:
              <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
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
              Start Date:
              <input className="form-control" type="date" value={startdate} onChange={(e) => setstartdate(e.target.value)} required />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              End Date:
              <input className="form-control" type="date" value={enddate} onChange={(e) => setenddate(e.target.value)} required />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label w-100">
              Budget:
              <input className="form-control" type="number" value={budget} onChange={(e) => setbudget(e.target.value)} required />
            </label>
          </div>

          <button type="submit" className="btn btn-dark w-100">Save Project</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
