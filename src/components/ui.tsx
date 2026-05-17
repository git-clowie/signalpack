import { forwardRef } from 'react';
import { cn } from '@/src/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon: Icon, fullWidth, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] border border-transparent';
    
    // In dark mode, outline is typically a subtle border, text is white
    const variants = {
      primary: 'primary-button hover:scale-[1.02] focus:ring-blue',
      secondary: 'bg-white/[0.035] border border-white/[0.09] text-white hover:bg-white/[0.06] focus:ring-mist',
      outline: 'border border-mist text-slate hover:bg-surface hover:text-white focus:ring-mist',
      ghost: 'text-slate hover:bg-surface/50 hover:text-white focus:ring-mist',
      danger: 'bg-transparent border-critical text-critical hover:bg-critical/10 shadow-[0_0_10px_rgba(255,77,109,0.2)]',
    };

    const sizes = {
      sm: 'h-9 px-4 text-[10px]',
      md: 'h-12 px-6 text-xs',
      lg: 'h-14 px-8 text-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {Icon && <Icon className={cn('mr-2 h-4 w-4', size === 'lg' && 'h-5 w-5')} />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-surface rounded-2xl border border-mist shadow-lg overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ 
  children, 
  variant = 'default',
  className
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'blue';
  className?: string;
}) {
  const variants = {
    default: { bg: 'bg-mist', text: 'text-slate', dot: 'bg-slate' },
    critical: { bg: 'border border-critical/30 bg-critical/5', text: 'text-critical', dot: 'bg-critical shadow-[0_0_5px_var(--color-critical)]' },
    warning: { bg: 'border border-warning/30 bg-warning/5', text: 'text-warning', dot: 'bg-warning shadow-[0_0_5px_var(--color-warning)]' },
    success: { bg: 'border border-success/30 bg-success/5', text: 'text-success', dot: 'bg-success shadow-[0_0_5px_var(--color-success)]' },
    blue: { bg: 'border border-cyan-brand/30 bg-cyan-brand/5', text: 'text-cyan-brand', dot: 'bg-cyan-brand shadow-[0_0_5px_var(--color-cyan-brand)]' },
  };

  const activeVariant = variants[variant] || variants['default'];

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', activeVariant.bg, activeVariant.text, className)}>
      {variant !== 'default' && (
        <span className={cn('w-1.5 h-1.5 rounded-full', activeVariant.dot)}></span>
      )}
      {children}
    </span>
  );
}
