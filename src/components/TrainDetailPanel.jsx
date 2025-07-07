// Modularization Plan for Dashboard.jsx

// === Components to Create ===

// 1. components/TrainRow.jsx ✅ DONE
//    - Renders each train row in the table

// 2. components/TrainForm.jsx ✅ DONE
//    - Contains the form UI and logic for adding a train

// 3. components/TrainDetailPanel.jsx ✅ REBUILT
//    - Handles the right-side panel (selectedTrain view, including advanced toggle)

// 4. components/TimerPanel.jsx ✅ DONE
//    - Displays timer, controls, and total train count

// 5. components/AdvancedPanel.jsx
//    - Used only when showAdvanced is true

// 6. utils/riskUtils.js
//    - Centralize risk score, review cycle, formatting logic

// === Suggested Prop Flow ===
// - App or Dashboard keeps all state: trains, selectedTrain, showForm, showAdvanced
// - Pass relevant data/functions into each child component

// === Final TrainDetailPanel.jsx ===
import React, { useState } from 'react';

import { getRiskAssessment } from '../utils/riskUtils';


import {
  trainClassOptions,
  serviceGroupOptions,
  passengerGroupOptions
} from '../utils/dropdownOptions';
import PlanPanel from './PlanPanel';

import { logChangesOnSave } from '../utils/logUtils';





export default function TrainDetailPanel({
  selectedTrain,
  setSelectedTrain,
  originalTrainId,
  setTrains,
  trains,
  showAdvanced,
  setShowAdvanced,
  setShowUpdates // ✅ Add this here
}) {

  if (!selectedTrain) return null;
    
 
    
    
    
    
    
    const [reviewConfirmedAt, setReviewConfirmedAt] = React.useState(null);



const handleChange = (field, value) => {
  setSelectedTrain(prev => ({ ...prev, [field]: value }));
};


    const [showPlan, setShowPlan] = useState(false);


const saveChanges = () => {
 const timeRegex = /^\d{1,2}:\d{2}$/;
let formattedTimeStranded = selectedTrain.timeStranded;

if (timeRegex.test(selectedTrain.timeStranded)) {
  const [hh, mm] = selectedTrain.timeStranded.split(':').map(Number);
  const strandedTime = new Date();
  strandedTime.setHours(hh, mm, 0, 0);
  const now = new Date();
  const diffMins = Math.max(0, Math.round((now - strandedTime) / 60000));
  formattedTimeStranded = `${selectedTrain.timeStranded} (${diffMins}m)`;
}


const { riskScore, riskLevel, reviewCycle } = getRiskAssessment(selectedTrain);

    

    
const updatedTrain = {
  ...selectedTrain,
  timeStranded: formattedTimeStranded,
  riskScore,
  riskLevel,
  reviewCycle,
  nextReview: selectedTrain.nextReview, // do NOT reset unless acknowledging
  lastUpdate: new Date().toLocaleTimeString()
};

    
const originalTrain = trains.find(t => t.train === originalTrainId);
    const planChanged = originalTrain.activePlan !== selectedTrain.activePlan;

    
    const riskChanged =
  originalTrain.riskScore !== riskScore ||
  originalTrain.riskLevel !== riskLevel ||
  originalTrain.reviewCycle !== reviewCycle;
let systemUpdate = null;

if (riskChanged) {
  const username = localStorage.getItem('username') || 'System';
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:` +
                    `${now.getMinutes().toString().padStart(2, '0')}:` +
                    `${now.getSeconds().toString().padStart(2, '0')}`;

  systemUpdate = {
    time: timestamp,
    message: `⚙️ Risk updated to score ${riskScore} (${riskLevel}) with review every ${reviewCycle} by ${username}`
  };
}


let planUpdate = null;

if (planChanged) {
  const username = localStorage.getItem('username') || 'System';
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:` +
                    `${now.getMinutes().toString().padStart(2, '0')}:` +
                    `${now.getSeconds().toString().padStart(2, '0')}`;

  planUpdate = {
    time: timestamp,
    message: `🧭 Active plan changed to ${selectedTrain.activePlan} by ${username}`
  };
}
    
    

 const changeLogs = logChangesOnSave(
  trains.find(t => t.train === originalTrainId),
  updatedTrain
);

const updatedWithLogs = {
  ...updatedTrain,
  updates: [
  ...(selectedTrain.updates || []),
  ...changeLogs,
  ...(systemUpdate ? [systemUpdate] : []),
  ...(planUpdate ? [planUpdate] : [])
]

};


setTrains(trains.map(t => t.train === originalTrainId ? updatedWithLogs : t));

  setSelectedTrain(null); // ✅ This closes the panel
};


  return (
    <div className="fixed right-0 top-0 h-full w-1/2 bg-[#161b22] text-white p-6 overflow-y-auto shadow-lg z-50">
      {showAdvanced && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-white text-center px-4">
          <p className="text-sm font-semibold">Close the Advanced Panel to continue editing</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Train Details – {selectedTrain.train}</h2>
          {selectedTrain.nextReview && new Date(selectedTrain.nextReview) < new Date() && (
  <div className="bg-red-700 text-white text-sm p-3 rounded mb-2 animate-pulse font-semibold shadow">
      ⚠️ This train is OVERDUE for review – please reassess and click "Acknowledge Review".
    </div>
)}


      <input className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2 font-bold" placeholder="Train Headcode" value={selectedTrain.train} onChange={(e) => handleChange('train', e.target.value.toUpperCase())} />

      <textarea className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" placeholder="Location" value={selectedTrain.location} onChange={(e) => handleChange('location', e.target.value)} />

      <select
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  value={selectedTrain.class || ''}
  onChange={(e) => handleChange('class', e.target.value)}
>
  <option value="">Select Class</option>
  {trainClassOptions.map(opt => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ))}
</select>





      <select
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  value={selectedTrain.serviceGroup || ''}
  onChange={(e) => handleChange('serviceGroup', e.target.value)}
>
  <option value="">Select Service Group</option>
  {serviceGroupOptions.map(opt => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ))}
</select>





      <select
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  value={selectedTrain.passengerGroup}
  onChange={(e) => handleChange('passengerGroup', e.target.value)}
>
  {passengerGroupOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>



      <textarea className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" placeholder="Passenger Rationale" value={selectedTrain.passengerRationale} onChange={(e) => handleChange('passengerRationale', e.target.value)} />

   <input
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Time Stranded (24hr, e.g. 1342)"
  value={(() => {
    const time = selectedTrain.timeStranded || '';
    const match = time.match(/^(\d{2}:\d{2})/);
    if (!match) return time;
    
    const strandedTime = new Date();
    const [hh, mm] = match[1].split(':').map(Number);
    strandedTime.setHours(hh, mm, 0, 0);

    const now = new Date();
    const diffMins = Math.max(0, Math.round((now - strandedTime) / 60000));
    return `${match[1]} (${diffMins}m)`;
  })()}
  onChange={(e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length === 4) val = val.slice(0, 2) + ':' + val.slice(2);
    handleChange('timeStranded', val); // just update HH:MM
  }}
/>



      <label className="flex items-center mb-2">
        <input type="checkbox" className="mr-2" checked={selectedTrain.canMove === 'Yes'} onChange={(e) => handleChange('canMove', e.target.checked ? 'Yes' : 'No')} />
        Can Move
      </label>

      <input className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" placeholder="CCIL Ref (optional)" value={selectedTrain.ccilRef || ''} onChange={(e) => handleChange('ccilRef', e.target.value)} />

      <input className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" placeholder="BTP Ref (optional)" value={selectedTrain.btpRef || ''} onChange={(e) => handleChange('btpRef', e.target.value)} />

      <textarea className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2" placeholder="Initial Update" value={selectedTrain.initialUpdate || ''} onChange={(e) => handleChange('initialUpdate', e.target.value)} />

      <button className="mb-4 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-white text-sm" onClick={() => setShowAdvanced(prev => !prev)}>
        {showAdvanced ? 'Hide' : 'Show'} Advanced Details
      </button>
          
          <button
  className="mb-4 bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded text-white text-sm ml-2"
  onClick={() => setShowPlan(true)}
>
  Show Plan
</button>
          <button
  className="mb-4 bg-yellow-700 hover:bg-yellow-800 px-4 py-2 rounded text-white text-sm ml-2"
  onClick={() => setShowUpdates(true)}
>
  Updates Log
</button>

          



      <div className="flex justify-between mt-4">
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white" onClick={saveChanges}>Save Changes</button>
   
        <button
  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
  onClick={() => {
                  console.log('✅ selectedTrain.extremeWeather is:', selectedTrain.extremeWeather);

  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:` +
                    `${now.getMinutes().toString().padStart(2, '0')}:` +
                    `${now.getSeconds().toString().padStart(2, '0')}`;
  const username = localStorage.getItem('username') || 'System';

  // ✅ Use helper to recalculate risk and reviewCycle based on extremeWeather
  const { riskScore, riskLevel, reviewCycle } = getRiskAssessment(selectedTrain);

  const reviewMinutes = parseInt(reviewCycle);
  const nextReview = new Date(now.getTime() + reviewMinutes * 60000).toISOString();

  const logEntry = {
    time: timestamp,
    message: selectedTrain.extremeWeather
      ? `✅ Review acknowledged for ${selectedTrain.train} (🌧️ 15m forced by extreme weather) by ${username}`
      : `✅ Review acknowledged for ${selectedTrain.train} by ${username}`
  };

  const updatedTrain = {
    ...selectedTrain,
    riskScore,
    riskLevel,
    reviewCycle,
    nextReview,
    lastUpdate: now.toLocaleTimeString(),
    updates: [...(selectedTrain.updates || []), logEntry]
  };

  setSelectedTrain(updatedTrain);
  setTrains(prev =>
    prev.map(t => t.train === updatedTrain.train ? updatedTrain : t)
  );
  setReviewConfirmedAt(now.toLocaleTimeString());
}}

>
  Acknowledge / Conduct Review
</button>








          
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white" onClick={() => {
          setTrains(trains.filter(t => t.train !== selectedTrain.train));
          setSelectedTrain(null);
        }}>Delete Train</button>
          
                  <button
        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
        onClick={() => setSelectedTrain(null)}
      >
        Close
      </button>
    </div> {/* closes button section */}

    {/* ✅ Left-side Plan Panel */}
    {showPlan && (
      <PlanPanel
        selectedTrain={selectedTrain}
        setSelectedTrain={setSelectedTrain}
        setShowPlan={setShowPlan}
      />
    )}
  </div> 
);
}
