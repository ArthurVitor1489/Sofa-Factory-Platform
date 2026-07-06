import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ className, type = 'text', label, error, multiline, rows = 4, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </label>
        )}
        
        {multiline ? (
          <textarea
            id={inputId}
            ref={ref as any}
            rows={rows}
            className={twMerge(
              clsx(
                'w-full px-4 py-3 bg-white border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                error ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-border'
              ),
              className
            )}
            {...(props as any)}
          />
        ) : (
          <input
            id={inputId}
            ref={ref as any}
            type={type}
            className={twMerge(
              clsx(
                'w-full h-11 px-4 bg-white border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                error ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-border'
              ),
              className
            )}
            {...props}
          />
        )}
        
        {error && (
          <span className="text-xs text-red-600 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;
