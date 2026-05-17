import React from 'react';
import { Button, Card } from '@/src/components/ui';
import { AlertTriangle, BookOpen, Bot, Camera, FileText, HeartPulse, History, KeyRound, MapPinned, Mic, PlayCircle, RadioTower, Zap } from 'lucide-react';
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
  const setIsMenuOpen = useAppStore(state => state.setIsMenuOpen);
  const setMenuTab = useAppStore(state => state.setMenuTab);
  const missingOpenRouterKey = !openRouterApiKey.trim();
  const openRouterOffline = isLocalMode;
  const statusLabel = openRouterOffline ? 'Offline fallback' : 'Gemma 4 ready';
  const openSettings = () => {
    setMenuTab('settings');
    setIsMenuOpen(true);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 pb-6 md:px-6 lg:px-8">
      <section className="pt-4 sm:pt-6">
        <Card className="glass-panel-strong relative overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-7">
          <div className="absolute inset-x-4 top-0 h-px signal-sweep opacity-70" />
          <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] min-w-56 opacity-70 sm:block">
            <div className="radar-grid absolute right-4 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full" />
            <img src="/brand/signalpack-flare.png" alt="" className="absolute right-8 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full object-cover opacity-90 mix-blend-screen" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-cyan-brand">Crisis Packet</p>
            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Turn chaos into a Crisis Packet.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate sm:text-base">
              Capture the signal. Gemma 4 structures the critical details. Review before sharing.
            </p>
          </div>

          <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-[1fr_0.72fr] lg:max-w-2xl">
            <Button size="lg" fullWidth onClick={() => { vibrate([50]); onStartReport(); }} className="primary-button h-14 rounded-xl text-sm">
              <RadioTower className="mr-2 h-5 w-5" /> Start Alert
            </Button>
            <Button size="lg" fullWidth onClick={() => { vibrate([100, 50, 100]); onStartReport(true); }} className="rapid-button h-14 rounded-xl text-xs">
              <Zap className="mr-2 h-4 w-4" /> Rapid Packet
            </Button>
          </div>

          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate">
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
          <Card className="glass-panel group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-all hover:border-blue/50 hover:bg-blue/5 sm:h-32 sm:p-4" onClick={() => onStartReport()}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 text-blue transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Message</span>
            <span className="mt-1 hidden text-[10px] leading-snug text-slate/80 sm:block">Describe what happened.</span>
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Gemma</span>
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
