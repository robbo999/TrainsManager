import React, { useState, useMemo } from 'react';

export default function MasterLogPanel({ masterLog, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrain, setSelectedTrain] = useState('');

  // Get unique train IDs for the filter dropdown
  const trainOptions = useMemo(() => {
    const trains = masterLog.map((log) => log.train).filter(Boolean);
    return [...new Set(trains)].sort();
  }, [masterLog]);

  // Filtered logs based on search and selected train
  const filteredLogs = useMemo(() => {
    return [...masterLog]
      .reverse()
      .filter((log) => {
        const matchesSearch =
          log.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.train?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTrain = selectedTrain ? log.train === selectedTrain : true;
        return matchesSearch && matchesTrain;
      });
  }, [masterLog, searchQuery, selectedTrain]);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar - 50% width */}
      <div className="w-1/2 bg-[#161b22] text-white p-4 overflow-y-auto shadow-2xl border-r border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📜 Master Log</h2>
          <button
            className="text-sm text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✖ Close
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search logs..."
            className="w-2/3 px-3 py-1 rounded-md bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="w-1/3 px-2 py-1 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none"
            value={selectedTrain}
            onChange={(e) => setSelectedTrain(e.target.value)}
          >
            <option value="">All Trains</option>
            {trainOptions.map((train, idx) => (
              <option key={idx} value={train}>
                {train}
              </option>
            ))}
          </select>
        </div>

        {/* Log Entries */}
        {filteredLogs.map((log, index) => (
          <div key={index} className="mb-3 border-b border-gray-700 pb-2">
            <div className="text-yellow-300 text-sm font-mono">🕒 {log.time}</div>
            <div className="text-green-400 text-xs font-semibold">
              Train: {log.train}
            </div>
            <div className="text-white text-sm">{log.message}</div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <p className="text-gray-400 text-sm italic">No logs match your criteria.</p>
        )}
      </div>

      {/* Overlay */}
      <div className="flex-1 bg-black bg-opacity-50" onClick={onClose} />
    </div>
  );
}
