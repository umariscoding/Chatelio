'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface MinimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: 'default' | 'floating';
}

const MinimalInput = React.forwardRef<HTMLInputElement, MinimalInputProps>(
  ({ label, error, variant = 'floating', className = '', type = 'text', ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

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
              border-zinc-700 text-zinc-100 placeholder-transparent
              focus:border-zinc-400 focus:ring-1 focus:ring-zinc-500/30 focus:outline-none 
              transition-all duration-200 autofill:bg-transparent
              ${error ? 'border-red-500' : ''}
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
                ? 'top-2 text-xs text-zinc-400 font-medium'
                : 'top-1/2 -translate-y-1/2 text-sm text-zinc-500'
              }
              ${focused ? 'text-zinc-300' : ''}
              ${error ? 'text-red-400' : ''}
            `}
          >
            {label}
          </label>
          
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 focus:outline-none"
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
            <p className="mt-1 text-sm text-red-400 font-medium">{error}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2 mb-1">
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 bg-zinc-900/50 border rounded-xl
              border-zinc-700 text-zinc-100 placeholder-zinc-500
              focus:border-zinc-400 focus:ring-1 focus:ring-zinc-500/30 focus:outline-none
              transition-all duration-200 autofill:bg-transparent
              ${error ? 'border-red-500' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${className}
            `}
            autoComplete="new-password" // Prevents browser autofill
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 focus:outline-none"
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
          <p className="text-sm text-red-400 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

MinimalInput.displayName = 'MinimalInput';

export default MinimalInput;