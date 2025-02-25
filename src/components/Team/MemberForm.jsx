import React, { useState, useEffect } from "react";

const MemberForm = () => {
  const [selectedSubRole, setSelectedSubRole] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // ✅ Get logged-in user
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(storedUser);

    // ✅ Fetch only active "Team Member" users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const teamMembers = users.filter(
      (user) => user.role === "Team Member" && user.status !== "inactive"
    );
    setAvailableUsers(teamMembers);
  }, []);

  // Extract unique sub-roles for dropdown
  const uniqueSubRoles = [
    ...new Set(availableUsers.map((user) => user.subRole || user.Subrole)),
  ];

  // 🔄 Handle Sub-Role Selection
  const handleSubRoleChange = (e) => {
    const subRole = e.target.value;
    setSelectedSubRole(subRole);

    // Filter team members by selected sub-role
    const members = availableUsers.filter(
      (user) =>
        (user.subRole === subRole || user.Subrole === subRole) &&
        user.role === "Team Member"
    );
    setFilteredMembers(members);
    setSelectedMember("");
    setSuccessMessage("");
    setErrorMessage("");
  };

  // 👤 Handle Team Member Selection
  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // ✅ Handle Submit to localStorage
  const handleSubmit = () => {
    if (!selectedSubRole || !selectedMember) {
      setErrorMessage("Please select both Sub-Role and Team Member.");
      return;
    }
  
    if (!loggedInUser || loggedInUser.role !== "Project Manager") {
      setErrorMessage("Only Project Managers can add team members.");
      return;
    }
  
    // ✅ Generate or get teamId (Example: Using Project Manager's ID as teamId)
    const teamId = loggedInUser.id || Date.now(); // Fallback to timestamp if ID not available
  
    const newTeamMember = {
      name: selectedMember,
      subRole: selectedSubRole,
      id: Date.now(), // Unique ID for the member
      teamId: teamId, // ✅ Assign teamId
      addedBy: loggedInUser.username,
    };
  
    // Get existing team members or initialize empty array
    const storedTeamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
  
    // ⚠️ Prevent Duplicate Assignments
    const isDuplicate = storedTeamMembers.some(
      (member) =>
        member.name === selectedMember &&
        member.addedBy === loggedInUser.username
    );
  
    if (isDuplicate) {
      setErrorMessage(`${selectedMember} is already added to your team.`);
      return;
    }
  
    // ✅ Add new team member
    storedTeamMembers.push(newTeamMember);
  
    // Save updated list to localStorage
    localStorage.setItem("teamMembers", JSON.stringify(storedTeamMembers));
  
    // 🎉 Show Success Message
    setSuccessMessage(`${selectedMember} added successfully!`);
    setErrorMessage("");
  
    // Reset form
    setSelectedSubRole("");
    setSelectedMember("");
    setFilteredMembers([]);
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Select Team Member by Sub-Role</h2>

        {/* 🔽 Sub-Role Dropdown */}
        <div className="mb-3">
          <label className="form-label w-100">
            Select Sub-Role:
            <select
              className="form-control"
              value={selectedSubRole}
              onChange={handleSubRoleChange}
              required
            >
              <option value="">-- Select Sub-Role --</option>
              {uniqueSubRoles.map((subRole, index) => (
                <option key={index} value={subRole}>
                  {subRole}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 👥 Team Member Dropdown */}
        <div className="mb-3">
          <label className="form-label w-100">
            Select Team Member:
            <select
              className="form-control"
              value={selectedMember}
              onChange={handleMemberChange}
              disabled={!selectedSubRole}
              required
            >
              <option value="">
                {selectedSubRole
                  ? filteredMembers.length
                    ? "-- Select Team Member --"
                    : "No Members Found"
                  : "Select a Sub-Role First"}
              </option>
              {filteredMembers.map((user, index) => (
                <option key={index} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* ✅ Submit Button */}
        <button
          className="btn btn-dark w-100"
          onClick={handleSubmit}
          disabled={!selectedMember}
        >
          Add Team Member
        </button>

        {/* 🎉 Success & ⚠️ Error Messages */}
        {successMessage && (
          <div className="alert alert-success mt-3 text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger mt-3 text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberForm;
