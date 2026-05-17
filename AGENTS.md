# General Agent Guidelines

- Use `src/components/ui` rather than direct `<div>`s when standard components are available.
- Do NOT generate mammoth files! Components should be split if they exceed 250 lines. Keep "clean engines and functions". 
- Tailwind is fully configured, use standard Tailwind utilities `bg-cloud`, `text-navy` and so on.
- The project is cross-platform (PWA ready, Android ready via Capacitor principles, although we don't build APKs directly here).
- Keep a responsive layout. The app is mobile-first but MUST look like a website (a clean web app dashboard) on desktop sizes.
- Rely on LocalStorage for non-logged-in users, Firebase Firestore for authenticated users.

# PWA and Android
- `manifest.json` and basic setup exist. Android builds use `@capacitor/core` conventions if we proceed further.

# State Management
- `App.tsx` coordinates `AppState`.

# Styling Theme
- Background: `#0F1115` (`bg-cloud`)
- Surface: `#161A22` (`bg-surface`)
- Accent Blue: `#3B82F6` (`text-blue`, `border-blue`)
- Critical: `#EF4444` (`text-critical`, `bg-critical`)
