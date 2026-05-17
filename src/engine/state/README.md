# State Management (`/src/engine/state`)

Contains the Zustand stores serving as the Single Source of Truth for the React app.

## Agentic Guidelines

1. **Keep it flat:** Avoid heavily nested store objects. Flat maps or slices are preferred for simpler updates.
2. **Limit lines of code:** If a single store gets past 200-250 lines, split it into modular slices.
3. **No heavy logic here:** Use `state` to persist fields, not to run heavy logic or async AI fetching. Async processing should happen in the components calling out to `/engine/ai`, and once resolved, they update state via `useAppStore.getState().setPacket(...)`.
