import { Line, Bar } from "react-chartjs-2";

function Reports1() {
  // Crack growth over a week
  const crackTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Crack Growth (mm)",
        data: [1.2, 1.8, 2.4, 3.1, 3.6, 4.0, 4.8],
        borderColor: "#ff4d4d",
        backgroundColor: "rgba(255,77,77,0.2)",
        tension: 0.4,
      },
    ],
  };

  // Risk distribution by zones
  const riskZones = {
    labels: ["Zone A", "Zone B", "Zone C", "Zone D"],
    datasets: [
      {
        label: "Risk Level",
        data: [2, 5, 3, 1],
        backgroundColor: ["#28a745", "#ff4d4d", "#ffcc00", "#00e6e6"],
      },
    ],
  };

  return (
    <div className="report-container">
      <h2>📊 RockFall Reports</h2>
      <p>Analysis of slope stability, crack formation & risk prediction</p>

      {/* Summary Cards */}
      <div className="report-cards">
        <div className="report-card">
          <h3>📅 Last Updated</h3>
          <p>14 Sept 2025, 7:32 AM</p>
        </div>
        <div className="report-card">
          <h3>⚠ Current Risk</h3>
          <p className="high">High in Zone B</p>
        </div>
        <div className="report-card">
          <h3>📡 Active Sensors</h3>
          <p>2 Online</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="report-charts">
        <div className="chart-box">
          <h4>📈 Crack Growth (Last 7 Days)</h4>
          <Line data={crackTrend} />
        </div>
        <div className="chart-box">
          <h4>🗺 Risk Levels by Zone</h4>
          <Bar data={riskZones} />
        </div>
      </div>

      {/* Downloads */}
      <div className="download-section">
        <h3>⬇ Download Reports</h3>
        <button className="download-btn pdf">Download PDF</button>
        <button className="download-btn csv">Download CSV</button>
      </div>
    </div>
  );
}

export default Reports1;