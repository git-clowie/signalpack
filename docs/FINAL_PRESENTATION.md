# SignalPack Final Presentation Kit

Use this as the short, competition-ready presentation spine. The longer source pack remains in `docs/SignalPack_Competition_Presentation_Pack.md`.

Competition target: The Gemma 4 Good Hackathon on Kaggle.

Submission posture: public repo, live demo, 3-minute video, clear technical write-up, and a working product story.

## One-Line Pitch

SignalPack turns chaotic emergency input into a structured Crisis Packet, powered by Gemma 4 and reviewed by the user before sharing.

## Jury Thesis

Most emergency tools assume calm users, complete forms, and stable conditions. SignalPack is built for the opposite moment: partial information, stress, limited time, and the need to communicate clearly.

Gemma 4 is not used as a generic chatbot. It acts as the structuring layer that turns incomplete text, photo, audio, and location context into a reviewable communication object.

## 8-Slide Deck

### 1. Title

Claim: Emergency chaos needs a clear signal.

Visual: full-width animated SignalPack logo on black, then app dashboard hero.

Copy:

```txt
SignalPack
AI emergency alerts and Crisis Packets powered by Gemma 4
```

Speaker note: "This is SignalPack, a local-first emergency readiness and reporting PWA."

### 2. Problem

Claim: In a crisis, the first report is usually messy.

Proof points:

- people send fragments, not structured reports
- important details are often missing
- responders and trusted contacts need concise, shareable context

Visual: blurred raw message beside a clean packet outline.

Speaker note: "SignalPack starts from the reality that people do not fill perfect forms under stress."

### 3. Product

Claim: Capture what you can. Gemma 4 structures the rest.

Flow:

```txt
Quick Capture -> Gemma 4 Analysis -> Critical Details -> Crisis Packet -> Share / Save
```

Visual: one clean product flow using screenshots.

Speaker note: "The product is not another safety checklist. It is a working path from signal to action."

### 4. Demo Scenario

Claim: A flooding report becomes actionable in under a minute.

Demo input:

```txt
Water entered the ground floor. Two elderly people are inside. Exit may be blocked.
```

Visual: Start Alert screen with this input.

Speaker note: "This scenario is simple, high stakes, and shows missing information clearly."

### 5. Gemma 4 Layer

Claim: Gemma 4 turns incomplete signals into structured emergency reasoning.

Show:

- incident type
- people at risk
- hazards
- uncertainties
- immediate actions
- clarification questions
- `model_provider`, `model_name`, `ai_trace`, `fallback_used`

Visual: AI Review and AI Trace panels.

Speaker note: "We expose the model path and fallback state because trust matters more than magic."

### 6. Crisis Packet

Claim: The output is a usable object, not just an answer.

Show:

- severity
- incident overview
- safety sources
- immediate actions
- structured Markdown report
- quick share text
- WhatsApp, email, PDF, Markdown, JSON export

Visual: Packet Output screen.

Speaker note: "The user reviews before sharing. SignalPack helps communicate; it does not pretend to dispatch services."

### 7. Architecture

Claim: API-first demo now, user-owned local Gemma path available for advanced users.

Architecture:

```txt
React PWA
  -> localStorage / optional Firebase sync
  -> OpenRouter Gemma 4 provider
  -> optional local Ollama provider on the user's device
  -> deterministic marked fallback
  -> Crisis Packet schema
  -> share/export surfaces
```

Visual: simple system diagram with OpenRouter, local history, optional Firebase, export.

Speaker note: "The live demo works through OpenRouter. Users can bring their own key, sign in with optional Firebase sync, or point the app at a local Ollama runtime when they have Gemma running on their device."

### 8. Impact

Claim: SignalPack is designed for Global Resilience and Safety & Trust.

Why it matters:

- helps ordinary people communicate clearly during emergencies
- preserves human review
- keeps uncertainty visible
- works as a PWA with local-first history
- gives judges a functional live demo, not only a concept

Closing line:

```txt
Trusted alerts. Structured action. Powered by Gemma 4.
```

## 3-Minute Video Script

### 0:00-0:20 Hook

Visual: black screen, animated SignalPack logo, then a raw emergency message appears.

Voiceover:

```txt
In an emergency, the first message is rarely complete. It is rushed, emotional, and missing details.
```

### 0:20-0:45 Product Intro

Visual: dashboard hero, Start Alert, Rapid Packet.

Voiceover:

```txt
SignalPack is a local-first emergency alert PWA. It helps a person capture what they know, then uses Gemma 4 to structure it into a Crisis Packet.
```

### 0:45-1:20 Capture

Visual: Start Alert, text input, optional media/location.

Voiceover:

```txt
The user does not need to complete a long form. They can send a short description, add photo or audio context, and keep moving.
```

### 1:20-1:55 Gemma 4 Analysis

Visual: AI analysis result and clarification.

Voiceover:

```txt
Gemma 4 identifies the likely incident, extracts hazards and people at risk, and flags what is missing. When the model route is unavailable, SignalPack marks fallback output clearly.
```

### 1:55-2:30 Crisis Packet

Visual: final packet with trace, actions, report, share/export controls.

Voiceover:

```txt
The result is not just a chatbot answer. It is a structured packet: severity, location, risks, immediate actions, uncertainty, and a shareable message the user reviews before sending.
```

### 2:30-3:00 Architecture + Close

Visual: architecture diagram, GitHub README, live demo URL.

Voiceover:

```txt
SignalPack is built as a React PWA with OpenRouter-hosted Gemma 4 for the live demo, optional local Ollama routing for user-owned Gemma inference, local-first history, optional Firebase sync, and browser-native export. It is designed for global resilience: clear signals, trusted alerts, and structured action.
```

## Kaggle Write-Up Short Draft

### Title

SignalPack: AI Emergency Alerts and Crisis Packets Powered by Gemma 4

### Overview

SignalPack is a local-first emergency readiness and reporting PWA that turns messy emergency input into structured Crisis Packets. Users can capture text, photo, audio, and location context; Gemma 4 then helps identify hazards, missing details, immediate actions, and a shareable message.

### Why Gemma 4

Gemma 4 is the intelligence layer. It is used to structure incomplete signals, ask focused clarification questions, and generate a Crisis Packet schema that can be reviewed, exported, and shared. SignalPack also exposes provider metadata and fallback state so judges can inspect how the AI layer behaved.

### Technical Architecture

SignalPack is built with React, TypeScript, Vite, Tailwind CSS, Zustand, Vite PWA, Leaflet, optional Firebase sync, and OpenRouter Chat Completions for the hosted Gemma 4 path. Public users bring their own OpenRouter key; the private hosted demo can use a restricted deploy-time key. The app stores non-login data locally and supports Markdown, JSON, PDF/print, WhatsApp, email, native share, and copy flows.

### Safety

SignalPack does not replace emergency services, dispatch responders, or provide medical diagnosis. It keeps the user in control, requires review before sharing, marks uncertainty, and labels deterministic fallback output when the AI provider is unavailable.

### Demo Links

- Live demo: `https://pixek.xyz/signalpack`
- GitHub: `https://github.com/git-clowie/signalpack`

## Recording Checklist

- Use Chrome or Safari, not the Codex in-app browser, for final download/export recording.
- Start from a clean dashboard.
- Confirm Ask Gemma responds before recording.
- Keep one fallback screenshot ready in case OpenRouter is rate-limited.
- Show the README animated logo and architecture section for repo polish.
- End on the final line: "Trusted alerts. Structured action. Powered by Gemma 4."

## Sources

- Official competition page: https://www.kaggle.com/competitions/gemma-4-good-hackathon
- Competition summary and requirements reference: https://www.competehub.dev/en/competitions/kagglegemma-4-good-hackathon
