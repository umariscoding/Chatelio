// Base Button component
import React, { memo } from 'react';

import type { ButtonProps } from '@/interfaces/Button.interface';

const Button = memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-text-white',
      secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900 border border-secondary-300',
      outline: 'border border-primary-300 bg-transparent hover:bg-primary-50 text-primary-700 hover:text-primary-800',
      ghost: 'hover:bg-primary-50 hover:text-primary-700 text-secondary-700',
      destructive: 'bg-error-600 text-text-white hover:bg-error-700',
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
