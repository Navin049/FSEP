import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const ProjectList = ({ projectId }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    description: "",
    startdate: "",
    enddate: "",
    budget: "",
  });
  const [showModal, setShowModal] = useState(false);

  // Load projects from backend when the component mounts
  useEffect(() => {
    fetchProjects();
    if (!projectId) {
      console.log("Error: projectId is missing.");
      return;
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/ViewProjectServlet",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        // If the response contains a 'projects' array, set it to the state
        if (data.projects) {
          setProjects(data.projects); // Set the 'projects' array directly
        } else {
          console.error(
            "Received data does not contain 'projects' array:",
            data
          );
          setProjects([]); // Set empty projects if data format is unexpected
        }
      } else {
        console.error("Error fetching projects:", response.statusText);
        setProjects([]); // Set empty projects on error
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]); // Set empty projects on error
    }
  };

  const fetchTeamMembers = async (projectId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/backend-servlet/TeamMemberINProject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ projectId }),
        }
      );
  
      if (response.ok) {
        const membersData = await response.json();
  
        // Check if the response has a 'members' property
        if (membersData && Array.isArray(membersData.members)) {
          setTeamMembers(membersData.members); // Set the team members data
        } else {
          console.error("Invalid data format for team members:", membersData);
          setTeamMembers([]); // Reset to empty array if data format is unexpected
        }
      } else {
        console.error("Error fetching team members:", response.statusText);
        setTeamMembers([]); // Reset to empty array on error
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]); // Reset to empty array on error
    }
  };
  

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditData({
      id: project.projectId,
      name: project.name,
      description: project.description,
      startdate: project.startDate,
      enddate: project.endDate,
      budget: project.budget,
    });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    console.log("Editing project:", editData);

    if (!editData.id) {
      console.error("Project ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/backend-servlet/UpdateProjectServlet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        fetchProjects(); // Re-fetch projects after successful update
        setShowModal(false); // Close the modal
      } else {
        console.error("Error updating project:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting project with ID:", id);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/backend-servlet/DeleteProjectServlet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Project_ID: id }),
          }
        );

        if (response.ok) {
          fetchProjects(); // Re-fetch projects after deletion
        } else {
          console.error("Error deleting project:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleDeleteMember = async (memberId, projectId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this team member?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/backend-servlet/RemoveMemberFromProjectServlet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              member_id: memberId,
              project_id: projectId,
            }),
          }
        );

        if (response.ok) {
          fetchTeamMembers(projectId); // Re-fetch team members after deletion
        } else {
          console.error("Error removing team member:", response.statusText);
        }
      } catch (error) {
        console.error("Error removing team member:", error);
      }
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchTeamMembers(project.projectId); // Fetch team members for the selected project
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Projects</h2>

      {projects.length === 0 ? (
        <div className="alert alert-warning text-center">
          No projects available.
        </div>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div key={project.projectId} className="col-md-12 col-lg-12 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5
                    className="card-title text-primary cursor-pointer"
                    onClick={() => handleSelectProject(project)} // Handle project selection
                    style={{ cursor: "pointer" }}
                  >
                    {project.name}
                  </h5>
                  {selectedProject?.projectId === project.projectId && (
                    <div>
                      <p className="card-text text-muted">
                        {project.description}
                      </p>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Budget:</strong> ₹{project.budget}
                      </p>

                      <div className="d-flex justify-content-start gap-1">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditClick(project)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(project.projectId)}
                        >
                          Delete
                        </button>
                      </div>
                      {/* Team Members */}
                      <div className="mt-4">
                        <h5>Team Members:</h5>
                        {teamMembers.length === 0 ? (
                          <p>No team members assigned to this project.</p>
                        ) : (
                          <div className="row">
                            {teamMembers.map((member) => (
                              <div key={member.id} className="col-md-4 mb-3">
                                <div className="card shadow-sm">
                                  <div className="card-body d-flex justify-content-between align-items-center">
                                    {/* Team Member Info */}
                                    <div>
                                      <h6 className="card-title">
                                        {member.name}
                                      </h6>
                                      <p className="card-text">
                                        {member.Subrole || "N/A"}
                                      </p>
                                    </div>

                                    {/* Rounded remove button inline */}
                                    <button
                                      className="btn btn-info btn-sm rounded-circle p-2"
                                      onClick={() =>
                                        handleDeleteMember(
                                          member.id,
                                          project.projectId
                                        )
                                      }
                                      style={{
                                        border: "none",
                                        width: "30px",
                                        height: "30px",
                                      }}
                                    >
                                      <i className="bi bi-dash"></i>{" "}
                                      {/* Dash Icon */}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Project Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
            onClick={() => setShowModal(false)} // Close modal when clicking outside
          ></div>
          <div
            className="modal fade show d-block mt-30"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Project</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Project Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
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
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.startdate}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            startdate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.enddate}
                        onChange={(e) =>
                          setEditData({ ...editData, enddate: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Budget</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.budget}
                        onChange={(e) =>
                          setEditData({ ...editData, budget: e.target.value })
                        }
                      />
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
                      !editData.name ||
                      !editData.description ||
                      !editData.budget
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

export default ProjectList;
