import React, { useState, useEffect } from "react";

const TeamMembers = ({ projectId }) => {
  const [projectDetails, setProjectDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = loggedInUser ? loggedInUser.userId : null;

    if (projectId !== null && userId !== null) {
      const fetchProjectDetails = async () => {
        try {
          console.log("Sending projectId:", projectId, "userId:", userId);
          const response = await fetch("http://localhost:8080/backend-servlet/GetAssignedMembersForProjectServlet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectId, userId }),
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch project details");
          }

          const projectData = await response.json();
          console.log("Received project data:", projectData);

          setProjectDetails(projectData.projects);
        } catch (error) {
          setError("Error fetching project details");
        }
      };

      fetchProjectDetails();
    }
  }, [projectId]);

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      {projectDetails.length > 0 ? (
        projectDetails.map((project) => (
          <div key={project.projectId}>
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h1 className="card-title mb-0">{project.projectName}</h1>
              </div>
              <div className="card-body">
                <h3 className="text-muted">Project Manager: {project.projectManager}</h3>
                <hr />
                <h4 className="mt-3">Team Members:</h4>
                {project.members && project.members.length === 0 ? (
                  <div className="alert alert-warning mt-3">No team members assigned to this project.</div>
                ) : (
                  <ul className="list-group mt-3">
                    {project.members.map((member) => (
                      <li
                        key={member.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{member.name}</strong>
                          <br />
                          <span className="text-muted">{member.Subrole}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
