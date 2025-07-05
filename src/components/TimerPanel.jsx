import React from 'react';

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

 return (
  <div className="relative bg-[#161b22] p-6 rounded mb-6 flex justify-between items-center">
    
    {/* ✅ Positioned Checkbox in Top Right */}
    <div className="absolute top-3 right-4 flex items-center space-x-2">
      <input
        type="checkbox"
        checked={extremeWeather}
        onChange={() => setExtremeWeather(!extremeWeather)}
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
      <div className="flex gap-2">
        <button onClick={startTimer} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Start</button>
        <button onClick={stopTimer} className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm text-black">Stop</button>
        <button onClick={resetTimer} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Reset</button>
      </div>
    </div>

    {/* TRAIN COUNTER */}
    <div className="text-2xl font-semibold">
      🚆 Stranded Trains: <span className="text-green-400">{trainCount}</span>
    </div>
    </div>
);
}
