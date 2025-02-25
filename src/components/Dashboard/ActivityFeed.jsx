import React, { useState, useEffect } from "react";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  // Load activities dynamically from localStorage
  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(storedActivities);
  }, []);

  return (
    <div className="card p-3">
      <h2>Recent Activities</h2>
      {activities.length === 0 ? (
        <p>No recent activities.</p>
      ) : (
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;
