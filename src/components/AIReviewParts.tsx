import React from 'react';
import { Bot, Cpu } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type QuickAnswer = 'Yes' | 'No' | 'Not sure';

export function AnalysisLoading({ loadingBars, loadingText }: { loadingBars: number[]; loadingText: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 scale-125 animate-pulse rounded-full bg-blue opacity-40 blur-xl"></div>
        <div className="absolute inset-0 scale-150 animate-ping rounded-full bg-blue opacity-10"></div>
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue/50 bg-surface text-blue shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <Cpu className="h-8 w-8" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="font-bold uppercase tracking-widest text-white">Structuring report</h2>
        <p className="h-4 animate-pulse font-mono text-xs font-bold uppercase tracking-widest text-blue">{loadingText}</p>
      </div>
      <div className="mt-4 flex w-full items-center justify-center gap-1">
        {loadingBars.map((height, index) => (
          <div
            key={index}
            className="w-1 animate-pulse rounded-full bg-cyan-brand/80"
            style={{ height: `${height}px`, animationDelay: `${index * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function AnalysisMetric({
  icon: Icon,
  label,
  title,
  caption,
  tone,
  meter,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  caption: string;
  tone: 'blue' | 'cyan' | 'warning';
  meter?: number;
}) {
  const toneClass = tone === 'warning'
    ? 'text-warning bg-warning/10 border-warning/25'
    : tone === 'cyan'
      ? 'text-cyan-brand bg-cyan-brand/10 border-cyan-brand/25'
      : 'text-blue bg-blue/10 border-blue/25';

  return (
    <div className="rounded-xl border border-mist/35 bg-cloud/70 p-3">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', toneClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate">{label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate">{caption}</p>
        </div>
      </div>
      {typeof meter === 'number' && (
        <div className="mt-3 flex gap-1 pl-[52px]">
          {[0, 1, 2, 3, 4].map((step) => (
            <span key={step} className={cn('h-2 flex-1 rounded-full', step < meter ? 'bg-warning' : 'bg-mist/40')} />
          ))}
        </div>
      )}
    </div>
  );
}

export function QuestionRow({
  question,
  answer,
  onAnswer,
}: {
  question: string;
  answer?: QuickAnswer;
  onAnswer: (answer: QuickAnswer) => void;
}) {
  return (
    <div className="rounded-xl border border-mist/35 bg-cloud/70 p-3">
      <div className="mb-3 flex items-start gap-2">
        <Bot className="mt-0.5 h-4 w-4 shrink-0 text-cyan-brand" />
        <p className="text-sm font-medium leading-relaxed text-white">{question}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(['Yes', 'No', 'Not sure'] as QuickAnswer[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onAnswer(option)}
            className={cn(
              'h-10 rounded-lg border px-2 text-[10px] font-bold uppercase tracking-widest transition-all',
              answer === option
                ? 'border-cyan-brand bg-cyan-brand/15 text-cyan-brand shadow-[0_0_16px_rgba(0,230,255,0.16)]'
                : 'border-mist/40 bg-surface/60 text-slate hover:border-cyan-brand/40 hover:text-white',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
