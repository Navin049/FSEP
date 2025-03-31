import React, { useState, useEffect } from "react"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const TeamList = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [assignedMembers, setAssignedMembers] = useState([]);  // Store the members already assigned to the project
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting configuration

  // Fetch team members from backend
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch assigned members when the selected project changes
  useEffect(() => {
    if (selectedProject) {
      fetchAssignedMembers(selectedProject);
      
    }
  }, [selectedProject]);

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
        setProjects(data.projects || []); // Assuming the response contains a 'projects' array or fallback to empty array
      } else {
        console.error("Error fetching projects:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchAssignedMembers = async (projectId) => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/GetAssignedMembersForProjectServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Ensure the assignedMembers is always an array
        setAssignedMembers(Array.isArray(data) ? data : []); // Fallback to empty array if not an array
      } else {
        console.error("Error fetching assigned members:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching assigned members:", error);
    }
  };
  

  // Handle checkbox selection for members
const handleSelectMember = (e, id) => {
  if (e.target.checked) {
    // Check if the member is already in the assigned members list
    if (assignedMembers.some((member) => member.id === id)) {
      alert("This member is already assigned to the selected project!");
      e.target.checked = false;  // Uncheck the box
    } else {
      setSelectedMembers((prevSelectedMembers) => [...prevSelectedMembers, id]);
    }
  } else {
    setSelectedMembers((prevSelectedMembers) => prevSelectedMembers.filter((memberId) => memberId !== id));
  }
};

  // Handle form submission to assign members to the selected project
  const handleAssignMembers = async () => {
    try {
      const requestPayload = {
        projectId: selectedProject,
        memberIds: selectedMembers,
      };
  
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

  // Search function: filters based on all fields
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Sorting function
  const handleSorting = (key) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  // Sort team members based on selected column and direction
  const sortedMembers = [...teamMembers].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key]?.toLowerCase() || "";
      const bValue = b[sortConfig.key]?.toLowerCase() || "";
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  // Filter team members based on search term
  const filteredMembers = sortedMembers.filter((member) =>
    Object.values(member).some((value) =>
      value.toString().toLowerCase().includes(searchTerm)
    )
  );

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

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search Team Members"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Team Members List */}
      <div>
        <h4>Team Members</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Select</th>
              <th 
                onClick={() => handleSorting("name")}
                style={{ cursor: 'pointer' }}
              >
                Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th 
                onClick={() => handleSorting("email")}
                style={{ cursor: 'pointer' }}
              >
                Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th 
                onClick={() => handleSorting("role")}
                style={{ cursor: 'pointer' }}
              >
                Role {sortConfig.key === "role" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th 
                onClick={() => handleSorting("subrole")}
                style={{ cursor: 'pointer' }}
              >
                SubRole {sortConfig.key === "subrole" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Phone</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Availability</th>
              <th>Experience Level</th>
              <th>Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr><td colSpan="7">No matching team members found...</td></tr>
            ) : (
              filteredMembers.map((member) => (
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

export default TeamList;
