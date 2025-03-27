import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const TeamList = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchTeamMembers();
    fetchProjects();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("http://localhost:8080/backend-servlet/GetTeamMembersServlet", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data || []);
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        console.error("Error fetching projects:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSelectMember = (e, id) => {
    setSelectedMembers((prev) =>
      e.target.checked ? [...prev, id] : prev.filter((memberId) => memberId !== id)
    );
  };

  const handleAssignMembers = async () => {
    try {
      const requestPayload = {
        projectId: parseInt(selectedProject, 10),
        memberIds: selectedMembers.map((id) => parseInt(id, 10)),
      };

      const response = await fetch("http://localhost:8080/backend-servlet/AssignMembersToProjectServlet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include",
      });

      if (response.ok) {
        alert("Members assigned successfully!");
        setSelectedMembers([]);
      } else {
        console.error("Error assigning members:", response.statusText);
      }
    } catch (error) {
      console.error("Error assigning members:", error);
    }
  };

  const filteredAndSortedMembers = teamMembers
    .filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Assign Team Members to Projects</h3>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control w-25"
          onChange={(e) => setSortField(e.target.value)}
          value={sortField}
        >
          <option value="name">Sort by Name</option>
          <option value="role">Sort by Role</option>
          <option value="experienceLevel">Sort by Experience</option>
        </select>
        <button
          className="btn btn-secondary"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "⬆️ Ascending" : "⬇️ Descending"}
        </button>
      </div>

      <div className="mb-4">
        <label>Select Project: </label>
        <select
          className="form-control"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Role</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedMembers.length === 0 ? (
            <tr>
              <td colSpan="4">No team members found.</td>
            </tr>
          ) : (
            filteredAndSortedMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectMember(e, member.id)}
                  />
                </td>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.experienceLevel}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
