export function generateIncidentSummary(trains, incidentTitle) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let summary = `Stranded Trains Summary – ${incidentTitle} – Created at ${timestamp}\n\n`;

  trains.forEach((train) => {
    summary += `${train.train} – Location: ${train.location || 'Unknown'} – Stranded at ${train.timeStranded || 'N/A'}\n`;
    summary += `Risk Level: ${train.riskLevel || 'N/A'}\n`;
    let planKey = train.activePlan?.replace(/\s+/g, ''); // "Plan A" → "PlanA"
let fullPlan = train[`plan${planKey?.slice(-1)}`];   // extracts A from PlanA → planA
summary += `Plan: ${train.activePlan || 'None'} – ${fullPlan || 'No details'}\n`;


    if (train.freeTextUpdates?.length) {
      summary += `Updates:\n`;
      train.freeTextUpdates.forEach(update => {
        summary += `- Update ${update.entryNumber} | ${update.time} | 👤 ${update.user}: ${update.text}\n`;
      });
    }

    summary += `\n`;
  });

  return summary.trim();
}
