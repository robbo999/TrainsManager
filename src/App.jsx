import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { supabase } from './supabaseClient';

export default function App() {
  const [incidents, setIncidents] = useState([]);

  // Load incidents from Supabase on first load
  useEffect(() => {
    const fetchIncidents = async () => {
      const { data, error } = await supabase.from('incidents').select('*');
      if (error) console.error('Fetch error:', error);
      else setIncidents(data);
    };
    fetchIncidents();
  }, []);

  // Save updated incidents to Supabase
  useEffect(() => {
    const saveIncidents = async () => {
      for (const incident of incidents) {
        await supabase.from('incidents').upsert(incident);
      }
    };
    if (incidents.length > 0) saveIncidents();
  }, [incidents]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingWrapper incidents={incidents} setIncidents={setIncidents} />} />
        <Route path="/incident/:id" element={<IncidentWrapper incidents={incidents} setIncidents={setIncidents} />} />
      </Routes>
    </Router>
  );
}

// Wrap LandingPage to access navigate
function LandingWrapper({ incidents, setIncidents }) {
  const navigate = useNavigate();

  const createIncident = () => {
    const id = 'incident-' + Date.now();
    const newIncident = {
      id,
      title: `Incident ${incidents.length + 1}`,
      createdAt: new Date().toISOString(),
      status: "Ongoing",
      trains: []
    };
    setIncidents([...incidents, newIncident]);
    navigate(`/incident/${id}`);
  };

  return (
    <LandingPage
      incidents={incidents}
      onCreateIncident={createIncident}
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
        const updated = incidents.map(i =>
          i.id === id ? { ...i, title: newTitle, lastUpdate: new Date().toISOString() } : i
        );
        setIncidents(updated);
      }}
    />
  );
}

// Wraps Dashboard for individual incidents
function IncidentWrapper({ incidents, setIncidents }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = incidents.find(i => i.id === id);

  const updateIncident = (updatedIncident) => {
    setIncidents(prev =>
      prev.map(i => i.id === updatedIncident.id ? updatedIncident : i)
    );
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
