import React from 'react';

export default function AdvancedPanel({ selectedTrain, setSelectedTrain, setShowAdvanced }) {
  if (!selectedTrain) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-1/2 bg-[#1e2633] text-white p-6 overflow-y-auto shadow-lg z-40">
      <h2 className="text-xl font-semibold mb-4">Advanced Details</h2>

      <h3 className="text-lg font-semibold mb-2 mt-4">Stranding Context</h3>
      <textarea placeholder="Reason for train being stranded" value={selectedTrain.reasonStranded || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, reasonStranded: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Likely duration and confidence" value={selectedTrain.estimatedDuration || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, estimatedDuration: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Time of day / day of week" value={selectedTrain.timeOfDay || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, timeOfDay: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />

      <h3 className="text-lg font-semibold mb-2 mt-6">Location & Access Conditions</h3>
      <textarea placeholder="Distance to nearest station" value={selectedTrain.distanceToStation || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, distanceToStation: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Distance to nearest access point" value={selectedTrain.distanceToAccess || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, distanceToAccess: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Describe access route" value={selectedTrain.accessDescription || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, accessDescription: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Topography & infrastructure" value={selectedTrain.topography || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, topography: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />

      <h3 className="text-lg font-semibold mb-2 mt-6">Onboard & Passenger Risk</h3>
      <textarea placeholder="Train loading conditions" value={selectedTrain.loadingConditions || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, loadingConditions: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Vulnerable passengers" value={selectedTrain.vulnerablePassengers || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, vulnerablePassengers: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Internal hazards or threats" value={selectedTrain.internalHazards || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, internalHazards: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="External hazards" value={selectedTrain.externalHazards || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, externalHazards: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Internal train conditions" value={selectedTrain.trainConditions || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, trainConditions: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />

      <h3 className="text-lg font-semibold mb-2 mt-6">Mitigation, Staffing & Control</h3>
      <textarea placeholder="Evacuation risk level" value={selectedTrain.evacuationRisk || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, evacuationRisk: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Mitigation actions in place" value={selectedTrain.mitigationActions || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, mitigationActions: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Staff onboard / support staff" value={selectedTrain.staffing || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, staffing: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Rescue or onward movement options" value={selectedTrain.rescueOptions || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, rescueOptions: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="TOC policy exceeded or service level breached?" value={selectedTrain.tocPolicy || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, tocPolicy: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Evacuation decision and rationale" value={selectedTrain.evacDecision || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, evacDecision: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />
      <textarea placeholder="Control instructions / key decisions made" value={selectedTrain.controlInstructions || ''} onChange={(e) => setSelectedTrain({ ...selectedTrain, controlInstructions: e.target.value })} className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" />

      <button className="mt-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white" onClick={() => setShowAdvanced(false)}>
        Close Advanced View
      </button>
    </div>
  );
}
