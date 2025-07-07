import { trainClassOptions, serviceGroupOptions } from './dropdownOptions';

/**
 * Extract class numbers from a dropdown label like "Class 700 / 717 / 379"
 */
const getClassList = (label) =>
  label.match(/Class ([\d\/ ]+)/)?.[1]?.split(' / ') || [];

/**
 * Dynamically generate class arrays for RAG
 */
const redTraction = trainClassOptions
  .filter(opt => opt.value === 'Red')
  .flatMap(opt => getClassList(opt.label));

const amberTraction = trainClassOptions
  .filter(opt => opt.value === 'Amber')
  .flatMap(opt => getClassList(opt.label));

/**
 * Dynamically generate service group arrays for RAG
 */
const redServiceGroups = serviceGroupOptions
  .filter(opt => opt.value === 'Red')
  .map(opt => opt.label);

const amberServiceGroups = serviceGroupOptions
  .filter(opt => opt.value === 'Amber')
  .map(opt => opt.label);

/**
 * Calculate risk level, score, and review cycle for a train
 */
export function getRiskAssessment(train) {
  const scores = { Red: 5, Amber: 3, Green: 1 };

  // RAG logic for traction
  const redTraction = ['700', '717', '379'];
  const amberTraction = ['801', '180', '170', '185', '197'];

  const tractionRag = redTraction.includes(train.class)
    ? 'Red'
    : amberTraction.includes(train.class)
    ? 'Amber'
    : 'Green';

  // RAG logic for service groups
  const redServiceGroups = ['Airport Services', 'Commuter'];
  const amberServiceGroups = ['Sleeper', 'Short-Distance'];

  const serviceRag = redServiceGroups.includes(train.serviceGroup)
    ? 'Red'
    : amberServiceGroups.includes(train.serviceGroup)
    ? 'Amber'
    : 'Green';

  // Passenger group is already Red / Amber / Green
  const passengerRag = ['Red', 'Amber', 'Green'].includes(train.passengerGroup)
    ? train.passengerGroup
    : 'Green';

  const riskScore = scores[tractionRag] + scores[serviceRag] + scores[passengerRag];
  const riskLevel = riskScore >= 11 ? 'Red' : riskScore >= 6 ? 'Amber' : 'Green';

  // Extreme weather overrides review cycle
  const reviewCycle = train.extremeWeather ? '15m' :
    riskScore >= 11 ? '15m' :
    riskScore >= 6 ? '20m' : '30m';

  // 🛠️ Optional: Debug log
  console.log('🔍 getRiskAssessment:', {
    class: train.class,
    tractionRag,
    serviceGroup: train.serviceGroup,
    serviceRag,
    passengerGroup: train.passengerGroup,
    passengerRag,
    extremeWeather: train.extremeWeather,
    riskScore,
    riskLevel,
    reviewCycle
  });

  return { riskScore, riskLevel, reviewCycle };
}

