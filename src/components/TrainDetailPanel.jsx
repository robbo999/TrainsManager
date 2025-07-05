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

import {
  trainClassOptions,
  serviceGroupOptions,
  passengerGroupOptions
} from '../utils/dropdownOptions';
import PlanPanel from './PlanPanel';



export default function TrainDetailPanel({ selectedTrain, setSelectedTrain, originalTrainId, setTrains, trains, setShowAdvanced, showAdvanced }) {
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


  const tractionRag = ['700', '717', '379'].includes(selectedTrain.class)
  ? 'Red'
  : ['801', '180', '170', '185', '197'].includes(selectedTrain.class)
  ? 'Amber'
  : 'Green';

const serviceRag = ['Airport Services', 'Commuter'].includes(selectedTrain.serviceGroup)
  ? 'Red'
  : ['Sleeper', 'Short-Distance'].includes(selectedTrain.serviceGroup)
  ? 'Amber'
  : 'Green';

const passengerRag = selectedTrain.passengerGroup;
const scores = { Red: 5, Amber: 3, Green: 1 };
const riskScore = scores[tractionRag] + scores[serviceRag] + scores[passengerRag];
const riskLevel = riskScore >= 11 ? 'Red' : riskScore >= 6 ? 'Amber' : 'Green';
const reviewCycle = `${riskScore >= 11 ? 15 : riskScore >= 6 ? 20 : 30}m`;

const updatedTrain = {
  ...selectedTrain,
  timeStranded: formattedTimeStranded,
  riskScore,
  riskLevel,
  reviewCycle,
  nextReview: selectedTrain.nextReview, // do NOT reset unless acknowledging
  lastUpdate: new Date().toLocaleTimeString()
};


  setTrains(trains.map(t => t.train === originalTrainId ? updatedTrain : t));
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
  value={selectedTrain.class}
  onChange={(e) => handleChange('class', e.target.value)}
>
  {trainClassOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>



      <select
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  value={selectedTrain.serviceGroup}
  onChange={(e) => handleChange('serviceGroup', e.target.value)}
>
  {serviceGroupOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          



      <div className="flex justify-between mt-4">
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white" onClick={saveChanges}>Save Changes</button>
   
            <button
    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
    onClick={() => {
      const now = new Date();
      const reviewMinutes =
        selectedTrain.riskScore >= 11 ? 15 :
        selectedTrain.riskScore >= 6 ? 20 : 30;
      const nextReview = new Date(now.getTime() + reviewMinutes * 60000).toISOString();

      const updatedTrain = {
        ...selectedTrain,
        nextReview,
        lastUpdate: now.toLocaleTimeString()
      };

      setSelectedTrain(updatedTrain);
      setTrains(prev =>
        prev.map(t => t.train === updatedTrain.train ? updatedTrain : t)
      );

      // Show confirmation
      setReviewConfirmedAt(now.toLocaleTimeString());
    }}
  >
    Acknowledge / Conduct Review
  </button>

  {reviewConfirmedAt && (
    <p className="text-green-400 text-sm mt-2">
      ✅ Review acknowledged at {reviewConfirmedAt}
    </p>
  )}



          
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
