import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    description: "",
    startdate: "",
    enddate: "",
    budget: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/ProjectManagementServlet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const projectData = await response.json();
        setProjects(projectData);
      } else {
        alert("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("There was an error fetching project data. Please try again.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle the edit action
  const handleEditClick = (project) => {
    console.log("Editing project:", project);
    setSelectedProject(project);
    setEditData({
      id: project.projectId,
      name: project.title,
      description: project.description,
      startdate: project.startDate,
      enddate: project.endDate,
      budget: project.budget,
    });
    setShowModal(true); // Show the modal when editing a project
  };

  // Handle change in modal form inputs
   const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // Save edited project data
  const handleSaveChanges = async () => {
    console.log("Saving project data:", editData);

    try {
      const response = await fetch("http://localhost:8080/backend-servlet/UpdateProjectServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
        credentials: "include",
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.projectId === updatedProject.projectId ? updatedProject : project
          )
        );
        setShowModal(false); // Close the modal after saving
        alert("Project updated successfully.");
      } else {
        alert("Failed to update project.");
      }
    } catch (error) {
      console.error("Error saving project changes:", error);
      alert("There was an error updating the project.");
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Manage Projects</h2>
      <div className="overflow-x-auto table-responsive-sm">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Project ID</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Budget</th>
              <th className="p-3 border">Start Date</th>
              <th className="p-3 border">End Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.projectId} className="border-t">
                  <td className="p-3 border">{project.projectId}</td>
                  <td className="p-3 border">{project.title}</td>
                  <td className="p-3 border">{project.description}</td>
                  <td className="p-3 border">{project.budget}</td>
                  <td className="p-3 border">{project.startDate}</td>
                  <td className="p-3 border">{project.endDate}</td>
                  <td className="p-3 border">
                    <button className="btn btn-primary" onClick={() => handleEditClick(project)}>Edit</button>
                    <button className="btn btn-danger m-1" onClick={() => handleDelete(project)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No projects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Project Modal */}
      {showModal && (
        <div className="modal fade show d-block mt-30" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={editData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Budget</label>
                    <input
                      type="number"
                      name="budget"
                      className="form-control"
                      value={editData.budget}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      name="startdate"
                      className="form-control"
                      value={editData.startdate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      name="enddate"
                      className="form-control"
                      value={editData.enddate}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectManagement;
