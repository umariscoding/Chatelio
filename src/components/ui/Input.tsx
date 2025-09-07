'use client';

import React from 'react';
import type { InputProps } from '@/interfaces/Input.interface';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, description, type = 'text', theme = 'light', ...props }, ref) => {
    
    const themeClasses = {
      light: {
        input: 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-blue-500',
        label: 'text-gray-900',
        description: 'text-gray-500',
      },
      dark: {
        input: 'border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-600',
        label: 'text-zinc-300',
        description: 'text-zinc-500',
      }
    };
    
    const currentTheme = themeClasses[theme];
    
    const baseClasses = `flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${currentTheme.input}`;
    const errorClasses = error ? 'border-red-500 focus-visible:ring-red-500' : '';
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
          <p className="text-sm text-red-500 mt-1">{error}</p>
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