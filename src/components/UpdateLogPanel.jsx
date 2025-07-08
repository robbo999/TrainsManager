import React, { useState } from 'react';
import { logCustomMessage } from '../utils/logUtils';

export default function UpdateLogPanel({
  selectedTrain,
  setSelectedTrain,
  setShowUpdateLog,
  setMasterLog,
  trains,
  setTrains,
  trainId
}) {
  const updates = selectedTrain.freeTextUpdates || [];
  const [newUpdateText, setNewUpdateText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const username = localStorage.getItem('username') || 'Unknown';

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const updateTrainAndLog = (updatedList, logMessage) => {
    const updatedTrain = {
      ...selectedTrain,
      freeTextUpdates: updatedList
    };

    setSelectedTrain(updatedTrain);
    setTrains(trains.map(t => t.train === trainId ? {
      ...t,
      ...updatedTrain,
      updates: [
        ...(t.updates || []),
        {
          time: getTimestamp(),
          train: selectedTrain.train,
          message: logMessage
        }
      ]
    } : t));

    logCustomMessage(
      logMessage,
      updatedTrain,
      setSelectedTrain,
      setTrains,
      trains,
      trainId,
      setMasterLog
    );
  };

  const handleAddUpdate = () => {
    if (!newUpdateText.trim()) return;

    const lastId = updates.reduce((max, u) => Math.max(max, u.entryNumber || 0), 0);
    const newUpdate = {
      id: Date.now(),
      entryNumber: lastId + 1,
      time: getTimestamp(),
      text: newUpdateText.trim(),
      user: username,
      train: selectedTrain.train,
      lastModifiedBy: username
    };

    const updatedList = [newUpdate, ...updates];
    updateTrainAndLog(updatedList, `Added - Update ${newUpdate.entryNumber} | ${newUpdate.time} | ${newUpdate.train} | ${username} → ${newUpdate.text}`);
    setNewUpdateText('');
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditText(updates[index].text);
  };

  const saveEdit = (index) => {
    const updated = [...updates];
    updated[index] = {
      ...updated[index],
      text: editText,
      lastModifiedBy: username,
      lastEditedAt: getTimestamp(),
      time: getTimestamp()
    };

    updateTrainAndLog(updated, `Edited - Update ${updated[index].entryNumber} | ${updated[index].time} | ${updated[index].train} | ${username} → ${updated[index].text}`);
    setEditingIndex(null);
    setEditText('');
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this update?");
    if (!confirmDelete) return;

    const deletedUpdate = updates[index];
    const updated = [...updates];
    updated.splice(index, 1);

    updateTrainAndLog(updated, `Deleted - Update ${deletedUpdate.entryNumber} | ${getTimestamp()} | ${deletedUpdate.train} | ${username} → ${deletedUpdate.text}`);
  };

  const formatEntryNumber = (entryNumber) => {
    return `Update ${entryNumber}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-1/2 bg-[#161b22] text-white p-4 flex flex-col overflow-y-auto shadow-2xl border-r border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📝 Train Updates Log — {selectedTrain.train}</h2>
          <button
            onClick={() => setShowUpdateLog(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            ✖ Close
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 mb-4">
          {updates.length > 0 ? (
            updates.map((update, index) => (
              <div key={update.id} className="border border-gray-700 rounded p-3 bg-gray-900">
                <div className="text-xs text-gray-400 mb-1 flex justify-between items-center">
                  <span>
                    {formatEntryNumber(update.entryNumber)} | {update.time} | 🚆 {update.train} | 👤 {update.user} | ✏️ Last Modified By: {update.lastModifiedBy}{update.lastEditedAt ? ` | 🕓 Edited At: ${update.lastEditedAt}` : ''}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-xs text-blue-400 hover:underline"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-400 hover:underline"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {editingIndex === index ? (
                  <div>
                    <textarea
                      className="w-full px-2 py-1 mb-2 rounded bg-gray-800 border border-gray-600 text-white"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      onClick={() => saveEdit(index)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-white">{update.text}</div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No updates yet.</p>
          )}
        </div>

        <div className="mt-auto">
          <textarea
            className="w-full h-24 px-3 py-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 mb-2"
            placeholder="Enter a free text update..."
            value={newUpdateText}
            onChange={(e) => setNewUpdateText(e.target.value)}
          />
          <button
            onClick={handleAddUpdate}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Update
          </button>
        </div>
      </div>

      <div className="flex-1 bg-black bg-opacity-50" onClick={() => setShowUpdateLog(false)} />
    </div>
  );
}
