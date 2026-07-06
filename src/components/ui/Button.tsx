import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
            {
              // Variants
              'bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 active:scale-[0.98]':
                variant === 'primary',
              'bg-secondary text-secondary-foreground hover:bg-secondary/90':
                variant === 'secondary',
              'border border-border bg-transparent text-foreground hover:bg-muted hover:border-muted-foreground/30':
                variant === 'outline',
              'bg-transparent text-foreground hover:bg-muted':
                variant === 'ghost',
              'bg-transparent text-primary hover:underline p-0':
                variant === 'link',
              // Sizes
              'px-3.5 py-1.5 text-xs': size === 'sm',
              'px-5 py-2.5 text-sm': size === 'md',
              'px-7 py-3 text-base': size === 'lg',
            },
            className
          )
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
