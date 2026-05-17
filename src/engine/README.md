# SignalPack Engine

The `src/engine` directory contains all non-UI logic, cleanly separated to ensure scalability, ease of testing, and avoidance of "mammoth files". This also sets up the ground for Web + Capacitor (Mobile) cross-platform implementation.

## Structure

- `/state` - Zustand based global state machines (replacing heavy App.tsx `useState`).
- `/ai` - Core analysis engine powered by **Gemma 4** through OpenRouter. It marks deterministic fallback output explicitly when the provider is unavailable.
- `/location` - Geolocation services gracefully degrading (GPS -> Network -> IP).
- `/media` - Image compression and audio processing for efficient data usage on 3G limits.
- `/sync` - (Future) Offline-first queue & background sync.

## Guidelines for AI / Agentic Agents

- **No UI Elements**: React components are strictly forbidden in this directory. Do not mix `.tsx` logic that imports DOM nodes here.
- **Cross-Platform Preparedness**: Expect code here to run under standard Browser APIs as well as Capacitor polyfills. Do not rely heavily on strictly web-only bleeding edge APIs without graceful fallbacks.
- **Fail Gracefully (The Core Tenet)**: 
  - If a provider is unavailable, fall back to deterministic safety output and mark it clearly.
  - The UI must NOT crash if the `ai/` folder throws an error or detects no connection.
- **Limit Complexity**: Keep engines modular. Do not build huge monolith wrappers.
