import React, { useState, useEffect } from "react";

const TeamMembers = ({ projectId }) => {
  const [projectDetails, setProjectDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/GetAssignedMembersForProjectServlet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }

        const projectData = await response.json();
        setProjectDetails(projectData);
      } catch (error) {
        setError("Error fetching project details");
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      {projectDetails ? (
        <div>
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h1 className="card-title mb-0">{projectDetails.projectName}</h1>
            </div>
            <div className="card-body">
              <h3 className="text-muted">Project Manager: {projectDetails.projectManager}</h3>
              <hr />
              <h4 className="mt-3">Team Members:</h4>
              {projectDetails.members.length === 0 ? (
                <div className="alert alert-warning mt-3">
                  No team members assigned to this project.
                </div>
              ) : (
                <ul className="list-group mt-3">
                  {projectDetails.members.map((member) => (
                    <li
                      key={member.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{member.name}</strong>
                        <br />
                        <span className="text-muted">{member.Subrole}</span>
                      </div>
                      {/* <button className="btn btn-outline-info btn-sm">View Profile</button> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
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
