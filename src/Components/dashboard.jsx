import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Activity, 
  AlertTriangle, 
  Thermometer, 
  Wind, 
  Droplets, 
  Camera, 
  Wifi, 
  LogOut,
  Shield,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { io } from 'socket.io-client';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [sensorData, setSensorData] = useState({
    co2: 0,
    humidity: 0,
    temperature: 0,
    temperatureF: 0,
    timestamp: new Date()
  });
  
  const [historicalData, setHistoricalData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [riskLevel, setRiskLevel] = useState({ level: 'LOW', score: 0 });
  const [predictions, setPredictions] = useState([]);

  // Rockfall Risk Assessment Algorithm
  const calculateRiskLevel = (co2, temp, humidity) => {
    let riskScore = 0;
    let factors = [];

    // CO2 Analysis (geological activity indicator)
    if (co2 > 1000) {
      riskScore += 4;
      factors.push('High CO₂ levels detected');
    } else if (co2 > 800) {
      riskScore += 3;
      factors.push('Elevated CO₂ levels');
    } else if (co2 > 600) {
      riskScore += 2;
      factors.push('Moderate CO₂ increase');
    }

    // Temperature Analysis (thermal expansion/contraction)
    if (temp > 40 || temp < 0) {
      riskScore += 3;
      factors.push('Extreme temperature conditions');
    } else if (temp > 35 || temp < 5) {
      riskScore += 2;
      factors.push('Temperature stress on rock structure');
    }

    // Humidity Analysis (water infiltration risk)
    if (humidity > 95) {
      riskScore += 3;
      factors.push('Critical humidity - water infiltration risk');
    } else if (humidity > 85) {
      riskScore += 2;
      factors.push('High humidity affecting rock stability');
    } else if (humidity < 10) {
      riskScore += 1;
      factors.push('Very dry conditions - thermal stress');
    }

    // Risk Level Classification
    let level, color, bgColor, timeframe;
    if (riskScore >= 7) {
      level = 'CRITICAL';
      color = '#DC2626';
      bgColor = '#FEE2E2';
      timeframe = 'Immediate action required';
    } else if (riskScore >= 4) {
      level = 'HIGH';
      color = '#EA580C';
      bgColor = '#FED7AA';
      timeframe = 'Rockfall possible within 2-6 hours';
    } else if (riskScore >= 2) {
      level = 'MEDIUM';
      color = '#D97706';
      bgColor = '#FEF3C7';
      timeframe = 'Monitor closely - 12-24 hours';
    } else {
      level = 'LOW';
      color = '#059669';
      bgColor = '#D1FAE5';
      timeframe = 'Conditions stable';
    }

    return { level, score: riskScore, color, bgColor, factors, timeframe };
  };

  // WebSocket connection for real-time data
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('sensorData', (data) => {
      setSensorData(data);
      
      // Calculate risk level
      const risk = calculateRiskLevel(data.co2, data.temperature, data.humidity);
      setRiskLevel(risk);
      
      // Update historical data for charts
      setHistoricalData(prev => {
        const newEntry = {
          time: new Date(data.timestamp).toLocaleTimeString(),
          co2: data.co2,
          temperature: data.temperature,
          humidity: data.humidity,
          risk: risk.score
        };
        const updated = [...prev, newEntry];
        return updated.slice(-20); // Keep last 20 readings
      });

      // Update predictions
      setPredictions(prev => {
        const newPrediction = {
          time: new Date(data.timestamp).toLocaleTimeString(),
          risk: risk.score,
          level: risk.level
        };
        const updated = [...prev, newPrediction];
        return updated.slice(-10);
      });
    });

    return () => socket.disconnect();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  // Chart configurations
  const historicalChartData = {
    labels: historicalData.map(d => d.time),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.map(d => d.temperature),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'CO₂ (ppm)',
        data: historicalData.map(d => d.co2),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: historicalData.map(d => d.humidity),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      }
    ],
  };

  const riskBarData = {
    labels: predictions.map(p => p.time),
    datasets: [
      {
        label: 'Risk Score',
        data: predictions.map(p => p.risk),
        backgroundColor: predictions.map(p => {
          if (p.risk >= 7) return '#DC2626';
          if (p.risk >= 4) return '#EA580C';
          if (p.risk >= 2) return '#D97706';
          return '#059669';
        }),
        borderColor: '#1F2937',
        borderWidth: 1,
      },
    ],
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
    datasets: [
      {
        data: [
          predictions.filter(p => p.risk < 2).length,
          predictions.filter(p => p.risk >= 2 && p.risk < 4).length,
          predictions.filter(p => p.risk >= 4 && p.risk < 7).length,
          predictions.filter(p => p.risk >= 7).length,
        ],
        backgroundColor: ['#059669', '#D97706', '#EA580C', '#DC2626'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {/* Enhanced Sidebar */}
      <aside style={{
        width: '280px',
        background: 'linear-gradient(180deg, #1E293B 0%, #334155 100%)',
        color: 'white',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             RockFall Prediction 
          </h2>
          <p style={{ fontSize: '12px', opacity: '0.7' }}>Intelligent Monitoring System</p>
        </div>
        
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: '500'
              }}>
                <Activity size={20} />
                Dashboard
              </div>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="/sensordata" style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}>
                <Wind size={20} />
                Sensor Data
              </a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="/reports1" style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <TrendingUp size={20} />
                Reports
              </a>
            </li>
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#FCA5A5',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px' }}>
        {/* Header */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1A202C', marginBottom: '8px' }}>
                Rockfall Prediction Dashboard
              </h1>
              <p style={{ color: '#64748B', fontSize: '16px' }}>
                AI-powered real-time monitoring and prediction system
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: connectionStatus === 'connected' ? '#D1FAE5' : '#FEE2E2',
              color: connectionStatus === 'connected' ? '#059669' : '#DC2626'
            }}>
              <Wifi size={16} />
              {connectionStatus === 'connected' ? 'Live Data' : 'Offline'}
            </div>
          </div>
        </header>

        {/* Risk Assessment Panel */}
        <section style={{
          background: `linear-gradient(135deg, ${riskLevel.bgColor} 0%, ${riskLevel.bgColor}CC 100%)`,
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: `2px solid ${riskLevel.color}20`
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: riskLevel.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '48px',
                fontWeight: '700'
              }}>
                {riskLevel.score}
              </div>
              <h3 style={{ color: riskLevel.color, fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {riskLevel.level} RISK
              </h3>
              <p style={{ color: '#64748B' }}>{riskLevel.timeframe}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1A202C' }}>
                Risk Factors Detected:
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {riskLevel.factors?.map((factor, index) => (
                  <li key={index} style={{ marginBottom: '8px', color: '#4A5568' }}>{factor}</li>
                )) || <li style={{ color: '#64748B' }}>All parameters within normal range</li>}
              </ul>
            </div>

            <div>
              <Doughnut
                data={riskDistributionData}
                options={{
                  plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Risk Distribution' }
                  },
                  maintainAspectRatio: false
                }}
                height={150}
              />
            </div>
          </div>
        </section>

        {/* Current Conditions */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Thermometer size={24} style={{ color: '#EF4444' }} />
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>TEMPERATURE</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A202C' }}>
              {sensorData.temperature.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '14px', color: '#64748B' }}>
              {sensorData.temperatureF.toFixed(1)}°F
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Wind size={24} style={{ color: '#3B82F6' }} />
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>CO₂ LEVEL</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A202C' }}>
              {sensorData.co2.toFixed(1)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748B' }}>ppm</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Droplets size={24} style={{ color: '#10B981' }} />
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>HUMIDITY</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A202C' }}>
              {sensorData.humidity.toFixed(1)}%
            </div>
            <div style={{ fontSize: '14px', color: '#64748B' }}>Relative</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Shield size={24} style={{ color: riskLevel.color }} />
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>STABILITY</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: riskLevel.color }}>
              {riskLevel.level}
            </div>
            <div style={{ fontSize: '14px', color: '#64748B' }}>Current Status</div>
          </div>
        </section>

        {/* Charts Section */}
        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1A202C' }}>
              📊 Historical Environmental Data
            </h3>
            {historicalData.length > 0 && (
              <Line
                data={historicalChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: { drawOnChartArea: false },
                    },
                  },
                }}
                height={100}
              />
            )}
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1A202C' }}>
              ⚠️ Risk Score Trend
            </h3>
            {predictions.length > 0 && (
              <Bar
                data={riskBarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { max: 10, min: 0 }
                  }
                }}
                height={150}
              />
            )}
          </div>
        </section>

        {/* Drone Information Panel */}
        <section style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Camera size={24} />
              🚁 Drone Surveillance System
            </h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                <span style={{ fontSize: '14px', color: '#64748B' }}>Drone Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} style={{ color: '#64748B' }} />
                <span style={{ fontSize: '14px', color: '#64748B' }}>Zone A-C Coverage</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{
              border: '2px dashed #E2E8F0',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <Camera size={48} style={{ color: '#64748B', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Latest Capture</h4>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Zone A - 10:30 AM</p>
              <p style={{ color: '#10B981', fontSize: '12px', marginTop: '8px' }}>✅ No cracks detected</p>
            </div>

            <div style={{
              border: '2px dashed #FED7AA',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              backgroundColor: '#FFF7ED'
            }}>
              <AlertTriangle size={48} style={{ color: '#EA580C', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Alert Zone</h4>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Zone B - 09:45 AM</p>
              <p style={{ color: '#EA580C', fontSize: '12px', marginTop: '8px' }}>⚠️ Minor crack: 2.3mm</p>
            </div>

            <div style={{
              border: '2px dashed #E2E8F0',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <Clock size={48} style={{ color: '#64748B', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Next Patrol</h4>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Zone C - 11:00 AM</p>
              <p style={{ color: '#64748B', fontSize: '12px', marginTop: '8px' }}>📋 Scheduled inspection</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;