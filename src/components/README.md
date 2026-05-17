# SignalPack Components

This directory contains the React components that make up the SignalPack user interface. 

## Design System & Architecture

- **UI Framework:** We use Tailwind CSS tightly integrated. We avoid deeply nested plain `<div>` elements and prefer building modular UI out of small composable functions (buttons, inputs, cards).
- **Aesthetic:** We use the premium SignalPack tactical UI direction: near-black canvas, glass panels, cyan/blue signal glow, violet Gemma layer, amber urgency, and restrained red only for true critical states.
- **File Size Constraint:** A strict rule of `~250 LOC` maximum per file applies. Any component growing larger must be refactored into smaller, pure sub-components.
- **State Management:** These components should be predominantly "dumb", deriving their state via props or from the global Zustand store managed inside `/src/engine/state`.

## Core Guidelines for AI/Agentic Work

1. **No Mammoth Files:** When creating a new feature, do not bolt endless logic onto `Home.tsx` or `App.tsx`. 
2. **Icons:** Always use `lucide-react`.
3. **Typography:** Use General Sans for UI and JetBrains Mono for metadata/trace labels. Keep it clean, semantic, and tactical.
4. **PWA First:** Buttons and touch areas must be mobile-finger-friendly (at least minimum tap target size).
5. **Content Fit:** Mobile surfaces must avoid horizontal overflow. Prefer `min-w-0`, truncation for metadata, wrapping for prose, and fixed-size icon buttons.
6. **Functional Buttons:** Icon-only buttons need `aria-label` or visible text. Cards that navigate must be semantic buttons.
