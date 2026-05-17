import React, { useState } from 'react';
import { Card, Button } from '@/src/components/ui';
import { ShieldAlert, Image, Mic, Send, ShieldCheck, ArrowRight, Bot, Cloud, Database, Download, KeyRound, Server, X } from 'lucide-react';

export function TutorialOverlay({
  onClose
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'SignalPack in one minute',
      description: 'Capture messy emergency signals and turn them into a reviewable Crisis Packet powered by Gemma 4.',
      icon: <ShieldAlert className="w-12 h-12 text-critical" />,
      color: 'text-critical',
      bg: 'bg-critical/10',
      bullets: ['Use it to organize information, not to replace emergency services.', 'The user reviews every packet before sharing.'],
    },
    {
      title: '1. Capture quickly',
      description: 'In an emergency, use a photo, short text, or voice note to capture what is happening.',
      icon: <div className="flex gap-4"><Image className="w-8 h-8 text-blue" /><Mic className="w-8 h-8 text-blue" /></div>,
      color: 'text-blue',
      bg: 'bg-blue/10',
      bullets: ['Start Alert gives you the normal guided flow.', 'Rapid Packet skips ahead for urgent situations.'],
    },
    {
      title: '2. Gemma 4 structures it',
      description: 'Gemma 4 extracts incident type, hazards, people at risk, uncertainty, and the critical details still missing.',
      icon: <Bot className="w-12 h-12 text-cyan-brand" />,
      color: 'text-cyan-brand',
      bg: 'bg-cyan-brand/10',
      bullets: ['Ask Gemma is available as a short safety chat.', 'Clarification questions appear when details are missing.'],
    },
    {
      title: '3. Review the Crisis Packet',
      description: 'You get a structured packet with a shareable message, immediate actions, and severity assessment.',
      icon: <ShieldCheck className="w-12 h-12 text-white" />,
      color: 'text-white',
      bg: 'bg-white/10',
      bullets: ['Check severity, location, risks, actions, safety sources, and AI trace.', 'Use Full Screen for clean review or presentation.'],
    },
    {
      title: '4. Share or export',
      description: 'When the packet is ready, copy the short message, open WhatsApp/email, use native share, print PDF, or export Markdown/JSON.',
      icon: <div className="flex gap-4"><Send className="w-8 h-8 text-flare-orange" /><Download className="w-8 h-8 text-flare-orange" /></div>,
      color: 'text-flare-orange',
      bg: 'bg-flare-orange/10',
      bullets: ['Export happens in the browser; no server is needed.', 'History is saved local-first.'],
    },
    {
      title: 'AI provider settings',
      description: 'Hosted OpenRouter is the default demo route. You can paste your own key, or advanced users can choose Local Ollama.',
      icon: <div className="flex gap-4"><Cloud className="w-8 h-8 text-blue" /><Server className="w-8 h-8 text-cyan-brand" /></div>,
      color: 'text-blue',
      bg: 'bg-blue/10',
      bullets: ['The demo key is masked; public repo users bring their own key.', 'A PWA can call Ollama, but cannot install or start it automatically.'],
    },
    {
      title: 'Data and sync',
      description: 'SignalPack works without login. Optional Firebase sign-in can sync packet history when configured.',
      icon: <div className="flex gap-4"><Database className="w-8 h-8 text-cyan-brand" /><KeyRound className="w-8 h-8 text-slate" /></div>,
      color: 'text-cyan-brand',
      bg: 'bg-cyan-brand/10',
      bullets: ['Emergency Profile and local history stay on this device by default.', 'Cloud sync appears only when Firebase is configured.'],
    },
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md animate-in fade-in duration-300 sm:p-4">
      <Card className="flex max-h-[min(43rem,calc(100vh-1.5rem))] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-mist/60 bg-surface shadow-2xl">
        <div className={`relative flex h-36 items-center justify-center ${current.bg} sm:h-40`}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tutorial"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate transition-colors hover:bg-black/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          {current.icon}
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 text-center sm:p-6">
          <h2 className={`text-xl font-bold tracking-tight mb-3 ${current.color}`}>{current.title}</h2>
          <p className="text-slate text-sm font-medium leading-relaxed mb-8">{current.description}</p>
          <div className="mb-8 space-y-2 text-left">
            {current.bullets.map((bullet) => (
              <div key={bullet} className="rounded-xl border border-mist/35 bg-cloud/45 px-3 py-2 text-xs leading-relaxed text-slate">
                {bullet}
              </div>
            ))}
          </div>
          
          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-white' : 'bg-mist'}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="h-9 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest text-slate transition-colors hover:bg-mist/30 hover:text-white"
                >
                  Back
                </button>
              )}
              <Button onClick={() => {
                if (step < steps.length - 1) setStep(step + 1);
                else onClose();
              }} size="sm" className="h-9 rounded-lg">
                {step < steps.length - 1 ? (
                  <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                ) : (
                  'Get Started'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
