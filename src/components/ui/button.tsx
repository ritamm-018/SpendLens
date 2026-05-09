import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'premium';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50',
          {
            // Default - Emerald primary
            'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.98]':
              variant === 'default',
            // Outline - Subtle border with hover
            'border border-zinc-800 bg-zinc-900/50 text-zinc-100 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-800/80 active:scale-[0.98]':
              variant === 'outline',
            // Ghost - Minimal with hover
            'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 active:scale-[0.98]':
              variant === 'ghost',
            // Link - Text only
            'text-emerald-500 underline-offset-4 hover:text-emerald-400 hover:underline':
              variant === 'link',
            // Premium - Gradient with glow
            'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]':
              variant === 'premium',
          },
          {
            'h-10 px-4 py-2 text-sm': size === 'default',
            'h-9 px-3 text-xs': size === 'sm',
            'h-12 px-8 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
