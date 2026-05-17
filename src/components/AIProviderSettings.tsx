import React from 'react';
import { Card } from '@/src/components/ui';
import { Cloud, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { DEFAULT_OPENROUTER_MODEL } from '../engine/ai/settings';
import { useSettings } from '../SettingsContext';

export function AIProviderSettings({ setIsLocalMode }: { setIsLocalMode: (value: boolean) => void }) {
  const {
    openRouterApiKey,
    setOpenRouterApiKey,
    openRouterModel,
    setOpenRouterModel,
    setAiProvider,
  } = useSettings();

  React.useEffect(() => {
    setAiProvider('openrouter');
    setIsLocalMode(!navigator.onLine);
  }, [setAiProvider, setIsLocalMode]);

  const maskedKey = openRouterApiKey
    ? `${openRouterApiKey.slice(0, 8)}...${openRouterApiKey.slice(-4)}`
    : 'No key saved';

  return (
    <section>
      <h3 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3">Gemma 4 Engine</h3>
      <div className="space-y-3">
        <div className="w-full text-left p-4 rounded-xl border bg-blue/10 border-blue transition-colors flex items-start gap-4">
          <div className="mt-0.5 text-blue">
            <Cloud className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-blue">OpenRouter Hosted Gemma 4</p>
            <p className="text-xs text-slate mt-1">Primary functional path for the PWA. Your key stays in this browser.</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-blue" />
        </div>

        <Card className="p-4 bg-cloud/40 border-mist/40 rounded-xl space-y-3">
          <label className="block">
            <span className="text-[10px] text-slate uppercase font-bold tracking-widest flex items-center gap-2 mb-2">
              <KeyRound className="w-3.5 h-3.5" /> OpenRouter API Key
            </span>
            <input
              type="password"
              value={openRouterApiKey}
              onChange={(event) => setOpenRouterApiKey(event.target.value.trim())}
              placeholder="sk-or-v1..."
              className="w-full bg-surface border border-mist/50 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate/50 focus:outline-none focus:border-blue"
            />
          </label>
          <div className="text-[10px] font-mono text-slate uppercase tracking-widest">
            Status: <span className={openRouterApiKey ? 'text-success' : 'text-warning'}>{maskedKey}</span>
          </div>
          <label className="block">
            <span className="text-[10px] text-slate uppercase font-bold tracking-widest mb-2 block">Gemma 4 Model</span>
            <input
              value={openRouterModel}
              onChange={(event) => setOpenRouterModel(event.target.value.trim() || DEFAULT_OPENROUTER_MODEL)}
              className="w-full bg-surface border border-mist/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue"
            />
          </label>
        </Card>

        <Card className="p-4 bg-surface/60 border-cyan-brand/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-brand mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white">Gemma local remains user-owned</p>
              <p className="text-xs text-slate mt-1 leading-relaxed">
                This public PWA ships with OpenRouter for the live demo. Advanced users can adapt the AI provider layer for their own on-device Gemma runtime without exposing keys in the repo.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
