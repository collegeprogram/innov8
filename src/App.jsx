import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/login";
import Home from "./Components/Home";
import Dashboard from "./Components/dashboard";
import Sensor from "./Components/Sensor";
import HelpDesk from "./Components/HelpDesk";
import SensorData from "./Components/SensorData";
import Reports1 from "./Components/Reports1";
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sensors" 
          element={
            <ProtectedRoute>
              <Sensor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <HelpDesk />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sensordata" 
          element={
            <ProtectedRoute>
              <SensorData />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports1" 
          element={
            <ProtectedRoute>
              <Reports1 />
            </ProtectedRoute>
          } 
        />

        {/* Catch all other routes - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}