import React from 'react';
import RiskBadge from './RiskBadge';


export default function TrainRow({ train, index, onSelect }) {
  const getTimeStrandedStyle = () => {
    const match = train.timeStranded.match(/\((\d+)m\)/);
    if (!match) return 'py-2 px-4';
    const mins = parseInt(match[1]);
    if (mins >= 60) return 'py-2 px-4 bg-red-500 text-white font-bold';
    if (mins >= 30) return 'py-2 px-4 bg-yellow-300 text-black';
    return 'py-2 px-4 bg-green-500 text-white';
  };

  const isOverdue = train.nextReview && new Date(train.nextReview) < new Date();
  const rowStyle = isOverdue
    ? 'bg-red-700 animate-pulse text-white'
    : 'bg-[#161b22] hover:bg-[#1b222c] text-white';

  const getReviewTime = () => {
    if (!train.nextReview) return 'N/A';
    const now = new Date();
    const due = new Date(train.nextReview);
    const diffMs = due - now;
    const minsLeft = Math.max(0, Math.ceil(diffMs / 60000));
    const hh = due.getHours().toString().padStart(2, '0');
    const mm = due.getMinutes().toString().padStart(2, '0');
    return due < now
  ? `❗ Overdue (was due at ${hh}:${mm})`
  : `Due at ${hh}:${mm} (${minsLeft}m)`;

  };



  return (
    <tr className={rowStyle} onClick={() => onSelect(train)}>
      <td className="py-2 px-4 font-bold">{index + 1}</td>
      <td className="py-2 px-4 font-bold">{train.train}</td>
      <td className="py-2 px-4">{train.location}</td>
      <td className={getTimeStrandedStyle()}>{train.timeStranded}</td>
      <td className="py-2 px-4">{train.riskScore}</td>
      <td className="py-2 px-4"><RiskBadge level={train.riskLevel} /></td>
      <td className="py-2 px-4">{train.canMove}</td>
      <td className="py-2 px-4">{train.reviewCycle}</td>
      <td className="py-2 px-4">{getReviewTime()}</td>
          <td title={train[`plan${train.activePlan}`]}>
  {train[`plan${train.activePlan}`]
    ? (
      <>
        <span className="font-bold">Plan {train.activePlan} – </span>
        {train[`plan${train.activePlan}`].slice(0, 60)}
        {train[`plan${train.activePlan}`].length > 60 ? '…' : ''}
      </>
    )
    : <span className="text-yellow-400 font-semibold">⚠️ No current plan</span>
  }
</td>

      <td className="py-2 px-4">{train.lastUpdate}</td>
      <td className="py-2 px-4">
        <button
          className="hover:text-blue-400"
          onClick={() => onSelect(train)}
          title="View Details"
        >
          🔍
        </button>
      </td>
    </tr>
  );
}
