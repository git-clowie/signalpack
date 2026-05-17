# SignalPack

![SignalPack Logo](public/brand/signalpack-flare.svg)

**AI emergency alerts and Crisis Packets powered by Gemma 4.**

SignalPack turns emergency chaos into trusted alerts and structured action. It is a local-first PWA that helps users capture messy signals, ask only the critical follow-up questions, and generate a reviewable Crisis Packet they can copy, export, save, or share.

## Product Frame

```txt
Prepare -> Alert -> Understand -> Act
```

- **Prepare:** Emergency Profile, Safety Guide, local-first history, PWA readiness.
- **Alert:** quick text, photo, voice, GPS, and Rapid Packet Mode.
- **Understand:** Gemma 4 structures messy input and detects missing critical details.
- **Act:** Crisis Packet, share message, packet history, incident map, readiness toolkit.

## AI Providers

SignalPack is API-first for the live PWA, focused on Gemma 4 through OpenRouter.

- **Hosted:** OpenRouter Chat Completions API
- **Hosted default model:** `google/gemma-4-26b-a4b-it`
- **Fallback:** deterministic safety fallback when the selected provider is unavailable

API keys are entered in **Settings -> AI Engine Routing** and stored only in browser `localStorage`. No demo key is committed to the repo.

Advanced users can adapt the provider layer for their own on-device Gemma runtime, but the public PWA ships with OpenRouter as the functional path.

## Running The App

```bash
npm ci
npm run dev
```

Build for production/PWA:

```bash
npm run build
```

Type-check:

```bash
npm run lint
```

## Repository Layout

```txt
/src
  /components        # UI screens, Signal Flare logo, report output, provider settings
  /engine/ai         # OpenRouter provider, prompts, fallback, packet generation
  /engine/state      # App state and local workflow coordination
  /engine/sync       # Offline packet queue for authenticated sync
  /types.ts          # Crisis Packet and app types
/docs
  SignalPack_Competition_Presentation_Pack.md
/public/brand
  signalpack-flare.svg
```

## Competition Materials

The working presentation, Kaggle write-up draft, demo script, and checklist live in:

[docs/SignalPack_Competition_Presentation_Pack.md](docs/SignalPack_Competition_Presentation_Pack.md)

Core demo scenario:

```txt
Water entered the ground floor. Two elderly people are inside. Exit may be blocked.
```

## Safety Position

SignalPack is not a replacement for emergency services, a dispatch system, or a medical diagnosis tool. It marks uncertainty, keeps outputs reviewable, and prepares messages that users can share with trusted contacts, volunteers, or emergency services.
