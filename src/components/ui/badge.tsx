import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950',
        {
          'border-zinc-700 bg-zinc-800 text-zinc-100':
            variant === 'default',
          'border-zinc-800 bg-zinc-900/50 text-zinc-300':
            variant === 'secondary',
          'border-zinc-700 bg-transparent text-zinc-300':
            variant === 'outline',
          'border-emerald-900/50 bg-emerald-950/50 text-emerald-400':
            variant === 'success',
          'border-amber-900/50 bg-amber-950/50 text-amber-400':
            variant === 'warning',
          'border-rose-900/50 bg-rose-950/50 text-rose-400':
            variant === 'error',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
