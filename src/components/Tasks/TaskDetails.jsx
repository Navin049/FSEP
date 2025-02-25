import React from "react";

const TaskDetails = ({ task }) => {
  if (!task) return <p>No task selected.</p>;

  return (
    <div className="card p-3">
      <h2>Task: {task.title}</h2>
      <p>Description: {task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
};

export default TaskDetails;
