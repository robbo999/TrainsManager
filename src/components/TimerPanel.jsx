import React from 'react';
import { useState } from 'react';


export default function TimerPanel({
  timer,
  formatTime,
  startTimer,
  stopTimer,
  resetTimer,
  trainCount,
  extremeWeather,
  setExtremeWeather
}) {
    
const [customStart, setCustomStart] = useState('');
    

 return (
  <div className="relative bg-[#161b22] p-6 rounded mb-6 flex justify-between items-center">
    
    {/* ✅ Positioned Checkbox in Top Right */}
    <div className="absolute top-3 right-4 flex items-center space-x-2">
      <input
        type="checkbox"
        checked={extremeWeather}
        onChange={(e) => {
  setExtremeWeather(e.target.checked);
}}

        className="h-5 w-5 accent-yellow-400 bg-white border-2 border-yellow-400 rounded cursor-pointer"
      />
      <label className="text-sm font-medium text-white">
        Extreme weather
      </label>
    </div>

    {/* TIMER DISPLAY */}
    <div className="flex flex-col items-start gap-4">
      <span className="text-8xl font-bold text-white leading-none">
        {formatTime(timer)}
      </span>
      
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
  <label className="text-sm text-white">Start at:</label>
  <input
    type="text"
    placeholder="mm:ss"
    className="bg-gray-800 border border-gray-600 text-white text-sm px-2 py-1 rounded w-20"
    value={customStart}
    onChange={(e) => setCustomStart(e.target.value)}
  />
  <button
    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
    onClick={() => {
      const [m, s] = customStart.split(':').map(Number);
      const totalSeconds = (m || 0) * 60 + (s || 0);
      if (!isNaN(totalSeconds) && totalSeconds >= 0) {
        resetTimer(totalSeconds);
        stopTimer();
      } else {
        alert('Please enter a valid time in mm:ss format.');
      }
    }}
  >
    Set Start Time
  </button>

  <button
    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
    onClick={startTimer}
  >
    Start
  </button>
  <button
    className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
    onClick={stopTimer}
  >
    Stop
  </button>
  <button
    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
    onClick={() => resetTimer(0)}
  >
    Reset
  </button>
</div>


    </div>

    {/* TRAIN COUNTER */}
    <div className="text-2xl font-semibold">
      🚆 Stranded Trains: <span className="text-green-400">{trainCount}</span>
    </div>
    </div>
);
}
