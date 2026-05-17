import React from 'react';
import { Button, Card } from '@/src/components/ui';
import { AlertTriangle, CheckCircle2, Cloud, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { DEFAULT_OPENROUTER_MODEL } from '../engine/ai/settings';
import { useSettings } from '../SettingsContext';

export function AIProviderSettings({ setIsLocalMode }: { setIsLocalMode: (value: boolean) => void }) {
  const [testState, setTestState] = React.useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [testMessage, setTestMessage] = React.useState('');
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

  const handleTestConnection = async () => {
    if (!openRouterApiKey.trim()) {
      setTestState('error');
      setTestMessage('Add an OpenRouter key first.');
      return;
    }

    setTestState('testing');
    setTestMessage('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterApiKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SignalPack',
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            { role: 'system', content: 'Reply with exactly: SignalPack Gemma ready' },
            { role: 'user', content: 'Connection test' },
          ],
          temperature: 0,
          max_tokens: 12,
        }),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(detail || `OpenRouter returned ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || 'Connected.';
      setTestState('ok');
      setTestMessage(reply.slice(0, 80));
    } catch (error: any) {
      setTestState('error');
      setTestMessage((error?.message || 'Connection failed.').slice(0, 140));
    }
  };

  return (
    <section>
      <h3 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3">Gemma 4 Engine</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-blue/25 bg-blue/5 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-blue">
            <Cloud className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-blue">OpenRouter Hosted Gemma 4</p>
            <p className="mt-0.5 truncate text-[10px] font-mono uppercase tracking-widest text-slate">{openRouterModel}</p>
          </div>
          <ShieldCheck className="h-4 w-4 shrink-0 text-blue" />
        </div>

        <Card className="space-y-3 rounded-xl border-mist/40 bg-cloud/40 p-4">
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
          <label className="block border-t border-mist/30 pt-3">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate">Gemma 4 Model</span>
            <input
              value={openRouterModel}
              onChange={(event) => setOpenRouterModel(event.target.value.trim() || DEFAULT_OPENROUTER_MODEL)}
              className="w-full bg-surface border border-mist/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue"
            />
          </label>
          <p className="text-[11px] leading-relaxed text-slate">
            Key is saved only in this browser. The public repo ships without demo secrets.
          </p>
          <div className="flex flex-col gap-2 border-t border-mist/30 pt-3">
            <Button
              type="button"
              size="sm"
              variant={testState === 'ok' ? 'secondary' : 'outline'}
              onClick={handleTestConnection}
              disabled={testState === 'testing'}
              className="h-9 justify-center rounded-lg"
            >
              {testState === 'testing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cloud className="mr-2 h-4 w-4" />}
              Test Gemma Connection
            </Button>
            {testState !== 'idle' && (
              <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${testState === 'ok' ? 'border-success/30 bg-success/5 text-success' : testState === 'error' ? 'border-warning/30 bg-warning/5 text-warning' : 'border-mist/40 bg-surface text-slate'}`}>
                {testState === 'ok' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span className="break-words leading-relaxed">{testState === 'testing' ? 'Checking OpenRouter...' : testMessage}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
