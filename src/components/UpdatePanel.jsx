import React, { useState } from 'react';
import { getLogTimestamp } from '../utils/logUtils';

export default function UpdatePanel({ selectedTrain, setShowUpdates }) {
  if (!selectedTrain) return null;

  const updates = selectedTrain.updates || [];

  return (
    <div className="fixed left-0 top-0 h-full w-1/2 bg-[#1e2633] text-white p-6 overflow-y-auto shadow-lg z-40">
      <h2 className="text-xl font-semibold mb-4">Change Log</h2>

      <div className="bg-[#0d1117] border border-gray-700 p-4 rounded overflow-y-auto text-sm space-y-2" style={{ maxHeight: 'calc(100vh - 150px)' }}>
        {updates.length > 0 ? (
          [...updates].reverse().map((u, i) => (
            <div key={i}>🕒 <strong>{u.time}</strong> — {u.message}</div>
          ))
        ) : (
          <div className="text-gray-400">No log entries available.</div>
        )}
      </div>

      <button
        className="mt-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white text-sm w-full"
        onClick={() => setShowUpdates(false)}
      >
        Close
      </button>
    </div>
  );
}