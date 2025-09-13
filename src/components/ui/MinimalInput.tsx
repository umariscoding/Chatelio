'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface MinimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: 'default' | 'floating';
  theme?: 'light' | 'dark' | 'auth';
}

const MinimalInput = React.forwardRef<HTMLInputElement, MinimalInputProps>(
  ({ label, error, variant = 'floating', theme = 'dark', className = '', type = 'text', ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Theme-based styles
    const themeStyles = {
      light: {
        input: 'border-secondary-300 text-secondary-900 focus:border-primary-500 focus:ring-primary-500/30 hover:border-secondary-400',
        label: {
          default: 'text-secondary-600',
          focused: 'text-primary-600',
          error: 'text-error-600'
        },
        error: 'text-error-600',
        passwordToggle: 'text-secondary-600 hover:text-secondary-900'
      },
      dark: {
        input: 'border-secondary-700 text-secondary-50 focus:border-secondary-400 focus:ring-secondary-500/30',
        label: {
          default: 'text-secondary-500',
          focused: 'text-secondary-50',
          error: 'text-error-400'
        },
        error: 'text-error-400',
        passwordToggle: 'text-secondary-400 hover:text-secondary-300'
      },
      auth: {
        input: 'border-auth-700 text-auth-100 focus:border-auth-500 focus:ring-auth-500/30',
        label: {
          default: 'text-auth-400',
          focused: 'text-auth-300',
          error: 'text-error-400'
        },
        error: 'text-error-400',
        passwordToggle: 'text-auth-400 hover:text-auth-300'
      }
    };

    const currentTheme = themeStyles[theme];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    if (variant === 'floating') {
      return (
        <div className="relative mb-1">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              peer w-full px-4 pt-6 pb-3 bg-transparent border rounded-xl
              ${currentTheme.input} placeholder-transparent
              focus:ring-1 focus:outline-none 
              transition-all duration-200 autofill:bg-transparent
              ${error ? 'border-error-500' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${className}
            `}
            placeholder={label}
            autoComplete="new-password" // Prevents browser autofill
          />
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${focused || hasValue
                ? `top-2 text-xs font-medium ${focused ? currentTheme.label.focused : currentTheme.label.default}`
                : `top-1/2 -translate-y-1/2 text-sm ${currentTheme.label.default}`
              }
              ${error ? currentTheme.label.error : ''}
            `}
          >
            {label}
          </label>
          
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none ${currentTheme.passwordToggle}`}
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          )}
          
          {error && (
            <p className={`mt-1 text-sm font-medium ${currentTheme.error}`}>{error}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2 mb-1">
        <label className={`block text-sm font-medium ${currentTheme.label.default}`}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 ${theme === 'light' ? 'bg-secondary-50' : 'bg-secondary-900/50'} border rounded-xl
              ${currentTheme.input} ${theme === 'light' ? 'placeholder-secondary-500' : 'placeholder-secondary-500'}
              focus:ring-1 focus:outline-none
              transition-all duration-200 autofill:bg-transparent
              ${error ? 'border-error-500' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${className}
            `}
            autoComplete="new-password" // Prevents browser autofill
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none ${currentTheme.passwordToggle}`}
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <p className={`text-sm font-medium ${currentTheme.error}`}>{error}</p>
        )}
      </div>
    );
  }
);

MinimalInput.displayName = 'MinimalInput';

export default MinimalInput;