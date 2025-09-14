import React, { useState } from "react";
import "./Drone.css";
const SCANS = [
  {
    id: 1,
    zone: "Zone A",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/05/Rock_crack_example.jpg",
    risk: "Low",
    ts: "2025-09-13 16:21",
    gps: "24.1200, 85.1200",
    notes: "Hairline crack, no immediate action required.",
  },
  {
    id: 2,
    zone: "Zone B",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/61/Cracked_rock.jpg",
    risk: "High",
    ts: "2025-09-14 10:45",
    gps: "24.1220, 85.1280",
    notes: "Deep vertical crack ~1.2m; evacuation recommended.",
  },
  {
    id: 3,
    zone: "Zone C",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Crack_in_rock.jpg",
    risk: "Medium",
    ts: "2025-09-14 11:05",
    gps: "24.1230, 85.1230",
    notes: "Widening along seam, monitor hourly.",
  },
];

function Drone() {
  const [selected, setSelected] = useState(SCANS[0]);

  const riskClass = (risk) => {
    if (risk === "High") return "risk-high";
    if (risk === "Medium") return "risk-medium";
    return "risk-low";
  };

  return (
    <div className="drone-container">
      <h2>🚁 Drone Surveillance</h2>
      <p className="muted">
        Drones capture real-time images for crack detection and rockfall risk
        prediction.
      </p>

      {/* Latest Scan */}
      <div className="latest-drone-scan">
        <div className="scan-header">
          <h3>📡 Latest Scan — {selected.zone}</h3>
          <div className={`badge ${riskClass(selected.risk)}`}>
            {selected.risk}
          </div>
        </div>

        <img
          src={selected.img}
          alt={`Drone scan ${selected.zone}`}
          className="drone-img"
        />

        <div className="scan-meta">
          <p>
            <strong>Captured:</strong> {selected.ts}
          </p>
          <p>
            <strong>GPS:</strong> {selected.gps}
          </p>
          <p>{selected.notes}</p>
        </div>
      </div>

      {/* Gallery */}
      <h3 className="gallery-title">🖼 Recent Drone Scans</h3>
      <div className="drone-gallery">
        {SCANS.map((scan) => (
          <button
            key={scan.id}
            className={`gallery-item ${
              selected.id === scan.id ? "active" : ""
            }`}
            onClick={() => setSelected(scan)}
          >
            <img src={scan.img} alt={`Scan ${scan.zone}`} />
            <div className="gallery-caption">
              <span>{scan.zone}</span>
              <span className={riskClass(scan.risk)}>{scan.risk}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Drone;
