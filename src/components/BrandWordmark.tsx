import React from 'react';
import { cn } from '@/src/lib/utils';
import { Logo } from './Logo';

export function BrandWordmark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Logo size={compact ? 'sm' : 'md'} />
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
