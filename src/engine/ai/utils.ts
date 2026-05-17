import { AiTrace, CrisisPacket, DraftReport, IncidentType, SafetySource } from '../../types';
import { RuntimeAiSettings } from './settings';

export interface AnalysisResult {
  packet: Partial<CrisisPacket>;
  questions: string[];
}

export interface ModelCallResult {
  text: string;
  trace: AiTrace;
}

export const SAFETY_SOURCES: SafetySource[] = [
  {
    label: 'FEMA flood safety',
    url: 'https://www.fema.gov/blog/7-flood-safety-tips',
  },
  {
    label: 'Red Cross CPR basics',
    url: 'https://www.redcross.org/take-a-class/cpr/performing-cpr/cpr-steps',
  },
  {
    label: 'CDC disaster power safety',
    url: 'https://www.cdc.gov/natural-disasters/response/what-to-do-protect-yourself-during-a-power-outage.html',
  },
];

export function nowIso() {
  return new Date().toISOString();
}

export function createTrace(settings: RuntimeAiSettings, provider: 'openrouter' | 'ollama'): AiTrace {
  return {
    provider,
    model: provider === 'ollama' ? settings.ollamaModel : settings.openRouterModel,
    started_at: nowIso(),
  };
}

export function completeTrace(trace: AiTrace, data?: Partial<AiTrace>): AiTrace {
  return {
    ...trace,
    ...data,
    completed_at: nowIso(),
  };
}

export function stripCodeFence(value: string) {
  return value.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
}

export function parseJsonObject<T>(value: string): T {
  const stripped = stripCodeFence(value);
  try {
    return JSON.parse(stripped) as T;
  } catch {
    const match = stripped.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI response did not contain a JSON object.');
    return JSON.parse(match[0]) as T;
  }
}

export function classifyIncident(text = ''): IncidentType {
  const lower = text.toLowerCase();
  if (/(flood|water|inunda|river|rain|flash)/.test(lower)) return 'flood';
  if (/(fire|smoke|burn|incend|flame)/.test(lower)) return 'fire';
  if (/(wire|power|electric|grid|curent|electro)/.test(lower)) return 'electrical_hazard';
  if (/(blocked|trapped|access|road|stranded|blocat)/.test(lower)) return 'blocked_access';
  return 'other';
}

export function buildEvidenceSummary(draft: DraftReport) {
  return {
    image_present: !!draft.image,
    audio_present: !!draft.audio,
    text_summary: draft.text || '',
  };
}

export function makePacketId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `sp-${Date.now().toString(36)}`;
}
