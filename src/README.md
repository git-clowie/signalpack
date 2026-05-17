# SignalPack Source (`/src`)

The core application code. Adheres to strict agentic coding rules.

## Root Subdirectories
- `/components`: Strictly UI React components following the 250 LOC limit rule and using Tailwind CSS.
- `/engine`: Non-UI headless logic (State, Location, Image Processing, AI Engine).
- `/lib`: Helper utilities (e.g., shadcn utils `cn()`).

## High-Level Data Flow
1. **User input** in `/components/NewReport.tsx` updates Zustand state in `/engine/state`.
2. **AI Analysis** in `/engine/ai` uses Gemma 4 via OpenRouter to extract entities and structure Crisis Packets.
3. If the selected provider is unavailable, `/engine/ai` returns a marked deterministic fallback packet.
4. **Packet rendering and share/export** are handled in `/components/PacketOutput.tsx` and `/utils/export.ts`.
5. Syncing is abstracted through `/engine/sync`.

## Adding new UI features
Always place new feature components in `/components`. If it requires state, add small Zustand slices to `/engine/state`. If it needs AI, add endpoints to `/engine/ai`. 

Keep logic and UI completely decoupled.
