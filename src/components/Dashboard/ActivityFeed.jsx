import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8080/backend-servlet/RecentActivityServlet", {
        withCredentials: true, // Needed for sending cookies/session
      });
      setActivities(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <h2>Recent Activities</h2>
      {loading ? (
        <p>Loading...</p>
      ) : activities.length === 0 ? (
        <p>No recent activities.</p>
      ) : (
        <div className="card border-0 shadow">
          <div className="card-body">
            <h5 className="card-title">Activity Timeline</h5>
            <div className="timeline mt-3">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="timeline-item pb-3 border-start border-2 border-primary ps-3 position-relative"
                >
                  <div
                    className="timeline-marker position-absolute bg-primary rounded-circle"
                    style={{ width: "12px", height: "12px", left: "-6px", top: "6px" }}
                  ></div>
                  <p className="mb-1 fw-bold">
                    {activity.actor} - {activity.type}
                  </p>
                  <p className="text-muted small">
                    {activity.title} | {new Date(activity.activityTime).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
