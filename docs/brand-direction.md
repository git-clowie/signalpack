# SignalPack Brand Direction

## Visual Source

The current UI follows the provided **Signal Flare - Variant 2** board.
The extended competition visual guide lives in `docs/SignalPack_Visual_Concept_Competition_Focus.md`.

Core signals:

- bright central intelligence node;
- radar/fan arcs for awareness and coverage;
- cyan/blue/violet intelligence gradient;
- orange alert accent used sparingly for urgency;
- dark tactical surface with thin borders and controlled glow.

Production asset:

- `public/brand/signalpack-flare.svg`
- React component: `src/components/Logo.tsx`
- Wordmark component: `src/components/BrandWordmark.tsx`

## Product Narrative

From `SignalPack_Competition_Presentation_Pack.md`:

```txt
Prepare -> Alert -> Understand -> Act
```

UI naming should reinforce the competition story:

- Start Alert
- Rapid Packet Mode
- Quick Capture
- Gemma 4 Analysis
- Critical Details
- Crisis Packet
- Emergency Profile
- Packet History
- Incident Map
- Readiness Toolkit
- Guided Help

## Pitch Anchor

```txt
SignalPack turns emergency chaos into trusted alerts and structured Crisis Packets, powered by Gemma 4.
```

The product should not feel like a generic emergency checklist. It should feel like a crisis communication system centered on one hero object: the **Crisis Packet**.

## AI Focus

SignalPack's live PWA provider story is intentionally simple:

- OpenRouter hosted Gemma 4 for the functional demo;
- deterministic fallback clearly marked when unavailable;
- user-owned on-device Gemma as an advanced extension path, not a bundled local-server product mode.
