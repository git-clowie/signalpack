import React from 'react';
import { cn } from '@/src/lib/utils';

export type LogoShape = 'Flare' | 'S' | 'Shield' | 'Hexagon' | 'Wave';

interface LogoProps {
  shape?: LogoShape;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  containerClassName?: string;
}

export function Logo({ shape = 'Flare', size = 'md', className, containerClassName }: LogoProps) {
  const sizeMap = {
    sm: { container: 'w-8 h-8 rounded-lg', text: 'text-sm' },
    md: { container: 'w-12 h-12 rounded-xl', text: 'text-xl' },
    lg: { container: 'w-16 h-16 rounded-2xl', text: 'text-3xl' },
    xl: { container: 'w-24 h-24 rounded-[2rem]', text: 'text-5xl' },
  };

  const currentSize = sizeMap[size];

  const renderFlare = () => (
    <img
      src="/brand/signalpack-flare.png"
      alt="SignalPack signal flare logo"
      className={cn('h-full w-full object-cover object-center', className)}
    />
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
      "flex items-center justify-center shrink-0 overflow-hidden bg-[#07080B] border border-cyan-brand/20 shadow-[inset_0_0_18px_rgba(0,230,255,0.08),0_0_22px_rgba(37,99,255,0.22)]",
      currentSize.container,
      containerClassName
    )}>
      {renderShape()}
    </div>
  );
}
