# SignalPack — Final UI / UX / Visual Direction

**Context:** current SignalPack UI is already functional and on the right dark tactical path. This document summarizes the final direction to make it feel more premium, more focused, and more competition-ready.

**Core product frame:**  
`Prepare → Alert → Understand → Act`

**Core object:**  
`Crisis Packet`

**Core promise:**  
`Turn chaos into clarity.`

**AI core:**  
`Gemma 4 structures emergency signals into Crisis Packets.`

---

# 1. Quick UI Assessment

## What works now

- The app already feels like a serious dark-mode emergency tool.
- The sidebar navigation is clear.
- The main CTA area is strong.
- The product concept is visible: **Crisis Packet**, **Start Alert**, **Rapid Packet**, **Gemma 4**.
- The map adds a good tactical feeling.
- The current dark palette is close to the desired direction.

## What needs refinement

The current screen feels slightly too flat and low-contrast. It has the right structure, but it needs stronger premium hierarchy.

Main issues:

```txt
1. Too much empty darkness on the left and right.
2. Main content feels narrow and underpowered.
3. Cards are too faint; borders and surfaces need more depth.
4. Quick Capture cards feel inactive instead of useful.
5. The hero section should feel more like the command center of the app.
6. The map is visually cool, but too dim and not yet actionable.
7. The red Rapid Packet button feels too destructive/panic-driven.
8. Gemma 4 status is too technical and hidden.
9. The logo/app identity is too small compared to the product experience.
10. The whole screen needs one premium visual anchor: radar glow / signal flare / crisis packet panel.
```

Target feeling:

```txt
Less empty black.
More premium command layer.
More readable.
More focused.
More alive.
Still calm.
```

---

# 2. Final Visual Direction

## North Star

SignalPack should look like:

```txt
A premium dark tactical AI alert system.
A calm crisis intelligence interface.
A radar-inspired command layer for creating Crisis Packets.
```

It should **not** look like:

```txt
- a generic SaaS dashboard
- a public-sector form
- a panic alarm app
- a toy emergency app
- a cyberpunk game UI
```

## Visual keywords

```txt
dark
premium
tactical
radar
signal
calm
structured
AI-assisted
human-controlled
high-contrast
low-noise
```

---

# 3. Recommended Layout Upgrade

## Current layout problem

The sidebar is large and the main content is too contained. The screen feels like a dashboard inside a void.

## New layout direction

Use a stronger 2-column command layout:

```txt
┌─────────────────────────────────────────────────────────────┐
│ Top bar: SignalPack / Gemma 4 status / Local-Cloud / Sign in │
├──────────────┬──────────────────────────────────────────────┤
│ Sidebar      │ Hero Crisis Packet panel                     │
│              │ Quick Capture strip                          │
│              │ Gemma 4 analysis / Emergency Profile         │
│              │ Incident Map + Packet History                │
└──────────────┴──────────────────────────────────────────────┘
```

## Desktop proportions

```txt
Sidebar: 260–280px
Main content max width: 1080–1180px
Main content padding: 32–40px
Hero panel height: 240–300px
Quick Capture cards: 3 equal cards
Map height: 260–320px
```

## Sidebar refinement

Make sidebar more compact and premium:

```txt
Logo block:
- app icon glow
- SignalPack wordmark
- small status chip: Local-first / Gemma Ready

Navigation:
- active item should use cyan/blue glow, not flat gray
- icons should be thin-line and consistent
- section labels should be smaller and more muted

Footer:
- Settings
- Built by pixek.xyz, very subtle
```

---

# 4. Hero Section Redesign

The current hero says:

```txt
What needs to be sent?
```

This is good, but a little too functional. For the competition and product feel, make it more branded.

## Recommended hero copy

```txt
Turn chaos into a Crisis Packet.
```

Subcopy:

```txt
Capture the signal. Gemma 4 structures the critical details.
Review before sharing.
```

Alternative:

```txt
Create a Crisis Packet.
Capture text, photo, or voice. Gemma 4 structures what matters.
```

## Hero structure

```txt
Left:
- Crisis Packet label
- headline
- short explanation
- Start Alert CTA
- Rapid Packet CTA

Right:
- radar visual / signal flare ring
- live status chips:
  - Gemma 4 Ready
  - Local-first Active
  - Emergency Profile Ready
```

## CTA logic

Current:

```txt
START ALERT = blue
RAPID PACKET = red
```

Recommended:

```txt
START ALERT = blue/cyan/purple gradient
RAPID PACKET = amber/orange, not red
```

Reason: red implies danger/destructive. Rapid Packet is urgent but not destructive.

---

# 5. Final Color Palette

```css
/* SIGNALPACK FINAL COLOR PALETTE */

:root {
  --void: #040404;
  --black: #07080B;
  --surface: #0A0D12;
  --surface-2: #101622;
  --surface-3: #151B28;

  --cyan: #00E6FF;
  --blue: #2563FF;
  --purple: #9059F3;
  --orange: #FF9A1F;

  --text-main: #F2F2F1;
  --text-soft: #C8CBD2;
  --text-muted: #8A8F98;
  --text-faint: #5F6672;

  --success: #35D58A;
  --info: #00E6FF;
  --warning: #FF9A1F;
  --danger: #FF4D5E;

  --stroke: rgba(255,255,255,0.08);
  --stroke-soft: rgba(255,255,255,0.05);
  --glass: rgba(12,16,24,0.72);
}
```

## Color usage

```txt
Cyan:
- signal detection
- live status
- focus states
- location accuracy

Blue:
- primary actions
- active navigation
- confirmed interaction

Purple:
- Gemma 4
- AI intelligence
- analysis states

Orange:
- urgency
- missing details
- Rapid Packet
- needs attention

Red:
- critical danger only
- destructive actions only
```

---

# 6. Gradients and Glow

```css
--gradient-primary:
  linear-gradient(135deg, #00E6FF 0%, #2563FF 45%, #9059F3 100%);

--gradient-signal:
  linear-gradient(120deg, #00E6FF 0%, #2563FF 45%, #9059F3 78%, #FF9A1F 100%);

--gradient-alert:
  linear-gradient(135deg, #FF9A1F 0%, #FF4D5E 100%);

--gradient-ai:
  radial-gradient(circle at 30% 20%, rgba(144,89,243,0.35), transparent 45%),
  radial-gradient(circle at 80% 50%, rgba(0,230,255,0.22), transparent 50%);
```

Use glow sparingly:

```txt
Good:
- hero radar core
- active CTA
- Gemma 4 analysis loading state
- selected nav item
- packet ready state

Bad:
- glowing every card
- glowing every icon
- high saturation everywhere
```

---

# 7. Typography

## Fonts

```txt
Main font:
General Sans

Data font:
JetBrains Mono
```

## Usage

```txt
General Sans:
- navigation
- cards
- headings
- body copy
- buttons

JetBrains Mono:
- packet IDs
- timestamps
- coordinates
- model names
- local/cloud status
- confidence score
```

## Recommended type scale

```css
--display: 48px / 56px;
--h1: 36px / 44px;
--h2: 28px / 36px;
--h3: 22px / 30px;

--body-lg: 17px / 26px;
--body: 15px / 24px;
--body-sm: 13px / 20px;

--label: 12px / 16px;
--mono: 12px / 16px;
--mono-xs: 11px / 14px;
```

---

# 8. Component Recommendations

## Panels

```css
.signal-panel {
  background: rgba(10, 13, 18, 0.78);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  box-shadow:
    0 18px 50px rgba(0,0,0,0.45),
    inset 0 1px 0 rgba(255,255,255,0.04);
}
```

## Cards

```css
.signal-card {
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.045),
    rgba(255,255,255,0.018)
  );
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
}
```

## Primary button

```css
.primary-button {
  background: linear-gradient(135deg, #00E6FF 0%, #2563FF 45%, #9059F3 100%);
  color: #F2F2F1;
  border: none;
  border-radius: 14px;
  box-shadow: 0 0 28px rgba(37,99,255,0.22);
}
```

## Rapid Packet button

```css
.rapid-button {
  background: linear-gradient(135deg, #FF9A1F 0%, #FF6B3D 100%);
  color: #0A0D12;
  border: none;
  border-radius: 14px;
  box-shadow: 0 0 26px rgba(255,154,31,0.18);
}
```

## Secondary button

```css
.secondary-button {
  background: rgba(255,255,255,0.035);
  color: #F2F2F1;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
}
```

## Inputs

```css
.input {
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.08);
  color: #F2F2F1;
  border-radius: 14px;
}

.input:focus {
  border-color: rgba(0,230,255,0.55);
  box-shadow: 0 0 0 3px rgba(0,230,255,0.12);
}
```

---

# 9. Dashboard Content Hierarchy

## Recommended home screen order

```txt
1. Top status bar
   - SignalPack
   - Gemma 4 ready
   - Local-first / Cloud
   - Sign in

2. Hero Crisis Packet panel
   - headline
   - CTAs
   - radar visual
   - readiness chips

3. Quick Capture
   - Photo
   - Audio
   - Message
   Each card should have label + one-line helper

4. Review & Prepare
   - Packet History
   - Safety Guide
   - Guided Help
   - Demo Case

5. Incident Map + Recent Packets
   - map should not be just decorative
   - show last packet / empty state / add demo packet
```

## Quick Capture cards

Current quick capture cards feel too empty. Upgrade them:

```txt
Photo
"Upload a scene or hazard."

Audio
"Record a short voice note."

Message
"Describe what happened."
```

Use icons larger, with a tiny accent glow.

---

# 10. Incident Map Recommendation

The map currently looks atmospheric, but too passive.

Add a header row:

```txt
Incident Map
Local packets only
0 active / 1 draft / 3 saved
```

Add an empty state if no reports exist:

```txt
No packets on the map yet.
Create your first Crisis Packet to pin it here.
```

Add filters:

```txt
All
High
Draft
Shared
```

For demo, make sure one pin appears.

---

# 11. Gemma 4 Visibility

Because this is a Gemma competition, Gemma 4 must be more visible.

Add a status module:

```txt
Gemma 4 Intelligence Layer
Status: Ready
Mode: Cloud / Edge
Model: gemma-4-26b-a4b-it
```

But avoid making the UI too developer-only. Use readable labels:

```txt
Gemma 4 ready
Structured packet generation active
```

On AI screen, show:

```txt
Gemma 4 Analysis
- incident type
- detected risks
- missing critical details
- confidence
- source inputs used
```

---

# 12. UX Copy Recommendations

## Current headline

```txt
What needs to be sent?
```

Good, but less branded.

## Better options

```txt
Turn chaos into a Crisis Packet.
```

```txt
Create a Crisis Packet.
```

```txt
Capture the signal.
Gemma 4 structures the rest.
```

## Main CTA

```txt
Start Alert
```

## Rapid mode

```txt
Rapid Packet
```

## Quick capture title

```txt
Quick Capture
```

## Review section

```txt
Review & Prepare
```

## Packet ready

```txt
Crisis Packet ready.
Review before sharing.
```

## Safety note

```txt
If someone is in immediate danger, contact emergency services first.
```

---

# 13. Prompt for UI Redesign

Use this prompt in a design/image tool or as a brief for a coding agent.

```txt
Redesign the SignalPack dashboard as a premium dark tactical AI emergency alert interface.

Use a black / deep navy background with subtle radar glows, low-opacity grid lines, and glassmorphic panels. The product should feel like a calm crisis intelligence system, not a panic alarm app.

Core product message:
"Turn chaos into a Crisis Packet."

The dashboard should have:
- a compact premium left sidebar with the SignalPack radar icon, navigation, and local/cloud status;
- a top status bar showing Gemma 4 ready, local-first mode, and sign-in;
- a strong hero panel for Crisis Packet creation;
- two primary actions: Start Alert and Rapid Packet;
- Start Alert should use a cyan/blue/purple gradient;
- Rapid Packet should use warm amber/orange, not red;
- a radar/signal visual on the right side of the hero panel;
- Quick Capture cards for Photo, Audio, and Message, each with a short helper line;
- a Review & Prepare section with History, Safety Guide, Guided Help, and Demo Case;
- an Incident Map panel that feels tactical but remains readable;
- a recent packets / status strip for saved or draft packets;
- clear Gemma 4 presence as the intelligence layer.

Use this palette:
#040404, #07080B, #0A0D12, #101622, #00E6FF, #2563FF, #9059F3, #FF9A1F, #F2F2F1, #8A8F98.

Typography:
General Sans for UI and headings, JetBrains Mono for metadata.

UI style:
high contrast, premium, restrained glow, thin borders, modular cards, no excessive neon, no childish emergency icons, no government-form feeling.

Main UX principle:
The user should understand in 2 seconds how to create a Crisis Packet.
```

---

# 14. Prompt for Vibe Coding / Implementation

Use this with a coding assistant.

```txt
Improve the current SignalPack dashboard UI without changing core functionality.

Current app:
- dark dashboard
- left sidebar
- main Crisis Packet hero
- Start Alert and Rapid Packet buttons
- Quick Capture cards
- Review & Prepare cards
- Incident Map
- Gemma 4 model status

Design goal:
Make it feel like a premium dark tactical AI alert system.

Tasks:
1. Reduce empty darkness by increasing main content width and improving spacing.
2. Make the hero Crisis Packet panel the visual anchor.
3. Replace flat cards with glass panels using subtle borders, inner highlight, and soft shadows.
4. Change Rapid Packet from red to amber/orange urgency.
5. Add a radar/signal decorative visual in the hero panel.
6. Make Gemma 4 status visible but user-friendly.
7. Add helper text to Quick Capture cards.
8. Improve active sidebar state with cyan/blue glow instead of flat gray.
9. Improve map panel header and empty state.
10. Use General Sans for UI and JetBrains Mono for metadata.
11. Keep the color palette:
   #040404, #07080B, #0A0D12, #101622, #00E6FF, #2563FF, #9059F3, #FF9A1F, #F2F2F1, #8A8F98.
12. Preserve all existing flows and functionality.

Core copy:
Headline: "Turn chaos into a Crisis Packet."
Subcopy: "Capture the signal. Gemma 4 structures the critical details. Review before sharing."
Primary CTA: "Start Alert"
Secondary CTA: "Rapid Packet"
```

---

# 15. Design Do / Don’t

## Do

```txt
Use dark surfaces with readable contrast.
Make Start Alert unmistakable.
Make Crisis Packet the core object.
Show Gemma 4 clearly.
Use orange only for urgency.
Show review-before-sharing.
Add helper text to functional cards.
Use fewer, stronger visual accents.
```

## Don’t

```txt
Do not overuse red.
Do not make every element glow.
Do not hide the main CTA.
Do not present the app as a generic dashboard.
Do not let the map dominate if it has no pins.
Do not show technical model names as the main user-facing message.
Do not clutter the dashboard with every feature at equal importance.
```

---

# 16. Final App Navigation Recommendation

Use:

```txt
Dashboard
Packet History
Emergency Profile
Readiness Toolkit
Safety Guide
Guided Help
Settings
```

Alternative more productized nav:

```txt
Alert
Packets
Map
Guide
Profile
Settings
```

Best for current app:

```txt
Keep current navigation, but make Dashboard feel like Alert Center.
```

---

# 17. Final Competition-Ready Product Message

```txt
SignalPack is an AI-powered emergency alert and readiness hub.

It helps users prepare before a crisis, capture urgent signals during one,
and generate structured Crisis Packets from chaotic text, photos, and voice notes.

Gemma 4 powers the intelligence layer:
it understands the situation, asks for missing critical details,
and creates clear, reviewable reports.

The result is faster, calmer, more trustworthy emergency communication.
```

---

# 18. Final Checklist for UI Polish

```txt
[ ] Increase main content width
[ ] Improve hero panel hierarchy
[ ] Change Rapid Packet from red to orange/amber
[ ] Add radar visual to hero
[ ] Add helper text to Quick Capture cards
[ ] Make active sidebar state cyan/blue instead of gray
[ ] Improve contrast of labels and secondary text
[ ] Add Gemma 4 ready chip
[ ] Add Local-first mode chip
[ ] Add Emergency Profile ready chip
[ ] Make map panel more useful with header/status/empty state
[ ] Make Crisis Packet concept visible above the fold
[ ] Reduce technical jargon in the main UI
[ ] Keep model name in metadata only
[ ] Use review-before-sharing copy
[ ] Keep all flows intact
```

---

# 19. One-Screen Target

The final dashboard should communicate this instantly:

```txt
This is SignalPack.
I can start an emergency alert now.
Gemma 4 will structure my input.
A Crisis Packet will be created.
I can review before sharing.
The app works local-first.
```

If the screen communicates those six things, it is ready for the competition.
