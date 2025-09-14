import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Thermometer, Droplets, Wind, Clock } from 'lucide-react';

function SensorData() {
  const [realtimeData, setRealtimeData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [socket, setSocket] = useState(null);
  const [latestReading, setLatestReading] = useState(null);

  useEffect(() => {
    console.log('Connecting to sensor backend...');
    
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('✅ Connected to sensor server');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('❌ Disconnected from sensor server');
    });

    newSocket.on('connect_error', (err) => {
      setConnectionStatus('error');
      console.log('Connection error:', err);
    });

    newSocket.on('sensorData', (data) => {
      console.log('📥 Received new sensor data:', data);
      
      const newReading = {
        id: Date.now(),
        temperature: data.temperature || 0,
        temperatureF: data.temperatureF || 0,
        co2: data.co2 || 0,
        humidity: data.humidity || 0,
        timestamp: new Date(data.timestamp).toLocaleTimeString(),
        fullTimestamp: new Date(data.timestamp)
      };

      setLatestReading(newReading);
      
      setRealtimeData(prevData => {
        const updatedData = [newReading, ...prevData];
        return updatedData.slice(0, 20);
      });
    });

    return () => {
      console.log('Disconnecting from sensor server...');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const getConnectionStatusStyle = () => {
    switch (connectionStatus) {
      case 'connected':
        return { 
          color: '#10B981', 
          bg: '#D1FAE5', 
          text: '🟢 Live Data Connected',
          pulse: true 
        };
      case 'error':
        return { 
          color: '#EF4444', 
          bg: '#FEE2E2', 
          text: '🔴 Connection Failed' 
        };
      default:
        return { 
          color: '#F59E0B', 
          bg: '#FEF3C7', 
          text: '🟡 Connecting...' 
        };
    }
  };

  const statusStyle = getConnectionStatusStyle();

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#F8FAFC',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          🏔️ Environmental Monitoring System
        </h1>
        <p style={{ 
          fontSize: '18px', 
          opacity: '0.9', 
          marginBottom: '20px' 
        }}>
          Real-time sensor data for geological stability monitoring
        </p>
        
        <div style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px', 
          backgroundColor: statusStyle.bg, 
          borderRadius: '24px',
          fontSize: '14px',
          color: statusStyle.color,
          fontWeight: '600',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{
            animation: statusStyle.pulse ? 'pulse 2s infinite' : 'none'
          }}>
            {statusStyle.text}
          </span>
        </div>
      </div>

      {/* Current Reading Cards */}
      {latestReading && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          {/* Temperature Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(255, 107, 107, 0.3)',
            transform: 'translateY(0)',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '4px' }}>Temperature</p>
                <p style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                  {latestReading.temperature.toFixed(1)}°C
                </p>
                <p style={{ fontSize: '14px', opacity: '0.8' }}>
                  {latestReading.temperatureF.toFixed(1)}°F
                </p>
              </div>
              <Thermometer size={48} style={{ opacity: '0.8' }} />
            </div>
          </div>

          {/* CO2 Card */}
          <div style={{
            background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(78, 205, 196, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '4px' }}>CO₂ Level</p>
                <p style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                  {latestReading.co2.toFixed(1)}
                </p>
                <p style={{ fontSize: '14px', opacity: '0.8' }}>ppm</p>
              </div>
              <Wind size={48} style={{ opacity: '0.8' }} />
            </div>
          </div>

          {/* Humidity Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '4px' }}>Humidity</p>
                <p style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                  {latestReading.humidity.toFixed(1)}
                </p>
                <p style={{ fontSize: '14px', opacity: '0.8' }}>%</p>
              </div>
              <Droplets size={48} style={{ opacity: '0.8' }} />
            </div>
          </div>
        </div>
      )}

      {/* Connection Error */}
      {connectionStatus === 'error' && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '2px solid #FECACA',
          color: '#DC2626',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Connection Error!</h3>
              <p>Make sure your backend server is running on http://localhost:5000</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E2E8F0'
      }}>
        {/* Table Header */}
        <div style={{
          background: 'linear-gradient(90deg, #F8FAFC, #E2E8F0)',
          padding: '24px',
          borderBottom: '2px solid #E2E8F0'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1A202C',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 Historical Data ({realtimeData.length}/20)
          </h2>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#F7FAFC' }}>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#4A5568',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock size={16} />
                  Timestamp
                </th>
                <th style={tableHeaderStyle}>
                  <Thermometer size={16} style={{ marginRight: '8px', display: 'inline' }} />
                  Temperature
                </th>
                <th style={tableHeaderStyle}>
                  <Wind size={16} style={{ marginRight: '8px', display: 'inline' }} />
                  CO₂ Level
                </th>
                <th style={tableHeaderStyle}>
                  <Droplets size={16} style={{ marginRight: '8px', display: 'inline' }} />
                  Humidity
                </th>
              </tr>
            </thead>
            <tbody>
              {realtimeData.length > 0 ? (
                realtimeData.map((reading, index) => (
                  <tr key={reading.id} style={{
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    transition: 'background-color 0.2s ease'
                  }}>
                    <td style={tableCellStyle}>
                      <span style={{ 
                        fontWeight: '500',
                        color: index === 0 ? '#10B981' : '#4A5568'
                      }}>
                        {reading.timestamp}
                        {index === 0 && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '10px',
                            backgroundColor: '#10B981',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontWeight: '600'
                          }}>
                            LATEST
                          </span>
                        )}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <div>
                        <span style={{ 
                          fontWeight: '600', 
                          fontSize: '16px',
                          color: '#E53E3E'
                        }}>
                          {reading.temperature.toFixed(1)}°C
                        </span>
                        <br />
                        <small style={{ color: '#718096', fontSize: '12px' }}>
                          ({reading.temperatureF.toFixed(1)}°F)
                        </small>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ 
                        fontWeight: '600', 
                        fontSize: '16px',
                        color: '#319795'
                      }}>
                        {reading.co2.toFixed(1)}
                      </span>
                      <span style={{ color: '#718096', marginLeft: '4px' }}>ppm</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ 
                        fontWeight: '600', 
                        fontSize: '16px',
                        color: '#3182CE'
                      }}>
                        {reading.humidity.toFixed(1)}
                      </span>
                      <span style={{ color: '#718096', marginLeft: '4px' }}>%</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{
                    padding: '60px 24px',
                    textAlign: 'center',
                    color: '#A0AEC0',
                    fontSize: '16px'
                  }}>
                    <div>
                      <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>
                        📡
                      </span>
                      {connectionStatus === 'connected' 
                        ? 'Waiting for sensor data...' 
                        : 'No data available. Please check connection.'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {realtimeData.length > 0 && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#F7FAFC',
            borderTop: '1px solid #E2E8F0',
            fontSize: '14px',
            color: '#4A5568',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              📊 Showing {realtimeData.length} most recent readings
            </span>
            <span>
              🔄 Updates every 2 seconds
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .sensor-card:hover {
          transform: translateY(-4px) !important;
        }
        
        tbody tr:hover {
          background-color: #EDF2F7 !important;
        }
      `}</style>
    </div>
  );
}

const tableHeaderStyle = {
  padding: '16px 24px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '14px',
  color: '#4A5568',
  borderBottom: '1px solid #E2E8F0'
};

const tableCellStyle = {
  padding: '16px 24px',
  fontSize: '14px',
  color: '#2D3748',
  verticalAlign: 'middle'
};

export default SensorData;