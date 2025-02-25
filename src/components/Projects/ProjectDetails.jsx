import React from "react";

const ProjectDetails = ({ project }) => {
  if (!project) return <p>No project selected.</p>;

  return (
    <div>
      <h2>Project: {project.name}</h2>
      <p>Description: {project.description}</p>
      <p>Deadline: {project.deadline}</p>
    </div>
  );
};

export default ProjectDetails;
