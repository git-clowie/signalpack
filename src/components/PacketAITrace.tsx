import React from 'react';
import { Badge, Card } from '@/src/components/ui';
import { CrisisPacket } from '@/src/types';
import { AlertTriangle, Cpu, ExternalLink } from 'lucide-react';

export function PacketAITrace({ packet }: { packet: CrisisPacket }) {
  const providerLabel = packet.model_provider === 'openrouter'
    ? 'OpenRouter'
    : packet.model_provider === 'fallback'
      ? 'Deterministic fallback'
      : 'Unknown provider';

  return (
    <section className="print:hidden">
      <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3">AI Trace</h2>
      <Card className={`p-4 border rounded-2xl ${packet.fallback_used ? 'border-warning/30 bg-warning/10' : 'border-mist/50 bg-cloud'}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${packet.fallback_used ? 'bg-warning/10 text-warning' : 'bg-blue/10 text-blue'}`}>
              {packet.fallback_used ? <AlertTriangle className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{providerLabel}</p>
              <p className="text-[10px] text-slate font-mono uppercase tracking-widest mt-1">{packet.model_name || 'No model recorded'}</p>
              {packet.ai_trace?.fallback_reason && (
                <p className="text-xs text-warning mt-2 leading-relaxed">{packet.ai_trace.fallback_reason}</p>
              )}
            </div>
          </div>
          <Badge className={packet.fallback_used ? 'bg-warning/10 text-warning border-warning/30' : 'bg-blue/10 text-blue border-blue/30'}>
            {packet.fallback_used ? 'Fallback Used' : 'Model Backed'}
          </Badge>
        </div>
        {packet.safety_sources && packet.safety_sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-mist/30">
            <p className="text-[10px] text-slate uppercase tracking-widest font-bold mb-2">Safety Sources</p>
            <div className="flex flex-wrap gap-2">
              {packet.safety_sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-brand bg-cyan-brand/10 border border-cyan-brand/20 px-2.5 py-1.5 rounded-lg hover:bg-cyan-brand/20 transition-colors"
                >
                  {source.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
