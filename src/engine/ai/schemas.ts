type SchemaType = 'object' | 'array' | 'string' | 'integer' | 'number';

interface JsonSchema {
  type: SchemaType;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  enum?: string[];
  description?: string;
  required?: string[];
}

export const analysisSchema: JsonSchema = {
  type: 'object',
  properties: {
    incident_type: { type: 'string', enum: ['flood', 'blocked_access', 'fire', 'electrical_hazard', 'other'], description: 'Type of incident' },
    hazards: { type: 'array', items: { type: 'string' }, description: 'List of observed hazards' },
    uncertainties: { type: 'array', items: { type: 'string' }, description: 'Missing critical information' },
    clarification_questions: { 
      type: 'array', 
      items: { type: 'string' },
      description: '1 to 3 short yes/no or simple questions to determine safety/risk (e.g. "Is anyone trapped?", "Are there visible downed power lines?")'
    }
  },
  required: ['incident_type', 'hazards', 'uncertainties', 'clarification_questions']
};

export const packetSchema: JsonSchema = {
  type: 'object',
  properties: {
    severity: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
    location_text: { type: 'string' },
    people_at_risk_count: { type: 'integer' },
    immediate_actions: { type: 'array', items: { type: 'string' } },
    immediate_actions_local: { type: 'array', items: { type: 'string' } },
    share_message_short: { type: 'string' },
    share_message_short_local: { type: 'string' },
    share_message_detailed: { type: 'string' },
    structured_report_markdown: { type: 'string' },
    structured_report_markdown_local: { type: 'string' },
    lat: { type: 'number' },
    lng: { type: 'number' }
  },
  required: ['severity', 'location_text', 'people_at_risk_count', 'immediate_actions', 'immediate_actions_local', 'share_message_short', 'share_message_short_local', 'structured_report_markdown', 'structured_report_markdown_local']
};
