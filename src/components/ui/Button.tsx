// Base Button component
import React, { memo } from 'react';

import type { ButtonProps } from '@/interfaces/Button.interface';

const Button = memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-text-white shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30',
      secondary: 'bg-neutral-200 hover:bg-neutral-300 text-text-primary border border-border-light',
      outline: 'border border-primary-600 bg-transparent hover:bg-primary-50 text-primary-600 hover:text-primary-700',
      ghost: 'hover:bg-bg-secondary hover:text-primary-600 text-text-secondary',
      destructive: 'bg-error-600 text-text-white hover:bg-error-700 shadow-lg shadow-error-600/20',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 py-2 px-4',
      lg: 'h-11 px-8',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ''}`;

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  }
));

Button.displayName = 'Button';

export default Button;
