import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard'; // Your existing multi-incident dashboard

export default function App() {
  const [incidents, setIncidents] = useState([]);
  
  const createIncident = () => {
    const id = 'incident-' + Date.now();
    const newIncident = {
      id,
      title: `Incident ${incidents.length + 1}`,
      createdAt: new Date().toISOString(),
      trains: []
    };
    setIncidents([...incidents, newIncident]);
    return id;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <LandingPage
  incidents={incidents}
  onCreateIncident={() => {
    const newId = createIncident();
    navigate(`/incident/${newId}`);
  }}
  onConcludeIncident={(id) => {
    const updated = incidents.map(i =>
      i.id === id ? { ...i, status: 'Concluded', lastUpdate: new Date().toISOString() } : i
    );
    setIncidents(updated);
  }}
  onReopenIncident={(id) => {
  const updated = incidents.map(i =>
    i.id === id ? { ...i, status: 'Ongoing', lastUpdate: new Date().toISOString() } : i
  );
  setIncidents(updated);
}}
              onRenameIncident={(id, newTitle) => {
  const updated = incidents.map(incident =>
      incident.id === id
        ? { ...incident, title: newTitle, lastUpdate: new Date().toISOString() }
        : incident
    );
    setIncidents(updated);
  }}
/>


        } />
        <Route path="/incident/:id" element={
          <IncidentWrapper incidents={incidents} setIncidents={setIncidents} />
        } />
      </Routes>
    </Router>
  );
}

// Wraps your existing Dashboard for a specific incident
function IncidentWrapper({ incidents, setIncidents }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = incidents.find(i => i.id === id);

  const updateIncident = (updated) => {
    setIncidents(incidents.map(i => i.id === updated.id ? updated : i));
  };

  if (!incident) {
    return <p className="text-white p-6">Incident not found. <button onClick={() => navigate('/')}>Back to Home</button></p>;
  }

  return (
    <Dashboard
      incident={incident}
      onUpdate={updateIncident}
    />
  );
}
