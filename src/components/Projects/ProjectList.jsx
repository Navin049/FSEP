import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    description: "",
    startdate: "",
    enddate: "",
    budget: "",
  });
  const [showModal, setShowModal] = useState(false); // 👈 State to control modal visibility

  // Load projects from localStorage when the component mounts
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, []);

  // Handle Edit Button Click (Open Modal)
  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditData(project);
    setShowModal(true); // 👈 Show modal
  };

  // Handle Save Changes (Update Project in LocalStorage)
  const handleSaveChanges = () => {
    const updatedProjects = projects.map((project) =>
      project.id === selectedProject.id ? editData : project
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setShowModal(false); // 👈 Hide modal after saving
  };

  // Handle Delete Project
  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this member?");
    
    if(isConfirmed){
    const filteredProjects = projects.filter((project) => project.id !== id);
    setProjects(filteredProjects);
    localStorage.setItem("projects", JSON.stringify(filteredProjects));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Projects</h2>

      {projects.length === 0 ? (
        <div className="alert alert-warning text-center">No projects available.</div>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div key={project.id} className="col-md-6 col-lg-12 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body ">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text text-muted">{project.description}</p>
                  <p><strong>Start Date:</strong> {project.startdate}</p>
                  <p><strong>End Date:</strong> {project.enddate}</p>
                  <p><strong>Budget:</strong> ₹{project.budget}</p>

                  <div className="d-flex justify-content-start gap-1 ">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditClick(project)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger "
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Project Modal */}
      {showModal && ( // 👈 Only render modal when showModal is true
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editData.startdate}
                      onChange={(e) => setEditData({ ...editData, startdate: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editData.enddate}
                      onChange={(e) => setEditData({ ...editData, enddate: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Budget</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editData.budget}
                      onChange={(e) => setEditData({ ...editData, budget: e.target.value })}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
