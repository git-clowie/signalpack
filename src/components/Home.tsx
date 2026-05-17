import React from 'react';
import { Card, Button } from '@/src/components/ui';
import { Camera, Mic, FileText, History, BookOpen, HardDrive, Cloud, AlertTriangle, RadioTower } from 'lucide-react';
import { BrandWordmark } from './BrandWordmark';
import { useSettings } from '../SettingsContext';

import { vibrate } from '../lib/utils';
import { MapComponent } from './MapComponent';

export function HomeScreen({ 
   onStartReport, 
   onViewHistory, 
   onViewSafety,
   onAskGemma,
   isLocalMode 
}: { 
   onStartReport: (isPanic?: boolean) => void, 
   onViewHistory: (packet?: any) => void,
   onViewSafety: () => void,
   onAskGemma: () => void,
   isLocalMode: boolean
}) {
  const { openRouterApiKey, openRouterModel } = useSettings();
  const missingOpenRouterKey = !openRouterApiKey.trim();
  const openRouterOffline = isLocalMode;
  const phases = ['Prepare', 'Alert', 'Understand', 'Act'];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto relative px-4 pb-20">
      
      <div className="pt-6 pb-4 flex flex-col items-center text-center">
        <div className="w-full signal-flare-panel border border-blue/20 rounded-[2rem] px-4 py-6 mb-5 overflow-hidden relative border-signal-glow">
          <div className="absolute inset-x-8 bottom-0 h-px signal-sweep opacity-80" />
          <div className="relative z-10 flex flex-col items-center">
            <BrandWordmark className="mb-5" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white mb-2 leading-tight">
              Trusted alerts.
              <span className="block text-signal-gradient">Structured action.</span>
            </h1>
            <p className="text-xs text-slate leading-relaxed max-w-md mb-5">
              Capture messy emergency signals and turn them into reviewable Crisis Packets powered by Gemma 4.
            </p>
            <div className="grid grid-cols-4 gap-1.5 w-full max-w-md">
              {phases.map((phase) => (
                <div key={phase} className="rounded-lg border border-mist/40 bg-cloud/60 px-2 py-2">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate">{phase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {(missingOpenRouterKey || openRouterOffline) && (
          <div className={`w-full mb-4 rounded-xl border px-3 py-2 text-left text-xs flex items-start gap-2 ${missingOpenRouterKey || openRouterOffline ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-cyan-brand/10 border-cyan-brand/20 text-cyan-brand'}`}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">
              {missingOpenRouterKey
                ? 'Add an OpenRouter key in Settings for hosted Gemma 4.'
                : 'You appear offline. Hosted OpenRouter calls will use marked fallback until the connection returns.'}
            </span>
          </div>
        )}
        <Button size="lg" fullWidth onClick={() => { vibrate([50]); onStartReport(); }} className="mb-4 shadow-[0_0_20px_rgba(59,130,246,0.4)] bg-blue hover:bg-blue/90 text-white border-0 h-14 rounded-2xl text-sm tracking-widest font-bold uppercase transition-all hover:scale-[1.02]">
          <RadioTower className="w-5 h-5 mr-2" /> Start Alert
        </Button>
        <Button size="lg" fullWidth onClick={() => { vibrate([100, 50, 100]); onStartReport(true); }} className="mb-4 bg-critical text-white border-0 h-12 rounded-2xl text-xs tracking-widest font-bold uppercase transition-all hover:bg-critical/80 animate-pulse">
          Rapid Packet Mode
        </Button>
      </div>

      <div className="mt-2">
        <h2 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-4 px-2">Alert Capture</h2>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card className="p-4 flex flex-col items-center justify-center text-center border-mist/30 cursor-pointer hover:border-blue/50 hover:bg-blue/5 transition-all bg-surface/50 shadow-sm rounded-2xl group" onClick={() => onStartReport()}>
            <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center mb-3 text-blue transition-transform group-hover:scale-110">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate group-hover:text-white transition-colors">Photo</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center border-mist/30 cursor-pointer hover:border-critical/50 hover:bg-critical/5 transition-all bg-surface/50 shadow-sm rounded-2xl group" onClick={() => onStartReport()}>
            <div className="w-12 h-12 rounded-xl bg-critical/10 flex items-center justify-center mb-3 text-critical transition-transform group-hover:scale-110 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-critical/20 to-transparent"></div>
               <Mic className="w-5 h-5 relative z-10" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate group-hover:text-white transition-colors">Audio</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center border-mist/30 cursor-pointer hover:border-blue/50 hover:bg-blue/5 transition-all bg-surface/50 shadow-sm rounded-2xl group" onClick={() => onStartReport()}>
            <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center mb-3 text-blue transition-transform group-hover:scale-110">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate group-hover:text-white transition-colors">Message</span>
          </Card>
        </div>
      </div>

      <div className="mt-2">
        <h2 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-4 px-2">Act & Prepare</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 flex flex-col items-center justify-center text-center border-mist/30 cursor-pointer hover:border-slate/80 transition-all bg-surface/50 shadow-sm rounded-2xl group" onClick={onViewHistory}>
            <div className="w-10 h-10 rounded-xl bg-mist/30 flex items-center justify-center mb-3 text-slate transition-transform group-hover:scale-110">
               <History className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate group-hover:text-white transition-colors">Packet History</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center border-mist/30 cursor-pointer hover:border-cyan-brand/50 transition-all bg-surface/50 shadow-sm rounded-2xl group" onClick={onViewSafety}>
            <div className="w-10 h-10 rounded-xl bg-cyan-brand/10 flex items-center justify-center mb-3 text-cyan-brand transition-transform group-hover:scale-110">
               <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate group-hover:text-white transition-colors">Safety Guide</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center border-mist/30 cursor-pointer hover:border-cyan-brand/50 transition-all bg-surface/50 shadow-sm rounded-2xl group" onClick={onAskGemma}>
            <div className="w-10 h-10 rounded-xl bg-cyan-brand/20 flex items-center justify-center mb-3 text-cyan-brand transition-transform group-hover:scale-110">
               <span className="font-bold text-xs">AI</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate group-hover:text-white transition-colors">Guided Help</span>
          </Card>
        </div>
      </div>

      <div className="mt-2 text-center pb-4 pt-4 border-t border-mist/20">
        <h2 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-4 px-2 flex items-center gap-2 justify-center">
          <span className="w-1.5 h-1.5 bg-blue rounded-full animate-pulse-slow"></span>
          Incident Map
        </h2>
        <MapComponent height="220px" onSelectPacket={onViewHistory} className="shadow-lg border-mist/50" />
      </div>

      <div className="mt-auto pt-4 pb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-mist/10 px-4 py-2 rounded-full border border-mist/40 backdrop-blur-sm">
          {isLocalMode ? <HardDrive className="w-4 h-4 text-warning animate-pulse" /> : <Cloud className="w-4 h-4 text-blue animate-pulse" />}
          <span className="text-xs font-mono text-slate uppercase tracking-widest font-bold">
            {isLocalMode ? 'Offline PWA fallback' : `OpenRouter / ${openRouterModel}`}
          </span>
          <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${missingOpenRouterKey || isLocalMode ? 'bg-warning text-warning' : 'bg-blue text-blue'}`}></span>
        </div>
      </div>

    </div>
  );
}
