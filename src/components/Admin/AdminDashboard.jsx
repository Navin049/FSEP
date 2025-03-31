import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [userCounts, setUserCounts] = useState({});
  const [projectsCount, setProjectsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);

  useEffect(() => {
    // Fetch the data from the backend servlet
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:8080/backend-servlet/AdminDashboardServlet");
        if (response.ok) {
          const data = await response.json();
          setUserCounts({
            "Project manager": data["Project manager"] || 0,
            "Team Member": data["Team Member"] || 0,
          });
          setProjectsCount(data.projects || 0);
          setTasksCount(data.tasks || 0);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Data for the "User Types" Pie Chart
  const userTypeData = {
    labels: ["Project manager", "Team Member"],
    datasets: [
      {
        data: [userCounts["Project manager"], userCounts["Team Member"]], 
        backgroundColor: ["#007bff", "#ffc107"],
        hoverBackgroundColor: ["#0056b3", "#e0a800"],
      },
    ],
  };

  // Data for the "Metrics" Bar Chart
  const metricsData = {
    labels: ["Projects", "Tasks"],
    datasets: [
      {
        label: "Count",
        data: [projectsCount, tasksCount],
        backgroundColor: ["#17a2b8", "#fd7e14"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Welcome, <strong>Admin</strong></h2>
      <div className="row">
        {/* Pie Chart - User Types */}
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>User Types</h5>
            <Pie data={userTypeData} />
          </div>
        </div>

        {/* Bar Chart - Metrics */}
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>Metrics</h5>
            <Pie data={metricsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
