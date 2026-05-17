# SignalPack Components

This directory contains the React components that make up the SignalPack user interface. 

## Design System & Architecture

- **UI Framework:** We use Tailwind CSS tightly integrated. We avoid deeply nested plain `<div>` elements and prefer building modular UI out of small composable functions (buttons, inputs, cards).
- **Aesthetic:** We use a tactical UI design system. Colors include `#0F1115` (`bg-cloud`), `#161A22` (`bg-surface`), Accent Blue (`text-blue`), Critical Red (`text-critical`).
- **File Size Constraint:** A strict rule of `~250 LOC` maximum per file applies. Any component growing larger must be refactored into smaller, pure sub-components.
- **State Management:** These components should be predominantly "dumb", deriving their state via props or from the global Zustand store managed inside `/src/engine/state`.

## Core Guidelines for AI/Agentic Work

1. **No Mammoth Files:** When creating a new feature, do not bolt endless logic onto `Home.tsx` or `App.tsx`. 
2. **Icons:** Always use `lucide-react`.
3. **Typography:** We use `Inter`, `Space Grotesk`, and `JetBrains Mono`. Keep it clean, semantic, and tactical.
4. **PWA First:** Buttons and touch areas must be mobile-finger-friendly (at least minimum tap target size).
