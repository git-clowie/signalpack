# SignalPack Delivery Checklist

Last verified: May 17, 2026.

## App

- [x] Dashboard works on desktop and mobile
- [x] Settings content fits on mobile
- [x] Ask Gemma chat responds through the OpenRouter/Gemma 4 path
- [x] Start Alert and Rapid Packet open the capture flow
- [x] Demo packet opens the final Crisis Packet output
- [x] Packet output exposes AI trace, safety sources, actions, report, share, and export controls
- [x] Mobile menu fits and includes Dashboard, History, Profile, Toolkit, Safety, Ask Gemma, Settings, About
- [x] Footer no longer overlays desktop CTA/buttons
- [x] Hash links are available for `#/dashboard`, `#/capture`, `#/ask-gemma`, `#/history`, `#/safety`, `#/profile`, `#/toolkit`, `#/settings`, `#/demo`
- [x] PWA build succeeds

## AI / Gemma 4

- [x] Hosted provider: OpenRouter
- [x] Default hosted model route documented
- [x] Deploy-time demo key is masked in Settings
- [x] User-provided key can override demo key locally
- [x] Deterministic fallback is marked when provider routing fails
- [x] Crisis Packet includes model provider, model name, AI trace, fallback flag, safety sources
- [x] Optional local Ollama provider is selectable in Settings
- [x] Local Gemma instructions are honest: the PWA calls a user-owned local runtime; it does not pretend to install native models automatically

## Export / Share

- [x] Copy helper works
- [x] WhatsApp deep link helper works
- [x] Email compose helper works
- [x] Native share helper is wired for supported mobile browsers
- [x] Markdown export helper generates browser Blob download
- [x] JSON export helper generates browser Blob download
- [x] PDF path uses browser print/save flow

Note: real file downloads should be manually clicked in Chrome/Safari during final recording because the Codex in-app browser does not expose a native download manager.

## Repo

- [x] Public README updated with demo, architecture, Gemma 4 layer, setup, local Gemma path, share/export, QA, and presentation links
- [x] Presentation kit added
- [x] Functional QA notes added
- [x] Logo asset instructions updated
- [x] Secret grep for OpenRouter and Google key patterns is clean
- [x] `npm run lint` passed
- [x] `npm run build` passed
- [x] `npm run build:signalpack` passed
- [x] Production preview works at `/signalpack/`
- [x] `git diff --check` passed

## Presentation

- [x] Final pitch spine: `docs/FINAL_PRESENTATION.md`
- [x] Editable PowerPoint deck: `docs/presentation/SignalPack_Gemma_4_Good_Hackathon.pptx`
- [x] Rendered contact sheet: `docs/presentation/SignalPack_contact_sheet.png`
- [x] Real product screenshots: `docs/media/`
- [x] 3-minute video script included
- [x] Kaggle write-up short draft included

## Final Human Steps

- [ ] Deploy current build to `https://pixek.xyz/signalpack`
- [ ] Build deploy artifact with `npm run build:signalpack`
- [ ] Confirm deployed demo has restricted OpenRouter demo key configured
- [ ] If using Firebase sync on demo, add `pixek.xyz` as an authorized Firebase Auth domain and deploy with `VITE_FIREBASE_*` values
- [ ] If testing local Gemma, install/run Ollama locally and allow the deployed origin with `OLLAMA_ORIGINS`
- [ ] Open deployed app in Chrome/Safari and manually click `Export .MD`, `JSON Dump`, and `Save PDF`
- [ ] Record 3-minute demo video using `docs/FINAL_PRESENTATION.md`
- [ ] Upload repo, demo URL, deck/video/write-up to Kaggle submission
