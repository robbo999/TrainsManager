import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { supabase } from './supabaseClient';
import LoginPage from './LoginPage';


const isLive = import.meta.env.MODE === 'production';


export default function App() {
    const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
useEffect(() => {
  if (isLive) {
    const fetchFromSupabase = async () => {
      const { data, error } = await supabase.from('incidents').select('*');
      if (error) {
        console.error('❌ Supabase fetch error:', error);
      } else {
        console.log('✅ Fetched from Supabase:', data);
        setIncidents(data);
      }
    };
    fetchFromSupabase();
  } else {
    const stored = localStorage.getItem('incidents');
    if (stored) {
      setIncidents(JSON.parse(stored));
    }
  }
}, []);
const [authenticated, setAuthenticated] = useState(
  localStorage.getItem('authenticated') === 'true'
);


if (!authenticated) {
  return (
    <LoginPage onLogin={() => setAuthenticated(true)} />
  );
}

return (
  <Routes>
    <Route
  path="/"
  element={
    <LandingWrapper
      incidents={incidents}
      setIncidents={setIncidents}
      setAuthenticated={setAuthenticated} // ✅ Add this
    />
  }
/>
    <Route
      path="/incident/:id"
      element={
        <IncidentWrapper
          incidents={incidents}
          setIncidents={setIncidents}
        />
      }
    />
  </Routes>
);



useEffect(() => {
  if (isLive) {
    console.log('🌀 incidents useEffect triggered');
    console.log('📝 Trying to save incidents:', incidents);

    const saveToSupabase = async () => {
      for (const incident of incidents) {
        console.log('🧪 Upserting:', incident);
        const { error } = await supabase.from('incidents').upsert(incident);
        if (error) console.error('❌ Supabase save error:', error);
        else console.log('✅ Incident saved to Supabase:', incident.id);
      }
    };

    if (incidents.length > 0) saveToSupabase();
  } else {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }
}, [incidents]);



  return (
  <Routes>
    <Route path="/" element={<LandingWrapper incidents={incidents} setIncidents={setIncidents} />} />
    <Route path="/incident/:id" element={<IncidentWrapper incidents={incidents} setIncidents={setIncidents} />} />
  </Routes>
);

}

// Wrap LandingPage to access navigate
function LandingWrapper({ incidents, setIncidents, setAuthenticated }) {
  const navigate = useNavigate();


  const createIncident = () => {
  console.log('🆕 createIncident triggered');
  const id = 'incident-' + Date.now();
  const newIncident = {
    id,
    title: `Incident ${incidents.length + 1}`,
    createdAt: new Date().toISOString(),
    status: "Ongoing",
    trains: []
  };
  setIncidents([...incidents, newIncident]);
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
  onLogout={() => {
  localStorage.removeItem('authenticated');
  setAuthenticated(false);
  setLogoutTriggered(true);
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
