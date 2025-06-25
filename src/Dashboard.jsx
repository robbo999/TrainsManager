// Dashboard with CSV export feature
import React, { useState, useEffect } from 'react';

function downloadCSV(trains, incidentTitle = 'incident') {
  const headers = [
    "Train", "Location", "Class", "Service Group", "Passenger Group", "Passenger Rationale",
    "Time Stranded", "Can Move", "CCIL Ref", "BTP Ref", "Initial Update", "Risk Score",
    "Risk Level", "Next Review", "Last Update", "Reason Stranded", "Estimated Duration",
    "Time of Day", "Distance to Station", "Distance to Access", "Access Description",
    "Topography", "Loading Conditions", "Vulnerable Passengers", "Internal Hazards",
    "External Hazards", "Train Conditions", "Evacuation Risk", "Mitigation Actions",
    "Staffing", "Rescue Options", "TOC Policy", "Evac Decision", "Control Instructions"
  ];

  const rows = trains.map(train => [
    train.train, train.location, train.class, train.serviceGroup, train.passengerGroup,
    train.passengerRationale, train.timeStranded, train.canMove, train.ccilRef, train.btpRef,
    train.initialUpdate, train.riskScore, train.riskLevel, train.nextReview, train.lastUpdate,
    train.reasonStranded, train.estimatedDuration, train.timeOfDay, train.distanceToStation,
    train.distanceToAccess, train.accessDescription, train.topography, train.loadingConditions,
    train.vulnerablePassengers, train.internalHazards, train.externalHazards,
    train.trainConditions, train.evacuationRisk, train.mitigationActions, train.staffing,
    train.rescueOptions, train.tocPolicy, train.evacDecision, train.controlInstructions
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row =>
      row.map(field =>
        typeof field === 'string'
          ? '"' + field.replace(/"/g, '""') + '"'
          : field ?? ''
      ).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${incidentTitle.replace(/\s+/g, "_")}_export.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Dashboard({ incident, onUpdate }) {
  const [trains, setTrains] = useState(incident.trains || []);

  useEffect(() => {
    onUpdate({ ...incident, trains });
  }, [trains]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">{incident.title}</h1>
      <button
        className="mb-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        onClick={() => downloadCSV(trains, incident.title)}
      >
        📤 Export Trains as CSV
      </button>
      <table className="w-full border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr>
            <th>Train</th>
            <th>Location</th>
            <th>Class</th>
            <th>Service Group</th>
            <th>Passenger Group</th>
            <th>Risk</th>
            <th>Can Move</th>
            <th>Stranded</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train, i) => (
            <tr key={i} className="bg-[#1f2937]">
              <td className="px-2 py-1">{train.train}</td>
              <td className="px-2 py-1">{train.location}</td>
              <td className="px-2 py-1">{train.class}</td>
              <td className="px-2 py-1">{train.serviceGroup}</td>
              <td className="px-2 py-1">{train.passengerGroup}</td>
              <td className="px-2 py-1">{train.riskLevel}</td>
              <td className="px-2 py-1">{train.canMove}</td>
              <td className="px-2 py-1">{train.timeStranded}</td>
              <td className="px-2 py-1">{train.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}