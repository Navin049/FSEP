import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const MemberForm = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch team members from backend
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/GetTeamMembersServlet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);  // Log the response data to debug
        setTeamMembers(data || []); // Directly set the array if it is an array
      } else {
        console.error("Error fetching team members:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/ViewProjectServlet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);  // Log the response data to debug
        setProjects(data.projects || []); // Assuming the response contains a 'projects' array or fallback to empty array
      } else {
        console.error("Error fetching projects:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Handle checkbox selection for members
  const handleSelectMember = (e, id) => {
    setSelectedMembers((prevSelectedMembers) => {
      if (e.target.checked) {
        return [...prevSelectedMembers, id];
      } else {
        return prevSelectedMembers.filter(memberId => memberId !== id);
      }
    });
  };

  // Handle form submission to assign members to the selected project
  const handleAssignMembers = async () => {
    try {
      // Ensure selectedProject is an integer
    const projectId = parseInt(selectedProject, 10); // Convert to integer

    // Ensure selectedMembers contains integers
    const memberIds = selectedMembers.map(id => parseInt(id, 10));
      const requestPayload = {
        projectId: selectedProject,
        memberIds: selectedMembers,
      };
      console.log("Request Payload: ", requestPayload); // Check the payload before sending
  
      const response = await fetch("http://localhost:8080/backend-servlet/AssignMembersToProjectServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
        credentials: "include",
      });
  
      if (response.ok) {
        alert("Members assigned successfully!");
        setSelectedMembers([]); // Clear selected members
      } else {
        console.error("Error assigning members:", response.statusText);
      }
    } catch (error) {
      console.error("Error assigning members:", error);
    }
  };
  

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Assign Team Members to Projects</h3>

      {/* Select Project */}
      <div className="mb-4">
        <label>Select Project: </label>
        <select
          className="form-control"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select a project</option>
          {projects && Array.isArray(projects) && projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Team Members List */}
      <div>
        <h4>Team Members</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>SubRole</th>
              <th>Phone</th>
              <th>Company</th>
              <th>bio</th>
              <th>availability</th>
              <th>experienceLevel</th>
              <th>Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.length === 0 ? (
              <tr><td colSpan="7">Loading team members...</td></tr>
            ) : (
              teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectMember(e, member.id)}
                    />
                  </td>
                  <td>{member.name}</td>
                  <td>{member.email || "N/A"}</td>
                  <td>{member.role}</td>
                  <td>{member.subrole}</td>
                  <td>{member.phone || "N/A"}</td>
                  <td>{member.company || "N/A"}</td>
                  <td>{member.bio}</td>
                  <td>{member.availability}</td>
                  <td>{member.experienceLevel}</td>
                 
                  <td>
                    {member.profilePic ? (
                      <img
                        src={member.profilePic}
                        alt="Profile"
                        width="50"
                        height="50"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/50"
                        alt="No Profile"
                        width="50"
                        height="50"
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Button */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={handleAssignMembers}
          disabled={!selectedProject || selectedMembers.length === 0}
        >
          Assign Selected Members to Project
        </button>
      </div>
    </div>
  );
};

export default MemberForm;
