'use client';

import React from 'react';
import IOSLoader from './IOSLoader';

interface MinimalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  theme?: 'default' | 'auth';
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
    theme = 'default',
    ...props 
  }, ref) => {
    
    const baseClasses = `
      inline-flex items-center justify-center rounded-lg font-medium
      transition-all duration-200 focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const defaultVariants = {
      primary: `
        bg-primary-600 hover:bg-primary-700 text-text-white
        focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-1 focus:ring-offset-secondary-900
        shadow-sm
      `,
      secondary: `
        bg-secondary-200 hover:bg-secondary-300 text-secondary-900
        focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-1 focus:ring-offset-secondary-900
        border border-secondary-300 hover:border-secondary-400
      `,
      ghost: `
        bg-transparent hover:bg-secondary-800/50 text-secondary-300 hover:text-secondary-100
        focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-1 focus:ring-offset-secondary-900
      `,
      outline: `
        bg-transparent border border-secondary-300 hover:border-secondary-400
text-secondary-900 hover:text-secondary-50 hover:bg-secondary-800/30
        focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-1 focus:ring-offset-secondary-900
      `
    };

    const authVariants = {
      primary: `
        bg-auth-700 hover:bg-auth-600 text-auth-100
        focus:ring-2 focus:ring-auth-500/40 focus:ring-offset-1 focus:ring-offset-auth-950
        shadow-sm
      `,
      secondary: `
        bg-auth-800 hover:bg-auth-700 text-auth-200
        focus:ring-2 focus:ring-auth-500/40 focus:ring-offset-1 focus:ring-offset-auth-950
        border border-auth-700 hover:border-auth-600
      `,
      ghost: `
        bg-transparent hover:bg-auth-800/50 text-auth-300 hover:text-auth-100
        focus:ring-2 focus:ring-auth-500/40 focus:ring-offset-1 focus:ring-offset-auth-950
      `,
      outline: `
        bg-transparent border border-auth-700 hover:border-auth-600
        text-auth-300 hover:text-auth-100 hover:bg-auth-800/30
        focus:ring-2 focus:ring-auth-500/40 focus:ring-offset-1 focus:ring-offset-auth-950
      `
    };

    const variants = theme === 'auth' ? authVariants : defaultVariants;

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
          <div className="flex items-center space-x-2">
            <IOSLoader size="sm" color="white" />
            <span>Loading...</span>
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