import React from 'react';
import {
  trainClassOptions,
  serviceGroupOptions,
  passengerGroupOptions
} from '../utils/dropdownOptions';


export default function TrainForm({ newTrain, setNewTrain, addTrain }) {
  const handleTimeInput = (val) => {
    let clean = val.replace(/[^0-9]/g, '');
    if (clean.length === 4) {
      clean = clean.slice(0, 2) + ':' + clean.slice(2);
    }
    setNewTrain({ ...newTrain, timeStranded: clean });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <input
        className="bg-[#0d1117] border border-gray-700 p-2 rounded font-bold"
        placeholder="Train Headcode"
        value={newTrain.train}
        onChange={(e) => setNewTrain({ ...newTrain, train: e.target.value.toUpperCase() })}
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
      <textarea
        className="col-span-3 bg-[#0d1117] border border-gray-700 p-2 rounded"
        placeholder="Location (e.g. UP Main at Y431 Signal)"
        value={newTrain.location}
        onChange={(e) => setNewTrain({ ...newTrain, location: e.target.value })}
      />
     <select
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  value={newTrain.class}
  onChange={(e) => setNewTrain({ ...newTrain, class: e.target.value })}
>
  {trainClassOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>



      <select
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  value={newTrain.serviceGroup}
  onChange={(e) => setNewTrain({ ...newTrain, serviceGroup: e.target.value })}
>
  {serviceGroupOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>



      <label className="col-span-3 text-sm font-semibold">Passenger Group (RAG)</label>
      <select
  className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-2"
  value={newTrain.passengerGroup}
  onChange={(e) => setNewTrain({ ...newTrain, passengerGroup: e.target.value })}
>
  {passengerGroupOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>



      <div className="text-xs text-gray-400 mb-2 leading-snug">
        <strong>Examples:</strong><br />
        <strong>Red:</strong> Vulnerable passengers, intoxicated, large event crowd<br />
        <strong>Amber:</strong> Agitated passengers, delays causing rising stress<br />
        <strong>Green:</strong> Calm, no special considerations
      </div>

      <textarea
        className="col-span-3 bg-[#0d1117] border border-gray-700 p-2 rounded"
        placeholder="Passenger Group Rationale"
        value={newTrain.passengerRationale}
        onChange={(e) => setNewTrain({ ...newTrain, passengerRationale: e.target.value })}
      />

      <div className="flex items-center space-x-2 mb-2">
  <input
    className="flex-1 bg-[#0d1117] border border-gray-700 p-2 rounded"
    placeholder="Time Stranded (e.g. 1342)"
    value={newTrain.timeStranded || ''}
    maxLength={5}
    onChange={(e) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      if (val.length > 4) val = val.slice(0, 4);
      if (val.length === 4) val = val.slice(0, 2) + ':' + val.slice(2);
      setNewTrain({ ...newTrain, timeStranded: val });
    }}
  />
  <button
    onClick={() => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, '0');
      const mm = now.getMinutes().toString().padStart(2, '0');
      setNewTrain({ ...newTrain, timeStranded: `${hh}:${mm}` });
    }}
    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm"
  >
    Now
  </button>
</div>




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
  );
}
