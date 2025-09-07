'use client';

import React from 'react';

interface MinimalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    fullWidth = false,
    className = '', 
    children, 
    disabled,
    ...props 
  }, ref) => {
    
    const baseClasses = `
      inline-flex items-center justify-center rounded-lg font-medium
      transition-all duration-200 focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const variants = {
      primary: `
        bg-zinc-700 hover:bg-zinc-600 text-zinc-100
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1 focus:ring-offset-zinc-900
        shadow-sm
      `,
      secondary: `
        bg-zinc-800 hover:bg-zinc-700 text-zinc-100
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1 focus:ring-offset-zinc-900
        border border-zinc-700 hover:border-zinc-600
      `,
      ghost: `
        bg-transparent hover:bg-zinc-800/50 text-zinc-300 hover:text-zinc-100
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1 focus:ring-offset-zinc-900
      `,
      outline: `
        bg-transparent border border-zinc-700 hover:border-zinc-600
        text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/30
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1 focus:ring-offset-zinc-900
      `
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-base'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

MinimalButton.displayName = 'MinimalButton';

export default MinimalButton;