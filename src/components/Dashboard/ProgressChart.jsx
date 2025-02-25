import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ completed, inProgress, pending }) => {
  const data = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [completed, inProgress, pending],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#e0a800", "#c82333"],
      },
    ],
  };

  return (
    <div className="card p-3">
      <h2>Project Progress</h2>
      <div className="chart-container" style={{ width: "300px", margin: "auto" }}>
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default ProgressChart;
