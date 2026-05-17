export type IncidentType = 'flood' | 'blocked_access' | 'fire' | 'electrical_hazard' | 'other';
export type Severity = 'low' | 'moderate' | 'high' | 'critical';
export type AiProvider = 'openrouter' | 'fallback';

export interface AiTrace {
  provider: AiProvider;
  model: string;
  started_at: string;
  completed_at?: string;
  request_id?: string;
  fallback_reason?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  notes?: string[];
}

export interface SafetySource {
  label: string;
  url: string;
}

export interface PeopleAtRisk {
  count: number;
  children_present: boolean;
  older_adults_present: boolean;
  injury_reported: boolean;
  trapped_reported: boolean;
}

export interface CrisisPacket {
  packet_id?: string;
  id?: string;
  language?: 'en' | 'local';
  incident_type: IncidentType;
  severity: Severity;
  location_text: string;
  lat?: number;
  lng?: number;
  time_observed: string;
  people_at_risk?: PeopleAtRisk;
  people_at_risk_count?: number; 
  hazards: string[];
  evidence?: {
    image_present: boolean;
    audio_present: boolean;
    text_summary: string;
  };
  uncertainties: string[];
  immediate_actions: string[];
  immediate_actions_local?: string[];
  help_needed: string[];
  share_message_short: string;
  share_message_short_local?: string;
  share_message_detailed: string;
  structured_report_markdown: string;
  structured_report_markdown_local?: string;
  sources_used: string[];
  model_provider?: AiProvider;
  model_name?: string;
  ai_trace?: AiTrace;
  fallback_used?: boolean;
  safety_sources?: SafetySource[];
  review_required?: boolean;
}

export type AppState = 
  | 'home' 
  | 'new_report' 
  | 'ai_review' 
  | 'clarification' 
  | 'packet_output' 
  | 'history' 
  | 'safety_guide'
  | 'ask_gemma'
  | 'medical_id'
  | 'emergency_toolkit';

export interface MedicalProfile {
  bloodType: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyContacts: string;
}

export interface DraftReport {
  image?: string; // base64
  audio?: string; // base64
  text?: string;
  location?: { lat: number, lng: number };
  fastSend?: boolean;
  stage: AppState;
  packet?: Partial<CrisisPacket>;
  clarificationQuestions?: string[];
  clarificationAnswers?: string[];
}
