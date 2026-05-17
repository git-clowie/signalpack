import React from 'react';
import { Badge, Button, Card } from '@/src/components/ui';
import { AlertTriangle, BookOpen, Bot, Camera, Cloud, FileText, History, KeyRound, MapPinned, Mic, PlayCircle, RadioTower, Zap } from 'lucide-react';
import { useSettings } from '../SettingsContext';

import { vibrate } from '../lib/utils';
import { MapComponent } from './MapComponent';
import { useAppStore } from '../engine/state/useAppStore';

export function HomeScreen({ 
   onStartReport, 
   onViewHistory, 
   onViewSafety,
   onAskGemma,
   onOpenDemo,
   isLocalMode 
}: { 
   onStartReport: (isPanic?: boolean) => void, 
   onViewHistory: (packet?: any) => void,
   onViewSafety: () => void,
   onAskGemma: () => void,
   onOpenDemo: () => void,
   isLocalMode: boolean
}) {
  const { openRouterApiKey, openRouterModel } = useSettings();
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
    <div className="flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col px-4 pb-6">
      <section className="pt-4 sm:pt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate">Ready</p>
            <p className="truncate text-sm font-semibold text-white">Build a crisis packet</p>
          </div>
          {missingOpenRouterKey ? (
            <button
              onClick={openSettings}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-mist/40 bg-surface/70 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate transition-colors hover:border-warning/40 hover:text-warning"
            >
              <KeyRound className="h-3 w-3" />
              Gemma Key
            </button>
          ) : (
            <Badge variant={openRouterOffline ? 'warning' : 'blue'} className="shrink-0">
              {statusLabel}
            </Badge>
          )}
        </div>

        <Card className="relative overflow-hidden rounded-xl border-blue/20 bg-surface/70 p-4 shadow-xl sm:p-5">
          <div className="absolute inset-x-4 top-0 h-px signal-sweep opacity-70" />
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-cyan-brand">Crisis Packet</p>
            <h1 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Start with what you know.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Add a message, photo, or voice note. Gemma 4 structures the rest for review.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.72fr]">
            <Button size="lg" fullWidth onClick={() => { vibrate([50]); onStartReport(); }} className="h-14 rounded-xl bg-blue text-sm text-white shadow-[0_0_20px_rgba(59,130,246,0.32)] hover:bg-blue/90">
              <RadioTower className="mr-2 h-5 w-5" /> Start Report
            </Button>
            <Button size="lg" fullWidth onClick={() => { vibrate([100, 50, 100]); onStartReport(true); }} className="h-14 rounded-xl border-0 bg-critical text-xs text-white hover:bg-critical/85">
              <Zap className="mr-2 h-4 w-4" /> Rapid Packet
            </Button>
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
          <Card className="group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-mist/30 bg-surface/55 px-2 py-3 text-center shadow-sm transition-all hover:border-blue/50 hover:bg-blue/5 sm:h-28 sm:p-4" onClick={() => onStartReport()}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 text-blue transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Photo</span>
          </Card>
          <Card className="group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-mist/30 bg-surface/55 px-2 py-3 text-center shadow-sm transition-all hover:border-critical/50 hover:bg-critical/5 sm:h-28 sm:p-4" onClick={() => onStartReport()}>
            <div className="relative mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-critical/10 text-critical transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
               <div className="absolute inset-0 bg-gradient-to-t from-critical/20 to-transparent" />
               <Mic className="relative z-10 h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Audio</span>
          </Card>
          <Card className="group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-mist/30 bg-surface/55 px-2 py-3 text-center shadow-sm transition-all hover:border-blue/50 hover:bg-blue/5 sm:h-28 sm:p-4" onClick={() => onStartReport()}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 text-blue transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Message</span>
          </Card>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-slate">Review & Prepare</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <Card className="group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-mist/30 bg-surface/55 px-2 py-3 text-center shadow-sm transition-all hover:border-slate/80 sm:h-28 sm:p-4" onClick={onViewHistory}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-mist/30 text-slate transition-transform group-hover:scale-105">
               <History className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">History</span>
          </Card>
          <Card className="group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-mist/30 bg-surface/55 px-2 py-3 text-center shadow-sm transition-all hover:border-cyan-brand/50 sm:h-28 sm:p-4" onClick={onViewSafety}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-brand/10 text-cyan-brand transition-transform group-hover:scale-105">
               <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Safety</span>
          </Card>
          <Card className="group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-mist/30 bg-surface/55 px-2 py-3 text-center shadow-sm transition-all hover:border-cyan-brand/50 sm:h-28 sm:p-4" onClick={onAskGemma}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-brand/20 text-cyan-brand transition-transform group-hover:scale-105">
               <Bot className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Gemma</span>
          </Card>
          <Card className="group flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-mist/30 bg-surface/55 px-2 py-3 text-center shadow-sm transition-all hover:border-violet-brand/50 hover:bg-violet-brand/5 sm:h-28 sm:p-4" onClick={onOpenDemo}>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-brand/15 text-violet-brand transition-transform group-hover:scale-105">
               <PlayCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate transition-colors group-hover:text-white">Demo</span>
          </Card>
        </div>
      </section>

      <section className="mt-5 border-t border-mist/20 pt-4 text-center">
        <h2 className="mb-3 flex items-center justify-center gap-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate">
          <MapPinned className="h-4 w-4 text-blue" />
          Incident Map
        </h2>
        <MapComponent height="200px" onSelectPacket={onViewHistory} className="border-mist/50 shadow-lg" />
      </section>

      <div className="mt-auto pt-4 text-center">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-mist/40 bg-mist/10 px-3 py-2 backdrop-blur-sm">
          <Cloud className={`h-4 w-4 ${missingOpenRouterKey || isLocalMode ? 'text-warning' : 'text-blue'}`} />
          <span className="truncate text-[10px] font-bold uppercase tracking-widest text-slate">
            {isLocalMode ? 'Marked offline fallback' : `OpenRouter / ${openRouterModel}`}
          </span>
          <span className={`h-2 w-2 shrink-0 rounded-full shadow-[0_0_5px_currentColor] ${missingOpenRouterKey || isLocalMode ? 'bg-warning text-warning' : 'bg-blue text-blue'}`} />
        </div>
      </div>
    </div>
  );
}
