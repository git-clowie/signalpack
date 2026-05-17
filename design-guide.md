# Premium rebrand and updated app design for SignalPack

## Executive summary
**SignalPack** as the master brand, **Crisis Packet** as the core output, and **Gemma 4** as the engine.
**Tagline**: “Turn uncertainty into a clear response.”

## Visual identity system
**Primary palette**
* Midnight Navy: `#10233B`
* Response Blue: `#1F5FFF`
* Support Teal: `#0A7A74`
* Cloud White: `#F5F8FC`
* Slate: `#5C6B82`
* Border Mist: `#E1E8F0`

**Status palette**
* Critical: `#C93B50` / Tint: `#FBE7EA`
* Warning: `#8A5400` / Tint: `#FFF3DE`
* Success: `#13795B` / Tint: `#E5F6EF`

**Typography**
* Inter Display for headings
* Inter for interface and body text 

## Core user flow
1. **Home**: Entry, trust, recent activity
2. **New Report**: Capture input (photo, text, voice)
3. **AI Review**: Show understanding, missing critical info
4. **Clarification Flow**: Short questions to establish safety parameters
5. **Packet Output**: Summary, what to do now, message ready to send, structured packet
6. **History / Safety Guide**

## Data schema (Output limit example)
```json
{
  "packet_id": "uuid",
  "incident_type": "flood | blocked_access | fire | electrical_hazard | other",
  "severity": "low | moderate | high | critical",
  "people_at_risk": {},
  "immediate_actions": [],
  "share_message_short": ""
}
```
