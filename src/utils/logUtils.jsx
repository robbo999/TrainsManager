// src/utils/logUtils.js

// ✅ Fields tracked for change logging
export const TRACKED_FIELDS = [
  'train', 'location', 'class', 'serviceGroup', 'passengerGroup',
  'passengerRationale', 'timeStranded', 'canMove', 'ccilRef', 'btpRef',
  'initialUpdate', 'reasonStranded', 'estimatedDuration', 'timeOfDay',
  'distanceToStation', 'distanceToAccess', 'accessDescription', 'topography',
  'loadingConditions', 'vulnerablePassengers', 'internalHazards', 'externalHazards',
  'trainConditions', 'evacuationRisk', 'mitigationActions', 'staffing',
  'rescueOptions', 'tocPolicy', 'evacDecision', 'controlInstructions',
  'planA', 'planB', 'planC', 'activePlan'
];

// ✅ Helper: Get current HH:MM:SS timestamp
const getTimestamp = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:` +
         `${now.getMinutes().toString().padStart(2, '0')}:` +
         `${now.getSeconds().toString().padStart(2, '0')}`;
};
// ✅ Helper: Timestamp with seconds for detailed logs only
const getLogTimestamp = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:` +
         `${now.getMinutes().toString().padStart(2, '0')}:` +
         `${now.getSeconds().toString().padStart(2, '0')}`;
};
export { getTimestamp, getLogTimestamp };



// ✅ Helper: Get stored username (or fallback)
const getUsername = () => {
  return localStorage.getItem('username') || 'Unknown';
};

/**
 * ✅ Logs a change to a tracked field
 */
export const logFieldChange = (field, value, train, setTrain, setTrains, trains, trainId) => {
  const username = getUsername();
  const timestamp = getLogTimestamp();


  const logEntry = {
    time: timestamp,
    message: `Field "${field}" changed to "${value}" by ${username}`
  };

  const updatedTrain = {
    ...train,
    [field]: value,
    updates: [...(train.updates || []), logEntry],
    lastUpdate: new Date().toLocaleTimeString()
  };

  setTrain(updatedTrain);
  setTrains(trains.map(t => t.train === trainId ? updatedTrain : t));
};

/**
 * ✅ Logs a manual/custom message (e.g. review or decision)
 */
export const logCustomMessage = (message, train, setTrain, setTrains, trains, trainId) => {
  const username = getUsername();
  const timestamp = getLogTimestamp();


  const logEntry = {
    time: timestamp,
    message: `${message} by ${username}`
  };

  const updatedTrain = {
    ...train,
    updates: [...(train.updates || []), logEntry],
    lastUpdate: new Date().toLocaleTimeString()
  };

  setTrain(updatedTrain);
  setTrains(trains.map(t => t.train === trainId ? updatedTrain : t));
};

/**
 * ✅ Logs initial creation of a train
 */
export const logTrainAdded = (newTrain) => {
  const username = getUsername();
  const timestamp = getLogTimestamp();

  const logEntry = {
    time: timestamp,
    message: `➕ Train ${newTrain.train} added with score ${newTrain.riskScore} (${newTrain.riskLevel} risk) — review cycle ${newTrain.reviewCycle} by ${username}`
  };

  return {
    ...newTrain,
    updates: [...(newTrain.updates || []), logEntry],
    lastUpdate: new Date().toLocaleTimeString()
  };
};


/**
 * ✅ Logs differences between old and new train data
 */
export const logChangesOnSave = (oldTrain, newTrain) => {
  const username = getUsername();
  const timestamp = getLogTimestamp();


  const updatedFields = [];

  for (const key of TRACKED_FIELDS) {
    if (newTrain[key] !== oldTrain[key]) {
      const isPlanField = ['planA', 'planB', 'planC'].includes(key);
const isSystemField = ['riskScore', 'riskLevel', 'reviewCycle', 'nextReview'].includes(key);

const prefix = key === 'activePlan' ? '✏️' :
               isPlanField ? '🧭' :
               isSystemField ? '⚙️' :
               '✏️';

updatedFields.push(`${prefix} "${key}" changed to "${newTrain[key]}" by ${username}`);

    }
  }

  return updatedFields.map(msg => ({ time: timestamp, message: msg }));
};
