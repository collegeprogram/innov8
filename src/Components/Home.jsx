import { useState } from "react";
import "../App.css";
import crack1 from "../assets/crack1.jpg";
import danger from "../assets/Danger.jpg";
import medium from "../assets/medium.jpg";


export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"> RockFall Prediction</div>

        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/sensors">Sensor Data</a>
          <a href="/reports">Reports</a>
          <a href="/help">Help Desk</a>

          {/* Dropdown Example (Site Zones) */}
          <div
            className="dropdown"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <button className="dropbtn">Mine Zones ▾</button>
            {showMenu && (
              <div className="dropdown-content">
                <a href="#">Zone A</a>
                <a href="#">Zone B</a>
                <a href="#">Zone C</a>
              </div>
            )}
          </div>
        </div>

        <a href="/signup">
          <button className="signin">Sign In</button>
        </a>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to Rockfall Prediction Dashboard</h1>
        <p>
          Real-time monitoring of slope stability, vibration, and crack
          formation to ensure safe mining operations.
        </p>

        {/* Quick Status */}
        <div className="status-cards">
          <div className="status-card yellow">
            <h3>Rockfall Risk</h3>
            <p>Medium</p>
          </div>
          <div className="status-card green">
            <h3>Sensors Online</h3>
            <p>Active=2</p>
          </div>
          <div className="status-card red">
            <h3>Latest Crack</h3>
            <p>Detected in Zone B</p>
          </div>
        </div>
      </header>

      {/* Alerts Section */}
      <section className="alerts">
        <h2>Prediction Alerts</h2>
        <div className="alert-box red">
           Rock movement detected near slope – possible fall in next 2 hours
        </div>
        <div className="alert-box yellow">
           Weather Alert: Heavy Rain may affect slope stability
        </div>
      </section>

      {/* Monitoring Section */}
      <section className="monitoring">
        <h2>Live Monitoring</h2>
        <div className="monitor-grid">
            <button className="btn1">
            <div className="monitor-card">
            <h3>Weather</h3>
            <p>Provide real time weather updates to assess environmental factors</p>
          </div>
          </button>
          <button className="btn1">
          <div className="monitor-card">
            <h3> Vibration</h3>
            <p>Monitors ground vibration to detect unusual movements.</p>
          </div>
          </button>
          <button className="btn1">
          <div className="monitor-card">
            <h3> Crack Detection</h3>
            <p>Tracks crack formation and widening in rock surfaces.</p>
          </div>
          </button>
          <button className="btn1">
          <div className="monitor-card">
            <h3> Slope Angle</h3>
            <p>Measures slope shifts to identify early instability.</p>
          </div>
          </button>
          <button className="btn1">
          <div className="monitor-card">
            <h3> Rockfall Risk Level</h3>
            <p>Predicts danger using real-time sensor + AI analysis.</p>
          </div>
          </button>
        </div>
      </section>
    <section className="drone">
      <h2> Drone Surveillance – Crack & Rock Pattern Detection</h2>
      <p>
        Our drone system captures high-resolution images of slopes and rocks,
        then uses AI to detect cracks, surface changes, and potential rockfall
        risks.
      </p>

      {/* Drone Actions */}
      <div className="drone-actions">
        <button className="btn"> Start Drone Scan</button>
        <button className="btn"> Upload Image</button>
        <button className="btn"> Download Report</button>
      </div>

      {/* Captured Images Grid */}
      <div className="drone-grid">
        <div className="drone-card">
          <img src={crack1} alt="Drone capture"/>
          <h3>Type A</h3>
          <p> No major cracks detected</p>
          <p className="safe">Risk: Low</p>
        </div>

        <div className="drone-card">
          <img src={danger} alt="Drone capture" />
          <h3>Type B</h3>
          <p>⚠ Surface crack length ~15 cm</p>
          <p className="medium">Risk: Medium</p>
        </div>

        <div className="drone-card">
          <img src= {medium} alt="Drone capture" />
          <h3>Type C</h3>
          <p> Multiple cracks detected</p>
          <p className="high">Risk: High</p>
        </div>
      </div>
    </section>
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Rockfall Prediction – Team SIH</p>
      </footer>
    </div>
  );
}