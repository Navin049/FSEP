import React, { useState } from "react";

const ProjectForm = ({ onSubmit, project }) => {
  const [name, setName] = useState(project ? project.name : "");
  const [description, setDescription] = useState(project ? project.description : "");
  const [startdate, setstartdate] = useState(project ? project.startdate : "");
  const [enddate, setenddate] = useState(project ? project.enddate : "");
  const [budget, setbudget] = useState(project ? project.budget : "");
  const [status, setStatus] = useState(project ? project.status : "to Do");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProject = { name, description, startdate, enddate, budget, status };

    try {
      const response = await fetch("http://localhost:8080/backend-servlet/CreateProjectServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (onSubmit) {
          onSubmit(data);
        }
        setName("");
        setDescription("");
        setstartdate("");
        setenddate("");
        setbudget("");
        setStatus("Planned");
      } else {
        alert("Error creating project.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the project.");
    }
  };

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minHeight: "100vh",
        margin: "auto"
      }}
    >
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

          <div className="mb-3">
            <label className="form-label w-100">
              Status:
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="to Do">to Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>

          <button type="submit" className="btn btn-dark w-100">Save Project</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
