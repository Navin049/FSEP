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
      <div className="card border-0 shadow">
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <div className="timeline mt-3">
                <div className="timeline-item pb-3 border-start border-2 border-primary ps-3 position-relative">
                  <div
                    className="timeline-marker position-absolute bg-primary rounded-circle"
                    style={{ width: "12px", height: "12px", left: "-6px", top: "6px" }}
                  ></div>
                  <p className="mb-1 fw-bold">Profile Updated</p>
                  <p className="text-muted small">{user?.updated_at}</p>
                </div>
                <div className="timeline-item pb-3 border-start border-2 border-primary ps-3 position-relative">
                  <div
                    className="timeline-marker position-absolute bg-primary rounded-circle"
                    style={{ width: "12px", height: "12px", left: "-6px", top: "6px" }}
                  ></div>
                  <p className="mb-1 fw-bold">Joined Project "Website Redesign"</p>
                  <p className="text-muted small">3 days ago</p>
                </div>
                <div className="timeline-item pb-3 border-start border-2 border-primary ps-3 position-relative">
                  <div
                    className="timeline-marker position-absolute bg-primary rounded-circle"
                    style={{ width: "12px", height: "12px", left: "-6px", top: "6px" }}
                  ></div>
                  <p className="mb-1 fw-bold">Completed Task "Database Migration"</p>
                  <p className="text-muted small">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
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
