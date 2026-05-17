# Sync Engine (`/src/engine/sync`)

Responsible for syncing logic back to Firebase or handling offline LocalStorage queues.

## Agentic Guidelines

1. Data comes in from the components.
2. If online: send immediately.
3. If offline: cache and set up a background listener so it pushes when connectivity is restored.
