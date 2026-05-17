import React from 'react';
import { Card, Button, Badge } from '@/src/components/ui';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { DraftReport } from '@/src/types';
import { Logo } from './Logo';
import { useSettings } from '../SettingsContext';

export function AIReviewScreen({ 
  report, 
  onNext 
}: { 
  report: DraftReport; 
  onNext: () => void;
}) {
  const isAnalyzing = !report.packet;
  const { logoShape } = useSettings();
  const providerLabel = report.packet?.model_provider === 'openrouter'
    ? 'OpenRouter'
    : report.packet?.model_provider === 'fallback'
      ? 'Safety Fallback'
      : 'SignalPack Core';
  const modelName = report.packet?.model_name || 'Gemma 4';
  const fallbackUsed = !!report.packet?.fallback_used;
  const loadingBars = [12, 24, 16, 28, 20, 14, 26];

  const [loadingText, setLoadingText] = React.useState('AI thinking...');

  React.useEffect(() => {
    if (!isAnalyzing) return;
    const stages = [
      'Extracting objects...',
      'Assessing risk factors...',
      'Running hazard models...',
      'Synthesizing data...',
      'Generating safety vector...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(stages[i % stages.length]);
      i++;
    }, 1500);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto px-4 pb-6 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Gemma 4 Analysis</h1>
        <p className="text-slate text-[10px] font-mono uppercase tracking-widest">
          Model: {isAnalyzing ? 'Gemma 4 provider selected in Settings' : `${providerLabel} / ${modelName}`}
        </p>
      </div>

      {isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue rounded-full animate-pulse blur-xl opacity-40 scale-125"></div>
            <div className="absolute inset-0 bg-blue rounded-full animate-ping opacity-10 scale-150"></div>
            <div className="relative z-10 block rounded-full bg-surface border border-blue/50 p-1 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <Logo shape={logoShape} size="lg" />
            </div>
          </div>
          <div className="space-y-2">
             <h2 className="text-white font-bold tracking-widest uppercase">Structuring Signal...</h2>
             <p className="text-xs text-blue font-bold font-mono uppercase tracking-widest animate-pulse h-4">{loadingText}</p>
          </div>
          <div className="w-full flex items-center justify-center gap-1 mt-4">
             {loadingBars.map((height, i) => (
                <div key={i} className="w-1 bg-cyan-brand/80 rounded-full animate-pulse" style={{ height: `${height}px`, animationDelay: `${i * 150}ms`}}></div>
             ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto">
          {report.image && (
            <Card className="overflow-hidden border-mist">
               <img src={report.image} alt="Incident" className="w-full h-32 object-cover opacity-80" />
            </Card>
          )}

          {fallbackUsed && (
            <Card className="p-4 border-warning/30 bg-warning/10 rounded-xl">
              <h3 className="text-[10px] font-bold text-warning uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Fallback Mode
              </h3>
              <p className="text-xs text-slate leading-relaxed">
                The configured AI provider was unavailable, so SignalPack used deterministic safety rules. Add an OpenRouter key in Settings to generate a model-backed packet.
              </p>
            </Card>
          )}
          
          <Card className="p-5 border-mist/50 bg-surface/30 shadow-inner space-y-5">
            <div>
              <h3 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-3">Likely Incident</h3>
              <Badge variant="blue" className="text-sm px-4 py-2 uppercase tracking-widest font-mono text-blue bg-blue/10 border border-blue/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                {report.packet?.incident_type?.replace('_', ' ')}
              </Badge>
            </div>

            {report.packet?.hazards && report.packet.hazards.length > 0 && (
              <div className="pt-4 border-t border-mist/30">
                <h3 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-warning" /> Critical Hazards Detected
                </h3>
                <ul className="space-y-2">
                  {report.packet.hazards.map((h, i) => (
                     <li key={i} className="text-sm text-warning font-medium bg-warning/10 border border-warning/20 px-4 py-2.5 rounded-lg shadow-sm">{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {report.packet?.uncertainties && report.packet.uncertainties.length > 0 && (
              <div className="pt-4 border-t border-mist/30">
                <h3 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-3">Missing Critical Information</h3>
                <ul className="space-y-2">
                  {report.packet.uncertainties.map((u, i) => (
                    <li key={i} className="text-sm text-slate flex items-start bg-surface/50 p-3 rounded-lg border border-mist/20">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate mt-1.5 mr-3 flex-shrink-0"></span>
                       {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      )}

      {!isAnalyzing && (
        <div className="pt-4 mt-auto border-t border-mist/50 text-center">
          <p className="text-xs text-slate mb-3">
            {report.clarificationQuestions?.length ? 'Before we finalize the packet, we need to clarify a few details.' : 'Review the detected details, then finalize the packet.'}
          </p>
          <Button size="lg" fullWidth onClick={onNext}>
            {report.clarificationQuestions?.length ? 'Clarify Details' : 'Finalize Packet'} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
