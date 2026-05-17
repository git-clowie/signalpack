# AI Engine (`/src/engine/ai`)

This directory is responsible for routing SignalPack's **Gemma 4** calls.

Primary hosted provider: **OpenRouter** using the browser-saved key from Settings, or a deploy-time demo key when the hosted build provides one.

Local Gemma runtimes are intentionally user-owned extensions; the public PWA ships with OpenRouter as the functional path.

The OpenRouter path is defensive by design:

- Settings masks a deploy-time demo key and lets users override it with their own key.
- The app records `model_provider`, `model_name`, `ai_trace`, and `fallback_used` on packet output.
- Provider failures and upstream rate limits should produce a marked deterministic fallback, never silent fake AI output.
- The Settings connection test uses the same provider routing path as the product flow.

## Guiding Principles for Agentic Work

1. **Isolation from UI:** This layer must NOT render UI. It takes raw text/media, and returns structured data (e.g. JSON matching `CrisisPacket`).
2. **Graceful Fallbacks:** If the selected provider is unavailable, return a marked deterministic safety fallback. Never pretend fallback output came from a model.
3. **Pointers for Modification:** Most prompting occurs in `analyzeIncident` and `generatePacket`. When editing prompts, be mindful of token limits and prompt injection. 

## Runtime Settings

- `signalpack_ai_provider`: `openrouter`
- `signalpack_openrouter_api_key`: local-only API key
- `signalpack_openrouter_model`: default `google/gemma-4-31b-it:free@preset/signalpack`
- `VITE_SIGNALPACK_DEMO_OPENROUTER_KEY`: optional hosted-demo key injected by deployment, never committed

## Export / Share Contract

The AI layer must produce enough structured packet data for:

- quick share text
- structured Markdown export
- JSON export
- visible AI trace and safety-source metadata
