// rolled back to previous working version with table and form
import React, { useState } from 'react';

const initialTrains = [];

const RiskBadge = ({ level }) => {
  const colors = {
    Red: 'bg-red-500 text-white',
    Amber: 'bg-yellow-400 text-black',
    Green: 'bg-green-500 text-white'
  };
  return <span className={`px-2 py-1 rounded-full text-sm ${colors[level]}`}>{level}</span>;
};

export default function Dashboard() {
  const [showForm, setShowForm] = useState(true);
  const [trains, setTrains] = useState(initialTrains);
  const [newTrain, setNewTrain] = useState({
    train: '',
    location: '',
    class: '',
    serviceGroup: '',
    passengerGroup: 'Green',
    passengerRationale: '',
    canMove: false,
    timeStranded: '',
    ccilRef: '',
    btpRef: '',
    initialUpdate: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  React.useEffect(() => {
  const interval = setInterval(() => {
    setTrains(prevTrains =>
      prevTrains.map((train) => {
        const timeRegex = /^\d{1,2}:\d{2}$/;
        const [time] = train.timeStranded.split(' ');
        if (!timeRegex.test(time)) return train;

        const [hh, mm] = time.split(':').map(Number);
        const strandedTime = new Date();
        strandedTime.setHours(hh, mm, 0, 0);
        const now = new Date();
        const diffMins = Math.max(0, Math.round((now - strandedTime) / 60000));

        return {
          ...train,
          timeStranded: `${time} (${diffMins}m)`
        };
      })
    );
  }, 60000);

  return () => clearInterval(interval);
}, []);

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [originalTrainId, setOriginalTrainId] = useState(null);

  const addTrain = () => {
    const timeRegex = /^\d{1,2}:\d{2}$/;
    let formattedTimeStranded = newTrain.timeStranded;
    if (timeRegex.test(newTrain.timeStranded)) {
      const [hh, mm] = newTrain.timeStranded.split(':').map(Number);
      const strandedTime = new Date();
      strandedTime.setHours(hh, mm, 0, 0);
      const now = new Date();
      const diffMins = Math.max(0, Math.round((now - strandedTime) / 60000));
      formattedTimeStranded = `${newTrain.timeStranded} (${diffMins}m)`;
    }

    const tractionRag = ['700', '717', '379'].includes(newTrain.class) ? 'Red' : ['801', '180'].includes(newTrain.class) ? 'Amber' : 'Green';
    const serviceRag = ['Airport Services', 'Commuter'].includes(newTrain.serviceGroup) ? 'Red' : ['Sleeper'].includes(newTrain.serviceGroup) ? 'Amber' : 'Green';
    const passengerRag = newTrain.passengerGroup;
    const scores = { Red: 5, Amber: 3, Green: 1 };
    const score = scores[tractionRag] + scores[serviceRag] + scores[passengerRag];
    const level = score >= 11 ? 'Red' : score >= 6 ? 'Amber' : 'Green';
    const review = score >= 11 ? '15m' : score >= 6 ? '20m' : '30m';

    const newEntry = {
      ...newTrain,
      timeStranded: formattedTimeStranded,
      riskScore: score,
      riskLevel: level,
      nextReview: review,
      lastUpdate: new Date().toLocaleTimeString(),
      canMove: newTrain.canMove ? 'Yes' : 'No'
    };
    const reviewMinutes = score >= 11 ? 15 : score >= 6 ? 20 : 30;
const nextReviewDue = new Date(Date.now() + reviewMinutes * 60000);
    setTrains([...trains, newEntry]);
    setNewTrain({
      train: '', location: '', class: '', serviceGroup: '', passengerGroup: 'Green',
      passengerRationale: '', canMove: false, timeStranded: '', ccilRef: '', btpRef: '', initialUpdate: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Stranded Trains Dashboard</h1>
        <div className="bg-[#161b22] p-4 rounded mb-6">
  <button
    onClick={() => setShowForm(!showForm)}
    className="mb-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
  >
    {showForm ? 'Hide' : 'Show'} Add Stranded Train Form
  </button>
  {showForm && (
    <div className="grid grid-cols-3 gap-4">
      <input
        className="bg-[#0d1117] border border-gray-700 p-2 rounded font-bold"
        placeholder="Train Headcode"
        value={newTrain.train}
        onChange={(e) => setNewTrain({ ...newTrain, train: e.target.value.toUpperCase() })}
      />
      <textarea
  className="col-span-3 bg-[#0d1117] border border-gray-700 p-2 rounded"
  placeholder="Location (e.g. UP Main at Y431 Signal or What3Words: risk.lamps.truck)"
  value={newTrain.location}
  onChange={(e) => setNewTrain({ ...newTrain, location: e.target.value })}
/>
      <select
  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
  value={newTrain.class}
  onChange={(e) => setNewTrain({ ...newTrain, class: e.target.value })}
>
  <option value="">Select Train Class</option>
  <option value="700">700 (Red)</option>
  <option value="717">717 (Red)</option>
  <option value="379">379 (Red)</option>
  <option value="801">801 (Amber)</option>
  <option value="180">180 (Amber)</option>
  <option value="802">802 (Green)</option>
  <option value="800">800 (Green)</option>
  <option value="170">170 (Amber)</option>
  <option value="185">185 (Amber)</option>
  <option value="197">197 (Amber)</option>
</select>

<select
  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
  value={newTrain.serviceGroup}
  onChange={(e) => setNewTrain({ ...newTrain, serviceGroup: e.target.value })}
>
  <option value="">Select Service Group</option>
  <option value="Airport Services">Airport Services (Red)</option>
  <option value="Commuter">Commuter (Red)</option>
  <option value="Sleeper">Sleeper (Amber)</option>
  <option value="Short-Distance">Short-Distance (Amber)</option>
  <option value="Intercity">Intercity (Green)</option>
  <option value="Regional">Regional (Green)</option>
  <option value="Other">Other (Green)</option>
</select>
<label className="col-span-3 text-sm font-semibold">Passenger Group (RAG)</label>
<p className="text-xs text-gray-400 col-span-3">
  Examples:<br />
  <strong>Red:</strong> Vulnerable passengers, intoxicated, large event crowd<br />
  <strong>Amber:</strong> Agitated passengers, delays causing rising stress<br />
  <strong>Green:</strong> Calm, no special considerations
</p>

<select
  className="bg-[#0d1117] border border-gray-700 p-2 rounded col-span-1"
  value={newTrain.passengerGroup}
  onChange={(e) => setNewTrain({ ...newTrain, passengerGroup: e.target.value })}
>
  <option value="Green">Green</option>
  <option value="Amber">Amber</option>
  <option value="Red">Red</option>
</select>

<textarea
  className="col-span-3 bg-[#0d1117] border border-gray-700 p-2 rounded"
  placeholder="Passenger Group Rationale (e.g. report of passenger threatening self evacuation)"
  value={newTrain.passengerRationale}
  onChange={(e) => setNewTrain({ ...newTrain, passengerRationale: e.target.value })}
/>
<input
  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
  placeholder="Time Stranded (24hr, e.g. 11:44)"
  value={newTrain.timeStranded}
  onChange={(e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length === 4) {
      val = val.slice(0, 2) + ':' + val.slice(2);
    }
    setNewTrain({ ...newTrain, timeStranded: val });
  }}
/>

<label className="flex items-center col-span-1">
  <input
    type="checkbox"
    className="mr-2"
    checked={newTrain.canMove}
    onChange={(e) => setNewTrain({ ...newTrain, canMove: e.target.checked })}
  />
  Can Move
</label>

<input
  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
  placeholder="CCIL Ref (optional)"
  value={newTrain.ccilRef}
  onChange={(e) => setNewTrain({ ...newTrain, ccilRef: e.target.value })}
/>

<input
  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
  placeholder="BTP Ref (optional)"
  value={newTrain.btpRef}
  onChange={(e) => setNewTrain({ ...newTrain, btpRef: e.target.value })}
/>

<textarea
  className="col-span-3 bg-[#0d1117] border border-gray-700 p-2 rounded"
  placeholder="Initial Update"
  value={newTrain.initialUpdate}
  onChange={(e) => setNewTrain({ ...newTrain, initialUpdate: e.target.value })}
/>
<button
  onClick={addTrain}
  className="col-span-1 mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
>
  Add Train
</button>


      

    </div>
  )}
</div>
      </div>




<table className="w-full text-left border-separate border-spacing-y-2 mt-6">
  <thead>
    <tr>
      <th>#</th>
      <th>Train</th>
      <th>Location</th>
      <th>Time Stranded</th>
      <th>Risk Score</th>
      <th>Risk Level</th>
      <th>Can Move?</th>
      <th>Review Cycle</th>
<th>Review Time</th>
      <th>Last Update</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {trains.map((train, index) => (
      <tr key={index} className="bg-[#161b22] hover:bg-[#1b222c]">
        <td className="py-2 px-4 font-bold">{index + 1}</td>
        <td className="py-2 px-4 font-bold">{train.train}</td>
        <td className="py-2 px-4">{train.location}</td>
        <td className={(() => {
  const match = train.timeStranded.match(/\((\d+)m\)/);
  if (!match) return 'py-2 px-4';
  const mins = parseInt(match[1]);
  if (mins >= 60) return 'py-2 px-4 bg-red-500 text-white font-bold';
  if (mins >= 30) return 'py-2 px-4 bg-yellow-300 text-black';
  return 'py-2 px-4 bg-green-500 text-white';
})()}>
  {train.timeStranded}
</td>



        <td className="py-2 px-4">{train.riskScore}</td>
        <td className="py-2 px-4"><RiskBadge level={train.riskLevel} /></td>
        <td className="py-2 px-4">{train.canMove}</td>
        <td className="py-2 px-4">{train.nextReview}</td>

<td className="py-2 px-4">
  {train.nextReviewDue ? (() => {
    const now = new Date();
    const due = new Date(train.nextReviewDue);
    const diffMs = due - now;
    const minsLeft = Math.max(0, Math.ceil(diffMs / 60000));
    const hh = due.getHours().toString().padStart(2, '0');
    const mm = due.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm} (${minsLeft}m)`;
  })() : 'N/A'}
</td>

        <td className="py-2 px-4">{train.lastUpdate}</td>
        <td className="py-2 px-4">
  <button
    className="hover:text-blue-400"
    onClick={() => {
    setSelectedTrain(train);
    setOriginalTrainId(train.train);
  }}
    title="View Details"
  >
    🔍
  </button>
</td>

      </tr>
    ))}
  </tbody>
</table>







{showAdvanced && (
  <div className="fixed left-0 top-0 h-full w-1/2 bg-[#1e2633] text-white p-6 overflow-y-auto shadow-lg z-40">
    <h2 className="text-xl font-semibold mb-4">Advanced Details</h2>

    {/* Placeholder for advanced input fields */}
    <h3 className="text-lg font-semibold mb-2 mt-4">Stranding Context</h3>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Reason for train being stranded (e.g. overhead line damage, signalling failure)"
  value={selectedTrain.reasonStranded || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, reasonStranded: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Likely duration and confidence (e.g. 45 minutes – high confidence)"
  value={selectedTrain.estimatedDuration || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, estimatedDuration: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Time of day / day of week (e.g. Peak morning, weekday rush hour)"
  value={selectedTrain.timeOfDay || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, timeOfDay: e.target.value })}
/>
    <h3 className="text-lg font-semibold mb-2 mt-6">Location & Access Conditions</h3>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Distance to nearest station (e.g. 1.2 miles to Grantham)"
  value={selectedTrain.distanceToStation || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, distanceToStation: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Distance to nearest access point (e.g. 500m from gated crossing)"
  value={selectedTrain.distanceToAccess || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, distanceToAccess: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Describe access route (e.g. via bridleway and locked farm gate)"
  value={selectedTrain.accessDescription || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, accessDescription: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Topography & infrastructure (e.g. embankment with OHLE, unfenced field)"
  value={selectedTrain.topography || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, topography: e.target.value })}
/>
<h3 className="text-lg font-semibold mb-2 mt-6">Onboard & Passenger Risk</h3>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Train loading conditions (e.g. standing passengers, restricted luggage space)"
  value={selectedTrain.loadingConditions || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, loadingConditions: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Vulnerable passengers (e.g. elderly, children, disabled, anxious)"
  value={selectedTrain.vulnerablePassengers || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, vulnerablePassengers: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Internal hazards or threats (e.g. intoxicated passengers, disorder, fire, protest)"
  value={selectedTrain.internalHazards || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, internalHazards: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="External hazards (e.g. flooding, OHLE damage, fuel leak)"
  value={selectedTrain.externalHazards || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, externalHazards: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Internal train conditions (e.g. hot, no lighting, PA not working, toilets out of use)"
  value={selectedTrain.trainConditions || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, trainConditions: e.target.value })}
/>
<h3 className="text-lg font-semibold mb-2 mt-6">Mitigation, Staffing & Control</h3>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Evacuation risk level (e.g. high due to self-evac threats or no aircon)"
  value={selectedTrain.evacuationRisk || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, evacuationRisk: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Mitigation actions in place (e.g. MOM en route, BTP aware, catering deployed)"
  value={selectedTrain.mitigationActions || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, mitigationActions: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Staff onboard / support staff (e.g. DOO, onboard crew, MOM attending)"
  value={selectedTrain.staffing || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, staffing: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Rescue or onward movement options (e.g. assisting loco, road transport nearby)"
  value={selectedTrain.rescueOptions || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, rescueOptions: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="TOC policy exceeded or service level breached?"
  value={selectedTrain.tocPolicy || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, tocPolicy: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Evacuation decision and rationale (e.g. no due to risk; review in 15 mins)"
  value={selectedTrain.evacDecision || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, evacDecision: e.target.value })}
/>

<textarea
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Control instructions / key decisions made"
  value={selectedTrain.controlInstructions || ''}
  onChange={(e) => setSelectedTrain({ ...selectedTrain, controlInstructions: e.target.value })}
/>




    


    <button
      className="mt-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
      onClick={() => setShowAdvanced(false)}
    >
      Close Advanced View
    </button>
  </div>
)}






















      
      


{selectedTrain && (
  <div className="fixed right-0 top-0 h-full w-1/2 bg-[#161b22] text-white p-6 overflow-y-auto shadow-lg z-50">
      {showAdvanced && (
  <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-white text-center px-4">
    <p className="text-sm font-semibold">Close the Advanced Panel to continue editing</p>
  </div>
)}


    <h2 className="text-xl font-semibold mb-4">Train Details – {selectedTrain.train}</h2>

    <input
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2 font-bold"
      placeholder="Train Headcode"
      value={selectedTrain.train}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, train: e.target.value.toUpperCase() })}
    />

    <textarea
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      placeholder="Location"
      value={selectedTrain.location}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, location: e.target.value })}
    />

    <select
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      value={selectedTrain.class}
      onChange={(e) =>
    setSelectedTrain({
      ...selectedTrain,
      class: e.target.value,
      lastUpdate: new Date().toLocaleTimeString()
    })
  }

    >
      <option value="">Train Class</option>
      <option value="700">700 (Red)</option>
      <option value="717">717 (Red)</option>
      <option value="379">379 (Red)</option>
      <option value="801">801 (Amber)</option>
      <option value="180">180 (Amber)</option>
      <option value="802">802 (Green)</option>
      <option value="800">800 (Green)</option>
      <option value="170">170 (Amber)</option>
      <option value="185">185 (Amber)</option>
      <option value="197">197 (Amber)</option>
    </select>

    <select
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      value={selectedTrain.serviceGroup}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, serviceGroup: e.target.value, lastUpdate: new Date().toLocaleTimeString() })}

    >
      <option value="">Service Group</option>
      <option value="Airport Services">Airport Services (Red)</option>
      <option value="Commuter">Commuter (Red)</option>
      <option value="Sleeper">Sleeper (Amber)</option>
      <option value="Short-Distance">Short-Distance (Amber)</option>
      <option value="Intercity">Intercity (Green)</option>
      <option value="Regional">Regional (Green)</option>
      <option value="Other">Other (Green)</option>
    </select>

    <select
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      value={selectedTrain.passengerGroup}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, serviceGroup: e.target.value, lastUpdate: new Date().toLocaleTimeString() })}

    >
      <option value="Green">Green</option>
      <option value="Amber">Amber</option>
      <option value="Red">Red</option>
    </select>

    <textarea
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      placeholder="Passenger Rationale"
      value={selectedTrain.passengerRationale}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, passengerRationale: e.target.value })}
    />

    <input
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  placeholder="Time Stranded (24hr, e.g. 1144)"
  value={selectedTrain.timeStranded}
  onChange={(e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length === 4) {
      val = val.slice(0, 2) + ':' + val.slice(2);
    }
    setSelectedTrain({ ...selectedTrain, timeStranded: val });
  }}
/>


    <label className="flex items-center mb-2">
      <input
        type="checkbox"
        className="mr-2"
        checked={selectedTrain.canMove === 'Yes'}
        onChange={(e) => setSelectedTrain({ ...selectedTrain, canMove: e.target.checked ? 'Yes' : 'No' })}
      />
      Can Move
    </label>

    <input
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      placeholder="CCIL Ref (optional)"
      value={selectedTrain.ccilRef}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, ccilRef: e.target.value })}
    />

    <input
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      placeholder="BTP Ref (optional)"
      value={selectedTrain.btpRef}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, btpRef: e.target.value })}
    />

    <textarea
      className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
      placeholder="Initial Update"
      value={selectedTrain.initialUpdate}
      onChange={(e) => setSelectedTrain({ ...selectedTrain, initialUpdate: e.target.value })}
    />
    {/* Advanced Details Toggle */}
<button
  className="mb-4 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-white text-sm"
  onClick={() => setShowAdvanced(!showAdvanced)}
>
  {showAdvanced ? 'Hide' : 'Show'} Advanced Details
</button>


    <div className="flex justify-between mt-4">
  <button
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
    onClick={() => 







{
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

      const tractionRag = ['700', '717', '379'].includes(selectedTrain.class) ? 'Red' : ['801', '180'].includes(selectedTrain.class) ? 'Amber' : 'Green';
      const serviceRag = ['Airport Services', 'Commuter'].includes(selectedTrain.serviceGroup) ? 'Red' : ['Sleeper'].includes(selectedTrain.serviceGroup) ? 'Amber' : 'Green';
      const passengerRag = selectedTrain.passengerGroup;
      const scores = { Red: 5, Amber: 3, Green: 1 };
      const score = scores[tractionRag] + scores[serviceRag] + scores[passengerRag];
      const level = score >= 11 ? 'Red' : score >= 6 ? 'Amber' : 'Green';
      const review = score >= 11 ? '15m' : score >= 6 ? '20m' : '30m';

      const updatedTrain = {
        ...selectedTrain,
        timeStranded: formattedTimeStranded,
        riskScore: score,
        riskLevel: level,
        nextReview: review,
        lastUpdate: new Date().toLocaleTimeString()
      };
      setTrains(trains.map(t => t.train === originalTrainId ? updatedTrain : t));
      setSelectedTrain(null);
    }}
  >
    Save Changes
  </button>

  <button
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
    onClick={() => {
      setTrains(trains.filter(t => t.train !== selectedTrain.train));
      setSelectedTrain(null);
    }}
  >
    Delete Train
  </button>

  <button
    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
    onClick={() => setSelectedTrain(null)}
  >
    Close
  </button>
</div>

  </div>
)}




      
      
    </div>
  );
}

