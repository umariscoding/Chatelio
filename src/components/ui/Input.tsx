'use client';

import React from 'react';
import type { InputProps } from '@/interfaces/Input.interface';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, description, type = 'text', theme = 'light', ...props }, ref) => {
    
    const themeClasses = {
      light: {
        input: 'border-secondary-300 bg-secondary-50 text-secondary-900 placeholder:text-secondary-500 focus-visible:ring-primary-500 hover:border-secondary-400',
        label: 'text-secondary-700',
        description: 'text-secondary-600',
      },
      dark: {
        input: 'border-secondary-700 bg-secondary-800 text-secondary-100 placeholder:text-secondary-500 focus-visible:ring-primary-600',
        label: 'text-secondary-300',
        description: 'text-secondary-500',
      }
    };
    
    const currentTheme = themeClasses[theme];
    
    const baseClasses = `flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-secondary-50 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${currentTheme.input}`;
    const errorClasses = error ? 'border-error-500 focus-visible:ring-error-500' : '';
    const classes = `${baseClasses} ${errorClasses} ${className || ''}`;

    return (
      <div className="w-full">
        {label && (
          <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block ${currentTheme.label}`}>
            {label}
          </label>
        )}
        {/* Use the dark-theme class from globals.css for autofill styling */}
        <div className={theme === 'dark' ? 'dark-theme' : ''}>
          <input
            type={type}
            className={classes}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-error-500 mt-1">{error}</p>
        )}
        {description && !error && (
          <p className={`text-sm mt-1 ${currentTheme.description}`}>{description}</p>
        )}
        {helperText && !error && !description && (
          <p className={`text-sm mt-1 ${currentTheme.description}`}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;