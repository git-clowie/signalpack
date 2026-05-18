import { CrisisPacket, DraftReport, MedicalProfile } from '../../types';
import { classifyIncident, buildEvidenceSummary, makePacketId, nowIso, SAFETY_SOURCES } from './utils';
import { APP_VERSION, PACKET_SCHEMA_VERSION } from '../../version';

function readableFallbackReason(reason: string) {
  const lower = reason.toLowerCase();
  if (lower.includes('429') || lower.includes('rate-limit') || lower.includes('rate limited')) {
    return 'Gemma 4 is temporarily rate-limited upstream. Retry shortly or use another OpenRouter key/model.';
  }
  if (lower.includes('missing openrouter api key')) {
    return 'OpenRouter key is missing. Add a key in Settings to use hosted Gemma 4.';
  }
  if (lower.includes('ollama') || lower.includes('localhost:11434')) {
    return 'Local Ollama is not reachable. Start Ollama on this device, allow the app origin, or switch back to OpenRouter.';
  }
  if (lower.includes('401') || lower.includes('403') || lower.includes('unauthorized')) {
    return 'OpenRouter rejected the key or model access. Check Settings and try again.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Network connection to the hosted Gemma 4 provider failed.';
  }
  return 'Hosted Gemma 4 provider was unavailable. Review manually or retry.';
}

export function fallbackAnalysis(text: string, reason: string) {
  const publicReason = readableFallbackReason(reason);
  const incidentType = classifyIncident(text);
  const hazards = incidentType === 'flood'
    ? ['Possible floodwater, debris, and electrical hazard']
    : incidentType === 'fire'
      ? ['Possible smoke, flame spread, and blocked access']
      : incidentType === 'electrical_hazard'
        ? ['Possible energized wires or unsafe electrical source']
        : ['Unverified hazard; review manually'];

  return {
    packet: {
      incident_type: incidentType,
      hazards,
      uncertainties: [publicReason, 'Confirm people at risk and immediate danger.'],
      model_provider: 'fallback' as const,
      model_name: 'deterministic-safety-fallback',
      fallback_used: true,
      ai_trace: {
        provider: 'fallback' as const,
        model: 'deterministic-safety-fallback',
        started_at: nowIso(),
        completed_at: nowIso(),
        fallback_reason: reason,
      },
    },
    questions: [
      'Is anyone injured, trapped, or unable to leave safely?',
      'Is there fire, floodwater, smoke, gas smell, or downed power near you?',
      'Can emergency services reach your exact location right now?',
    ],
  };
}

export function fallbackPacket(draft: DraftReport, reason: string, medicalProfile?: MedicalProfile): CrisisPacket {
  const publicReason = readableFallbackReason(reason);
  const incidentType = draft.packet?.incident_type || classifyIncident(draft.text);
  const locationText = draft.location
    ? `${draft.location.lat.toFixed(5)}, ${draft.location.lng.toFixed(5)}`
    : 'Unknown location';
  const medicalNote = medicalProfile && (medicalProfile.bloodType || medicalProfile.allergies || medicalProfile.conditions)
    ? `\n\nEmergency Profile: blood type ${medicalProfile.bloodType || 'unknown'}; allergies ${medicalProfile.allergies || 'none listed'}; conditions ${medicalProfile.conditions || 'none listed'}.`
    : '';

  return {
    ...draft.packet,
    app_version: APP_VERSION,
    packet_schema_version: PACKET_SCHEMA_VERSION,
    packet_id: makePacketId(),
    language: 'en',
    incident_type: incidentType,
    severity: 'moderate',
    location_text: locationText,
    lat: draft.location?.lat,
    lng: draft.location?.lng,
    time_observed: nowIso(),
    people_at_risk: {
      count: 0,
      children_present: false,
      older_adults_present: false,
      injury_reported: false,
      trapped_reported: false,
    },
    people_at_risk_count: 0,
    hazards: draft.packet?.hazards || ['Unverified hazard; review manually'],
    evidence: buildEvidenceSummary(draft),
    uncertainties: draft.packet?.uncertainties || [publicReason],
    immediate_actions: [
      'Call 112/911 now if anyone is injured, trapped, unable to leave safely, or the danger is escalating.',
      'Move away from fire, floodwater, gas smell, smoke, or downed power if safe to do so.',
      'If everyone is safe, capture details, monitor the situation, and share your location with a trusted contact.',
    ],
    immediate_actions_local: [
      'Sunați la 112 acum dacă cineva este rănit, blocat, nu poate pleca în siguranță sau pericolul crește.',
      'Îndepărtați-vă de foc, apă, fum, miros de gaz sau cabluri electrice dacă puteți face asta în siguranță.',
      'Dacă toată lumea este în siguranță, capturați detalii, monitorizați situația și trimiteți locația unei persoane de încredere.',
    ],
    help_needed: ['Emergency services', 'Manual review'],
    share_message_short: `Emergency report near ${locationText}. Situation type: ${incidentType}. Details need manual review.`,
    share_message_short_local: `Raport de urgență la ${locationText}. Tip situație: ${incidentType}. Detaliile necesită verificare manuală.`,
    share_message_detailed: `SignalPack fallback packet. ${draft.text || 'No text description provided.'}${medicalNote}`,
    structured_report_markdown: `# SignalPack Crisis Packet\n\n## Situation\nFallback packet generated because: ${publicReason}\n\n**Incident type:** ${incidentType}\n\n## Emergency call decision\nCall 112/911 now if anyone is injured, trapped, unable to leave safely, or the danger is escalating. If everyone is safe, keep documenting and monitor.\n\n## Location / Evidence\n**Location:** ${locationText}\n\n**User notes:** ${draft.text || 'No text provided.'}${medicalNote}\n\n## Uncertainty\nDetails require manual review because the model provider was unavailable.`,
    structured_report_markdown_local: `# SignalPack Crisis Packet\n\n## Situație\nPachet fallback generat deoarece: ${publicReason}\n\n**Tip incident:** ${incidentType}\n\n## Decizie apel 112\nSunați la 112 acum dacă cineva este rănit, blocat, nu poate pleca în siguranță sau pericolul crește. Dacă toată lumea este în siguranță, documentați și monitorizați.\n\n## Locație / Dovezi\n**Locație:** ${locationText}\n\n**Notițe user:** ${draft.text || 'Fără text.'}${medicalNote}\n\n## Incertitudine\nDetaliile necesită verificare manuală deoarece providerul AI nu a fost disponibil.`,
    sources_used: ['User input', 'Deterministic fallback rules'],
    safety_sources: SAFETY_SOURCES,
    model_provider: 'fallback',
    model_name: 'deterministic-safety-fallback',
    fallback_used: true,
    ai_trace: {
      provider: 'fallback',
      model: 'deterministic-safety-fallback',
      started_at: nowIso(),
      completed_at: nowIso(),
      fallback_reason: reason,
    },
    review_required: true,
  };
}
