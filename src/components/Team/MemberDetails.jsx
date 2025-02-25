import React from "react";

const MemberDetails = ({ member }) => {
  if (!member) return <p>No member selected.</p>;

  return (
    <div>
      <h2>Member: {member.name}</h2>
      <p>Role: {member.role}</p>
      <p>Email: {member.email}</p>
    </div>
  );
};

export default MemberDetails;
