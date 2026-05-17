export const demoPackets = [
  {
    id: "demo-1",
    userId: "demo-user",
    severity: "critical",
    incident_type: "flood",
    location_text: "Sector 4, Sos. Berceni",
    people_at_risk_count: 2,
    immediate_actions: [
      "Move to the highest floor immediately.",
      "Do not touch electrical appliances or exposed wires."
    ],
    immediate_actions_local: [
       "Mutați-vă imediat la etajul superior.",
       "Nu atingeți aparate electrice."
    ],
    share_message_short: "CRITICAL: Flooding at Sector 4, Sos. Berceni. 2 adults trapped. Water rising fast. Need boat evacuation.",
    share_message_short_local: "CRITIC: Inundație în Sector 4, Sos. Berceni. 2 adulți blocați. Apa crește rapid. E nevoie de evacuare cu barca.",
    share_message_detailed: "CRITICAL: Flooding at Sector 4, Sos. Berceni. 2 adults trapped. Water rising fast. Need boat evacuation.",
    structured_report_markdown: "# Incident Report\n**Severity**: Critical\n**Location**: Sector 4, Sos. Berceni\n\nWater has breached the ground floor. Electrical system compromised.",
    structured_report_markdown_local: "# Raport Incident\n**Severitate**: Critic\n**Locație**: Sector 4, Sos. Berceni\n\nApa a intrat la parter. Sistemul electric afectat.",
    sources_used: ["User Voice Note", "Advanced Cloud AI"],
    uncertainties: ["Structural integrity of the building."],
    hazards: ["Electrocution risk", "Rapid water rising"],
    help_needed: ["Evacuation team", "Medical unit"]
  },
  {
    id: "demo-2",
    userId: "demo-user",
    severity: "moderate",
    incident_type: "fire",
    location_text: "Sector 2, Bd. Unirii",
    people_at_risk_count: 0,
    immediate_actions: [
      "Avoid the area.",
      "Keep windows closed due to smoke."
    ],
    immediate_actions_local: [
       "Evitați zona.",
       "Țineți ferestrele închise din cauza fumului."
    ],
    share_message_short: "MODERATE: Car fire on Bd. Unirii. Both lanes blocked. Fire expanding to trees.",
    share_message_short_local: "MODERAT: Incendiu auto pe Bd. Unirii. Ambele benzi blocate. Focul se extinde la copaci.",
    share_message_detailed: "MODERATE: Car fire on Bd. Unirii. Both lanes blocked. Fire expanding to trees.",
    structured_report_markdown: "# Incident Report\n**Severity**: Moderate\n**Location**: Bd. Unirii\n\nVehicle fully engulfed in flames. No visible passengers.",
    structured_report_markdown_local: "# Raport Incident\n**Severitate**: Moderat\n**Locație**: Bd. Unirii\n\nVehicul în flăcări. Fără pasageri vizibili.",
    sources_used: ["User Photo", "Advanced Cloud AI"],
    uncertainties: ["Are there any hazardous materials in the car?"],
    hazards: ["Smoke inhalation", "Potential explosion"],
    help_needed: ["Fire Department", "Traffic Police"]
  }
];
