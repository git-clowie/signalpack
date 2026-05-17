import React from 'react';
import { cn } from '@/src/lib/utils';

export function BrandWordmark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className={cn('rounded-full bg-cyan-brand shadow-[0_0_10px_var(--color-cyan-brand)]', compact ? 'h-2 w-2' : 'h-2.5 w-2.5')} />
      <div>
        <div className={cn('font-display font-bold tracking-tight text-white leading-none', compact ? 'text-lg' : 'text-2xl')}>
          Signal<span className="bg-gradient-to-r from-cyan-brand via-blue to-violet-brand bg-clip-text text-transparent">Pack</span>
        </div>
        {!compact && (
          <div className="mt-1 text-[9px] font-mono uppercase tracking-[0.38em] text-slate">
            AI-powered alerts
          </div>
        )}
      </div>
    </div>
  );
}
