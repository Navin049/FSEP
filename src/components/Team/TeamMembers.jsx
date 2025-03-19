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
    <div>
      {error && <p>{error}</p>}
      {projectDetails ? (
        <div>
          <h1>Project: {projectDetails.projectName}</h1>
          <h3>Project Manager: {projectDetails.projectManager}</h3>
          <h3>Team Members:</h3>
          {projectDetails.members.length === 0 ? (
            <p>No team members assigned to this project.</p>
          ) : (
            <ul>
              {projectDetails.members.map((member) => (
                <li key={member.id}>
                  <strong>{member.name}</strong> - {member.Subrole}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default TeamMembers;
