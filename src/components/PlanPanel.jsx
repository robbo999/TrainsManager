import React from "react";

export default function PlanPanel({ selectedTrain, setSelectedTrain, setShowPlan }) {
  const handleChange = (field, value) => {
    setSelectedTrain(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed left-0 top-0 h-full w-1/2 bg-[#1e2633] text-white p-6 overflow-y-auto shadow-lg z-40">
      <h2 className="text-xl font-semibold mb-4">ABC Train Plan</h2>

      <textarea
        className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
        placeholder="Plan A"
        value={selectedTrain.planA || ''}
        onChange={(e) => handleChange('planA', e.target.value)}
      />
      <textarea
        className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
        placeholder="Plan B"
        value={selectedTrain.planB || ''}
        onChange={(e) => handleChange('planB', e.target.value)}
      />
      <textarea
        className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
        placeholder="Plan C"
        value={selectedTrain.planC || ''}
        onChange={(e) => handleChange('planC', e.target.value)}
      />

      <div className="mb-4">
        <label className="text-sm font-medium mr-2">Active Plan:</label>
        <select
          className="bg-[#0d1117] border border-gray-700 p-2 rounded"
          value={selectedTrain.activePlan || 'A'}
          onChange={(e) => handleChange('activePlan', e.target.value)}
        >
          <option value="A">Plan A</option>
          <option value="B">Plan B</option>
          <option value="C">Plan C</option>
        </select>
      </div>

      <button
        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
        onClick={() => setShowPlan(false)}
      >
        Close Plan Panel
      </button>
    </div>
  );
}
