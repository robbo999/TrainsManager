import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({
  incidents,
  onCreateIncident,
  onConcludeIncident,
  onReopenIncident,
  onRenameIncident
}) {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const clearSearch = () => setSearchTerm('');

  const filteredIncidents = incidents
    .filter(i =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'All' || i.status === statusFilter)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold">Stranded Trains Manager – By LR</h1>
          <p className="text-gray-400 mt-3 text-lg">Track, manage and resolve rail incidents efficiently.</p>
        </header>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full sm:w-auto flex-grow">
            <input
              type="text"
              placeholder="Search incidents..."
              className="flex-grow bg-[#161b22] border border-gray-700 text-white p-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={clearSearch}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#161b22] border border-gray-700 text-white p-2 rounded"
          >
            <option value="All">All</option>
            <option value="Ongoing">🟢 Ongoing</option>
            <option value="Concluded">🔴 Concluded</option>
          </select>

          <button
            onClick={onCreateIncident}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded text-lg"
          >
            + Create New Incident
          </button>
        </div>

        <div className="bg-[#161b22] p-4 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Current Incidents</h2>
          {filteredIncidents.length === 0 ? (
            <p className="text-gray-400">No matching incidents found.</p>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-sm text-gray-400">
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Created</th>
                  <th className="px-4 py-2">Trains</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Last Update</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="bg-[#1e2633] hover:bg-[#273142]">
                    <td className="px-4 py-2 font-bold">
                      {editingId === incident.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="bg-[#0d1117] border border-gray-600 px-2 py-1 rounded text-white w-48"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onRenameIncident(incident.id, editedTitle);
                                setEditingId(null);
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              onRenameIncident(incident.id, editedTitle);
                              setEditingId(null);
                            }}
                            className="text-green-400 hover:underline text-sm"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span>{incident.title}</span>
                          <button
                            onClick={() => {
                              setEditingId(incident.id);
                              setEditedTitle(incident.title);
                            }}
                            className="text-blue-400 hover:underline text-sm"
                          >
                            ✏️ Rename
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">{new Date(incident.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2">{incident.trains.length}</td>
                    <td className="px-4 py-2">
                      {incident.status === 'Concluded' ? (
                        <span className="text-red-400 font-semibold">🔴 Concluded</span>
                      ) : (
                        <span className="text-green-400 font-semibold">🟢 Ongoing</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {incident.lastUpdate ? new Date(incident.lastUpdate).toLocaleTimeString() : '—'}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => navigate(`/incident/${incident.id}`)}
                        className="text-blue-400 hover:underline text-sm"
                      >
                        View
                      </button>
                      {incident.status === 'Concluded' ? (
                        <button
                          onClick={() => onReopenIncident(incident.id)}
                          className="text-green-400 hover:underline text-sm"
                        >
                          Reopen
                        </button>
                      ) : (
                        <button
                          onClick={() => onConcludeIncident(incident.id)}
                          className="text-yellow-400 hover:underline text-sm"
                        >
                          Conclude
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}