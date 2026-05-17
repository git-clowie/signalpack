import React, { useId } from 'react';
import { cn } from '@/src/lib/utils';

export type LogoShape = 'Flare' | 'S' | 'Shield' | 'Hexagon' | 'Wave';

interface LogoProps {
  shape?: LogoShape;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  containerClassName?: string;
}

export function Logo({ shape = 'Flare', size = 'md', className, containerClassName }: LogoProps) {
  const uid = useId().replace(/:/g, '');
  const arcId = `signalpack-arc-${uid}`;
  const alertId = `signalpack-alert-${uid}`;
  const coreId = `signalpack-core-${uid}`;
  const sizeMap = {
    sm: { container: 'w-8 h-8 rounded-lg', text: 'text-sm' },
    md: { container: 'w-12 h-12 rounded-xl', text: 'text-xl' },
    lg: { container: 'w-16 h-16 rounded-2xl', text: 'text-3xl' },
    xl: { container: 'w-24 h-24 rounded-[2rem]', text: 'text-5xl' },
  };

  const currentSize = sizeMap[size];

  const renderFlare = () => (
    <svg viewBox="0 0 128 128" className={cn('w-[82%] h-[82%] drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]', className)} role="img" aria-label="SignalPack signal flare logo">
      <defs>
        <linearGradient id={arcId} x1="18" x2="110" y1="35" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={alertId} x1="95" x2="116" y1="45" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
        <radialGradient id={coreId} cx="52" cy="82" r="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.26" stopColor="#A5F3FC" />
          <stop offset="0.62" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </radialGradient>
      </defs>

      <circle cx="52" cy="82" r="30" fill="#0F172A" stroke="#2563EB" strokeWidth="2" opacity="0.95" />
      <circle cx="52" cy="82" r="20" fill={`url(#${coreId})`} opacity="0.96" />
      <circle cx="52" cy="82" r="9" fill="#E0F2FE" />

      <path d="M30 72a34 34 0 0 1 34-34" fill="none" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
      <path d="M22 66a48 48 0 0 1 48-48" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
      <path d="M14 61a62 62 0 0 1 62-62" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />

      <path d="M52 14c29 0 53 24 53 53H72c0-11-9-20-20-20V14Z" fill={`url(#${arcId})`} opacity="0.98" />
      <path d="M78 68h29c0-11-3-22-9-31" fill="none" stroke={`url(#${alertId})`} strokeWidth="7" strokeLinecap="round" />
      <path d="M52 14c22 0 41 14 49 34" fill="none" stroke="#22D3EE" strokeWidth="2" opacity="0.85" />
      <path d="M52 39c14 0 26 9 31 21" fill="none" stroke="#A78BFA" strokeWidth="8" opacity="0.62" />

      <path d="M55 76 101 30" stroke="#111827" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
      <path d="M57 74 102 29" stroke="#1E40AF" strokeWidth="9" strokeLinecap="round" />
      <path d="M57 74 102 29" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

      <path d="M22 113h60" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M39 104h26" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );

  const renderShape = () => {
    switch (shape) {
      case 'Shield':
        return renderFlare();
      case 'Hexagon':
        return renderFlare();
      case 'Wave':
        return renderFlare();
      case 'S':
        return <span className={cn(currentSize.text, "text-white font-display font-bold shadow-[0_0_10px_rgba(255,255,255,0.3)]", className)}>S</span>;
      case 'Flare':
      default:
        return renderFlare();
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-center shrink-0 bg-[#070B14] border border-blue/20 shadow-[inset_0_0_18px_rgba(59,130,246,0.18),0_0_22px_rgba(59,130,246,0.25)]",
      currentSize.container,
      containerClassName
    )}>
      {renderShape()}
    </div>
  );
}
