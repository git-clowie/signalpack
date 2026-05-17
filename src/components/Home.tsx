import React from 'react';
import { Button, Card } from '@/src/components/ui';
import { AlertTriangle, BookOpen, Bot, Camera, HeartPulse, History, KeyRound, MapPinned, MessageCircle, Mic, PlayCircle, RadioTower, Zap } from 'lucide-react';
import { useSettings } from '../SettingsContext';

import { vibrate } from '../lib/utils';
import { MapComponent } from './MapComponent';
import { useAppStore } from '../engine/state/useAppStore';

export function HomeScreen({ 
   onStartReport, 
   onViewHistory, 
   onViewSafety,
   onAskGemma,
   onViewMedical,
   onViewToolkit,
   onOpenDemo,
   isLocalMode 
}: { 
   onStartReport: (isPanic?: boolean) => void, 
   onViewHistory: (packet?: any) => void,
   onViewSafety: () => void,
   onAskGemma: () => void,
   onViewMedical: () => void,
   onViewToolkit: () => void,
   onOpenDemo: () => void,
   isLocalMode: boolean
}) {
  const { openRouterApiKey } = useSettings();
  const setAppState = useAppStore(state => state.setAppState);
  const missingOpenRouterKey = !openRouterApiKey.trim();
  const openRouterOffline = isLocalMode;
  const statusLabel = openRouterOffline ? 'Offline fallback' : 'Gemma 4 ready';
  const openSettings = () => {
    setAppState('settings');
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 pb-6 md:px-6 lg:px-8">
      <section className="pt-4 sm:pt-6">
        <Card className="glass-panel-strong hero-signal-panel relative overflow-hidden rounded-2xl p-5 pt-48 sm:p-6 sm:pt-56 md:min-h-[25rem] md:p-7 lg:p-8">
          <div className="absolute inset-x-4 top-0 h-px signal-sweep opacity-70" />
          <div className="pointer-events-none absolute right-0 top-0 h-56 w-full overflow-hidden opacity-95 sm:h-64 md:h-full md:w-[42%] lg:w-[44%]">
            <div className="radar-grid absolute right-1/2 top-2 h-52 w-52 translate-x-1/2 rounded-full opacity-70 sm:h-60 sm:w-60 md:right-10 md:top-1/2 md:h-72 md:w-72 md:-translate-y-1/2 md:translate-x-0 lg:right-14 lg:h-80 lg:w-80" />
            <div className="hero-logo-halo absolute right-1/2 top-4 h-48 w-48 translate-x-1/2 rounded-full sm:h-56 sm:w-56 md:right-12 md:top-1/2 md:h-64 md:w-64 md:-translate-y-1/2 md:translate-x-0 lg:right-16 lg:h-72 lg:w-72" />
            <picture className="absolute right-1/2 top-8 block h-36 w-36 translate-x-1/2 sm:h-44 sm:w-44 md:right-20 md:top-1/2 md:h-48 md:w-48 md:-translate-y-1/2 md:translate-x-0 lg:right-28 lg:h-52 lg:w-52">
              <source srcSet="/brand/signalpack-logo-loop.webp" type="image/webp" />
              <img src="/brand/signalpack-flare.png" alt="" className="h-full w-full rounded-full object-cover object-center opacity-95 mix-blend-screen" />
            </picture>
          </div>
          <div className="relative z-10 max-w-2xl md:max-w-[58%] lg:max-w-[62%]">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-cyan-brand">Crisis Packet</p>
            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Turn chaos into a Crisis Packet.
            </h1>
          </div>

          <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-[1fr_0.72fr] md:max-w-[58%] lg:max-w-[62%]">
            <Button size="lg" fullWidth onClick={() => { vibrate([50]); onStartReport(); }} className="primary-button h-14 rounded-xl text-sm">
              <RadioTower className="mr-2 h-5 w-5" /> Start Alert
            </Button>
            <Button size="lg" fullWidth onClick={() => { vibrate([100, 50, 100]); onStartReport(true); }} className="rapid-button h-14 rounded-xl text-xs">
              <Zap className="mr-2 h-4 w-4" /> Rapid Packet
            </Button>
          </div>

          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate md:max-w-[58%] lg:max-w-[62%]">
            {missingOpenRouterKey ? (
              <button onClick={openSettings} className="inline-flex items-center gap-1.5 rounded-lg border border-flare-orange/25 bg-flare-orange/5 px-2.5 py-1 text-flare-orange transition-colors hover:bg-flare-orange/10">
                <KeyRound className="h-3 w-3" />
                Add Gemma key
              </button>
            ) : (
              <span className="rounded-lg border border-cyan-brand/20 bg-cyan-brand/5 px-2.5 py-1 text-cyan-brand">{statusLabel}</span>
            )}
            <span className="rounded-lg border border-mist/40 bg-cloud/40 px-2.5 py-1">Review required</span>
            <span className="rounded-lg border border-mist/40 bg-cloud/40 px-2.5 py-1">Local-first history</span>
          </div>
          <p className="relative z-10 mt-5 max-w-xl text-sm leading-relaxed text-slate sm:text-base md:max-w-[58%] lg:max-w-[62%]">
            Capture the signal. Gemma 4 structures the critical details. Review before sharing.
          </p>
        </Card>

        {openRouterOffline && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-warning/25 bg-warning/5 px-3 py-2 text-left text-xs text-warning">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="leading-relaxed">
              Network is offline. Hosted Gemma 4 calls will use marked fallback until the connection returns.
            </span>
          </div>
        )}
      </section>

      <section className="mt-5">
        <h2 className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-slate">Quick Capture</h2>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <Card className="glass-panel group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-blue/50 hover:bg-blue/5 sm:h-32 sm:p-4" onClick={() => onStartReport()}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 text-blue transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Photo</span>
            <span className="mt-1 hidden text-[10px] leading-snug text-slate/80 sm:block">Upload a scene or hazard.</span>
          </Card>
          <Card className="glass-panel group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-flare-orange/50 hover:bg-flare-orange/5 sm:h-32 sm:p-4" onClick={() => onStartReport()}>
            <div className="relative mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-flare-orange/10 text-flare-orange transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
               <div className="absolute inset-0 bg-gradient-to-t from-flare-orange/20 to-transparent" />
               <Mic className="relative z-10 h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Audio</span>
            <span className="mt-1 hidden text-[10px] leading-snug text-slate/80 sm:block">Record a short voice note.</span>
          </Card>
          <Card className="glass-panel group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-blue/50 hover:bg-blue/5 sm:h-32 sm:p-4" onClick={onAskGemma}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 text-blue transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Message</span>
            <span className="mt-1 hidden text-[10px] leading-snug text-slate/80 sm:block">Chat with Gemma 4.</span>
          </Card>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-slate">Review & Prepare</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 sm:gap-3">
          <Card className="glass-panel group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-slate/80 sm:h-28 sm:p-4" onClick={onViewHistory}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-mist/30 text-slate transition-transform group-hover:scale-105">
               <History className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">History</span>
          </Card>
          <Card className="glass-panel group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-critical/50 hover:bg-critical/5 sm:h-28 sm:p-4" onClick={onViewMedical}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-critical/10 text-critical transition-transform group-hover:scale-105">
               <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Profile</span>
          </Card>
          <Card className="glass-panel group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-flare-orange/50 hover:bg-flare-orange/5 sm:h-28 sm:p-4" onClick={onViewToolkit}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-flare-orange/10 text-flare-orange transition-transform group-hover:scale-105">
               <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Toolkit</span>
          </Card>
          <Card className="glass-panel group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-cyan-brand/50 sm:h-28 sm:p-4" onClick={onViewSafety}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-brand/10 text-cyan-brand transition-transform group-hover:scale-105">
               <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Safety</span>
          </Card>
          <Card className="glass-panel group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-cyan-brand/50 sm:h-28 sm:p-4" onClick={onAskGemma}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-brand/20 text-cyan-brand transition-transform group-hover:scale-105">
               <Bot className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Ask Gemma</span>
          </Card>
          <Card className="glass-panel group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-violet-brand/50 hover:bg-violet-brand/5 sm:h-28 sm:p-4" onClick={onOpenDemo}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-brand/15 text-violet-brand transition-transform group-hover:scale-105">
               <PlayCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Demo</span>
          </Card>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-end justify-between gap-3 px-1">
          <div>
            <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate">
              <MapPinned className="h-4 w-4 text-blue" />
              Incident Map
            </h2>
            <p className="mt-1 text-xs text-slate">Packets with location appear here for quick review.</p>
          </div>
          <span className="hidden text-[10px] font-mono uppercase tracking-widest text-cyan-brand sm:block">Tactical view</span>
        </div>
        <MapComponent height="220px" onSelectPacket={onViewHistory} className="glass-panel border-mist/40 shadow-lg" />
      </section>

      <div className="pt-4" />
    </div>
  );
}
