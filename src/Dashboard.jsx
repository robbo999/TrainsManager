// rolled back to previous working version with table and form
import React, { useState, useEffect } from 'react';
import TrainRow from './components/TrainRow';
import TrainForm from './components/TrainForm';
import TimerPanel from './components/TimerPanel';
import TrainDetailPanel from './components/TrainDetailPanel';
import AdvancedPanel from './components/AdvancedPanel';






const initialTrains = [];

const RiskBadge = ({ level }) => {
  const colors = {
    Red: 'bg-red-500 text-white',
    Amber: 'bg-yellow-400 text-black',
    Green: 'bg-green-500 text-white'
  };
  return <span className={`px-2 py-1 rounded-full text-sm ${colors[level]}`}>{level}</span>;
};

export default function Dashboard({ incident, onUpdate }) {
  const [trains, setTrains] = useState(incident.trains || []);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
    
    const [extremeWeather, setExtremeWeather] = useState(false);


  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

    
 
    
    
  useEffect(() => {
    if (typeof onUpdate === 'function') {
      onUpdate({ ...incident, trains });
    }
    return () => {};
  }, [trains]);
    
 
    
    
    
    useEffect(() => {
  if (extremeWeather) {
    setTrains(prev =>
      prev.map(train => {
        const match = train.timeStranded.match(/^(\d{2}):(\d{2})/);
        if (!match) return train;

        const [_, hh, mm] = match.map(Number);
        const reviewTime = new Date();
        reviewTime.setHours(hh, mm, 0, 0);
        reviewTime.setMinutes(reviewTime.getMinutes() + 15);

        return {
          ...train,
          reviewCycle: '15m',
          nextReview: reviewTime.toISOString()
        };
      })
    );
  } else {
    setTrains(prev =>
      prev.map(train => {
        const tractionRag = ['700', '717', '379'].includes(train.class)
          ? 'Red'
          : ['801', '180', '170', '185', '197'].includes(train.class)
          ? 'Amber'
          : 'Green';

        const serviceRag = ['Airport Services', 'Commuter'].includes(train.serviceGroup)
          ? 'Red'
          : ['Sleeper', 'Short-Distance'].includes(train.serviceGroup)
          ? 'Amber'
          : 'Green';

        const passengerRag = train.passengerGroup;
        const scores = { Red: 5, Amber: 3, Green: 1 };
        const score = scores[tractionRag] + scores[serviceRag] + scores[passengerRag];
        const reviewMinutes = score >= 11 ? 15 : score >= 6 ? 20 : 30;

        const match = train.timeStranded.match(/^(\d{2}):(\d{2})/);
        if (!match) return train;

        const [_, hh, mm] = match.map(Number);
        const reviewTime = new Date();
        reviewTime.setHours(hh, mm, 0, 0);
        reviewTime.setMinutes(reviewTime.getMinutes() + reviewMinutes);

        return {
          ...train,
          riskScore: score,
          riskLevel: score >= 11 ? 'Red' : score >= 6 ? 'Amber' : 'Green',
          reviewCycle: `${reviewMinutes}m`,
          nextReview: reviewTime.toISOString()
        };
      })
    );
  }
}, [extremeWeather]);







  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimer(0);
  };

  const formatTime = (secs) => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, '0');
    const seconds = String(secs % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
 
    
    
  const [showForm, setShowForm] = useState(true);
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
  initialUpdate: '',
  planA: '',
  planB: '',
  planC: '',
  activePlan: 'A'
});

  const [showAdvanced, setShowAdvanced] = useState(false);
React.useEffect(() => {
  const interval = setInterval(() => {
    setTrains(prevTrains =>
      prevTrains.map(train => {
        const timeMatch = train.timeStranded?.match(/^(\d{1,2}:\d{2})/);
        if (!timeMatch) return train;

        const originalTime = timeMatch[1];
        const now = new Date();
        const [hours, minutes] = originalTime.split(':').map(Number);

        const strandedTime = new Date(now);
        strandedTime.setHours(hours, minutes, 0, 0);

        const diffMins = Math.floor((now - strandedTime) / 60000);
        const updatedStranded = `${originalTime} (${diffMins}m)`; // ✅ fixed here

        return {
          ...train,
          timeStranded: updatedStranded
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

   
const reviewMinutes = extremeWeather ? 15 : score >= 11 ? 15 : score >= 6 ? 20 : 30;

const reviewCycle = `${reviewMinutes}m`;
const [hh, mm] = newTrain.timeStranded.replace(/[^\d]/g, '').match(/.{1,2}/g).map(Number);
const strandedTime = new Date();
strandedTime.setHours(hh, mm, 0, 0);
strandedTime.setMinutes(strandedTime.getMinutes() + reviewMinutes);
const nextReviewDue = strandedTime;

const newEntry = {
  ...newTrain,
  timeStranded: formattedTimeStranded,
  riskScore: score,
  riskLevel: level,
  reviewCycle, // ✅ '10m', '15m', or '30m'
  nextReview: nextReviewDue.toISOString(),
  lastUpdate: new Date().toLocaleTimeString(),
  canMove: newTrain.canMove ? 'Yes' : 'No'
};




console.log('🚆 Adding train:', newEntry);    
setTrains([...trains, newEntry]);
    setNewTrain({
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
  initialUpdate: '',
  planA: '',
  planB: '',
  planC: '',
  activePlan: 'A'
});

  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Stranded Trains Dashboard</h1> 









<TimerPanel
  timer={timer}
  formatTime={formatTime}
  startTimer={startTimer}
  stopTimer={stopTimer}
  resetTimer={resetTimer}
  trainCount={trains.length}
  extremeWeather={extremeWeather}
  setExtremeWeather={setExtremeWeather}
/>










        <div className="bg-[#161b22] p-4 rounded mb-6">
  <button
    onClick={() => setShowForm(!showForm)}
    className="mb-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
  >
    {showForm ? 'Hide' : 'Show'} Add Stranded Train Form
  </button>
{showForm && (
  <TrainForm
    newTrain={newTrain}
    setNewTrain={setNewTrain}
    addTrain={addTrain}
  />
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
<th>Current Plan</th>
      <th>Last Update</th>
      <th>Status</th>
    </tr>
  </thead>

  <tbody>
    {trains.map((train, index) => (
  <TrainRow key={index} train={train} index={index} onSelect={(train) => {
    setSelectedTrain(train);
    setOriginalTrainId(train.train);
  }} />
))}

  </tbody>
</table>





















{selectedTrain && (
  <TrainDetailPanel
    selectedTrain={selectedTrain}
    setSelectedTrain={setSelectedTrain}
    originalTrainId={originalTrainId}
    setTrains={setTrains}
    trains={trains}
    showAdvanced={showAdvanced}           // ✅ required
    setShowAdvanced={setShowAdvanced}     // ✅ required
  />
)}
{showAdvanced && selectedTrain && (
  <AdvancedPanel
    selectedTrain={selectedTrain}
    setSelectedTrain={setSelectedTrain}
    setShowAdvanced={setShowAdvanced}
  />
)}






      
      












      
      
    </div>
  );
}
