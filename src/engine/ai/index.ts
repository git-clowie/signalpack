import { CrisisPacket, DraftReport, MedicalProfile } from '../../types';
import { SYSTEM_PROMPTS } from './prompts';
import { fallbackAnalysis, fallbackPacket } from './fallback';
import { callOpenRouter } from './providers';
import { getRuntimeAiSettings } from './settings';
import {
  AnalysisResult,
  buildEvidenceSummary,
  makePacketId,
  nowIso,
  parseJsonObject,
  SAFETY_SOURCES,
} from './utils';

interface AnalysisJson {
  incident_type?: CrisisPacket['incident_type'];
  hazards?: string[];
  uncertainties?: string[];
  clarification_questions?: string[];
}

interface PacketJson {
  severity?: CrisisPacket['severity'];
  location_text?: string;
  people_at_risk_count?: number;
  hazards?: string[];
  uncertainties?: string[];
  immediate_actions?: string[];
  immediate_actions_local?: string[];
  help_needed?: string[];
  share_message_short?: string;
  share_message_short_local?: string;
  share_message_detailed?: string;
  structured_report_markdown?: string;
  structured_report_markdown_local?: string;
  lat?: number;
  lng?: number;
}

function buildUserContent(text: string, imageBase64?: string, audioBase64?: string) {
  const parts: any[] = [];
  if (imageBase64) {
    parts.push({ type: 'image_url', image_url: { url: imageBase64 } });
  }
  parts.push({
    type: 'text',
    text: `${text || 'No written description provided.'}${audioBase64 ? '\n\nAudio evidence was captured in-app. If the selected model cannot process audio, treat it as attached evidence and ask for a typed summary.' : ''}`,
  });
  return parts;
}

async function callConfiguredModel(system: string, userContent: any, jsonMode = true) {
  const settings = getRuntimeAiSettings();
  const messages = [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: userContent },
  ];

  return callOpenRouter(settings, messages, { jsonMode });
}

export async function analyzeIncident(
  text: string,
  imageBase64?: string,
  audioBase64?: string,
  medicalProfile?: MedicalProfile,
): Promise<AnalysisResult> {
  const profileContext = medicalProfile && (medicalProfile.bloodType || medicalProfile.allergies || medicalProfile.conditions)
    ? `\n\nEmergency Profile context: blood type ${medicalProfile.bloodType || 'unknown'}; allergies ${medicalProfile.allergies || 'none listed'}; conditions ${medicalProfile.conditions || 'none listed'}.`
    : '';

  const system = `${SYSTEM_PROMPTS.ANALYSIS_ENGINE}

Return a JSON object only with:
incident_type, hazards, uncertainties, clarification_questions.
Ask at most 3 short clarification questions.${profileContext}`;

  try {
    const result = await callConfiguredModel(system, buildUserContent(text, imageBase64, audioBase64));
    const data = parseJsonObject<AnalysisJson>(result.text);

    return {
      packet: {
        incident_type: data.incident_type || 'other',
        hazards: data.hazards || [],
        uncertainties: data.uncertainties || [],
        model_provider: result.trace.provider,
        model_name: result.trace.model,
        fallback_used: false,
        ai_trace: result.trace,
      },
      questions: data.clarification_questions || [],
    };
  } catch (error) {
    console.error('SignalPack analysis fallback:', error);
    return fallbackAnalysis(text, error instanceof Error ? error.message : String(error));
  }
}

export async function askGemma(
  message: string,
  history: Array<{role: 'user' | 'model'; content: string}>,
) {
  const transcript = history
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const system = `${SYSTEM_PROMPTS.FIRST_AID_ASSISTANT}

Do not diagnose. Give immediate, short safety steps. If the situation sounds life-threatening, tell the user to call emergency services first.`;

  try {
    const result = await callConfiguredModel(system, `${transcript}\n\nUser: ${message}`, false);
    return result.text || 'I am unable to provide a response right now.';
  } catch (error) {
    console.error('AskGemma fallback:', error);
    return 'AI provider is not available. If someone is in danger, call emergency services now. Use the Safety Guide for offline basics.';
  }
}

export async function generatePacket(
  draft: DraftReport,
  medicalProfile?: MedicalProfile,
): Promise<CrisisPacket> {
  const browserLoc = navigator.language || 'en-US';
  const localTarget = browserLoc.split('-')[0];
  const userLocContext = draft.location
    ? `Lat: ${draft.location.lat}, Lng: ${draft.location.lng}`
    : 'Unknown';
  const clarifications = (draft.clarificationQuestions || [])
    .map((question, index) => `Q: ${question}\nA: ${draft.clarificationAnswers?.[index] || 'No answer'}`)
    .join('\n');
  const medicalContext = medicalProfile && (medicalProfile.bloodType || medicalProfile.allergies || medicalProfile.conditions)
    ? `\nEmergency Profile: blood type ${medicalProfile.bloodType || 'unknown'}; allergies ${medicalProfile.allergies || 'none listed'}; conditions ${medicalProfile.conditions || 'none listed'}; medications ${medicalProfile.medications || 'none listed'}; emergency contacts ${medicalProfile.emergencyContacts || 'none listed'}.`
    : '';

  const system = `${SYSTEM_PROMPTS.MASTER_ENGINE}

Return JSON only with:
severity, location_text, people_at_risk_count, hazards, uncertainties, immediate_actions, immediate_actions_local, help_needed, share_message_short, share_message_short_local, share_message_detailed, structured_report_markdown, structured_report_markdown_local, lat, lng.

Rules:
- Do not invent facts.
- Mark uncertainty clearly.
- Keep action steps concise and safe.
- Target local language ISO: ${localTarget}.`;

  const prompt = `Initial report:
${draft.text || 'Only media provided.'}

Previous analysis:
${JSON.stringify(draft.packet || {}, null, 2)}

Clarifications:
${clarifications || 'None'}

Context:
- Current location: ${userLocContext}
- Image evidence present: ${draft.image ? 'yes' : 'no'}
- Audio evidence present: ${draft.audio ? 'yes' : 'no'}${medicalContext}`;

  try {
    const result = await callConfiguredModel(system, buildUserContent(prompt, draft.image, draft.audio));
    const data = parseJsonObject<PacketJson>(result.text);

    return {
      ...draft.packet,
      packet_id: makePacketId(),
      language: 'en',
      incident_type: draft.packet?.incident_type || 'other',
      severity: data.severity || 'moderate',
      location_text: data.location_text || (draft.location ? userLocContext : 'Unknown location'),
      time_observed: nowIso(),
      people_at_risk: {
        count: data.people_at_risk_count || 0,
        children_present: false,
        older_adults_present: false,
        injury_reported: false,
        trapped_reported: false,
      },
      people_at_risk_count: data.people_at_risk_count || 0,
      hazards: data.hazards || draft.packet?.hazards || [],
      evidence: buildEvidenceSummary(draft),
      uncertainties: data.uncertainties || draft.packet?.uncertainties || [],
      immediate_actions: data.immediate_actions || [],
      immediate_actions_local: data.immediate_actions_local || [],
      help_needed: data.help_needed || [],
      share_message_short: data.share_message_short || '',
      share_message_short_local: data.share_message_short_local || '',
      share_message_detailed: data.share_message_detailed || '',
      structured_report_markdown: data.structured_report_markdown || '',
      structured_report_markdown_local: data.structured_report_markdown_local || '',
      lat: data.lat || draft.location?.lat,
      lng: data.lng || draft.location?.lng,
      sources_used: ['User input', 'OpenRouter Gemma 4'],
      safety_sources: SAFETY_SOURCES,
      model_provider: result.trace.provider,
      model_name: result.trace.model,
      fallback_used: false,
      ai_trace: result.trace,
      review_required: true,
    };
  } catch (error) {
    console.error('SignalPack packet fallback:', error);
    return fallbackPacket(draft, error instanceof Error ? error.message : String(error), medicalProfile);
  }
}
