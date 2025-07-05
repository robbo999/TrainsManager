import React from 'react';

export default function RiskBadge({ level }) {
  const colors = {
    Red: 'bg-red-500 text-white',
    Amber: 'bg-yellow-400 text-black',
    Green: 'bg-green-500 text-white'
  };
  return <span className={`px-2 py-1 rounded-full text-sm ${colors[level]}`}>{level}</span>;
}
