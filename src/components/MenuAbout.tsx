import React from 'react';
import { Button } from '@/src/components/ui';
import { Cpu, Globe, HeartPulse, Play, ShieldAlert } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { Logo } from './Logo';

export function MenuAbout({
  onClose,
  onShowTutorial,
}: {
  onClose: () => void;
  onShowTutorial: () => void;
}) {
  const { logoShape } = useSettings();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-8">
      <div className="text-center pt-2">
        <Logo shape={logoShape} size="lg" containerClassName="mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">SignalPack</h2>
        <p className="text-xs text-slate font-mono uppercase tracking-widest mt-2 border-t border-mist/30 pt-2 inline-block">App Version 1.0.0</p>
      </div>

      <div className="grid gap-4">
        <div className="p-5 rounded-2xl bg-critical/5 border border-critical/20 flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-12 h-12 shrink-0 rounded-full bg-critical/10 flex justify-center items-center">
            <HeartPulse className="w-6 h-6 text-critical" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">The Problem</h3>
            <p className="text-xs text-slate leading-relaxed">During emergencies, people are stressed and disoriented. Dispatchers lose time extracting basics: location, injuries, hazards, and access.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-cyan-brand/5 border border-cyan-brand/20 flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-12 h-12 shrink-0 rounded-full bg-cyan-brand/10 flex justify-center items-center">
            <ShieldAlert className="w-6 h-6 text-cyan-brand" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">The Solution</h3>
            <p className="text-xs text-slate leading-relaxed">SignalPack converts messy text, photos, voice notes, GPS, and Emergency Profile context into a responder-ready Crisis Packet.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-blue/5 border border-blue/20 flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-12 h-12 shrink-0 rounded-full bg-blue/10 flex justify-center items-center">
            <Cpu className="w-6 h-6 text-blue" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">AI Intelligence</h3>
            <p className="text-xs text-slate leading-relaxed">Gemma 4 runs through OpenRouter for the hosted app, with a clean provider layer for future user-owned on-device inference.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-12 h-12 shrink-0 rounded-full bg-yellow-500/10 flex justify-center items-center">
            <Globe className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Readiness Toolkit</h3>
            <p className="text-xs text-slate leading-relaxed">The PWA includes offline safety guides, SOS tools, CPR timing support, history, and exportable reports.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button onClick={() => { onClose(); onShowTutorial(); }} variant="secondary" className="px-8 rounded-full border border-mist shadow-xl bg-surface hover:bg-mist/30">
          <Play className="w-4 h-4 mr-2 text-cyan-brand" />
          Restart Interactive Tutorial
        </Button>
      </div>
    </div>
  );
}
