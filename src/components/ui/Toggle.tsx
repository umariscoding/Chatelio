import React from 'react';
import { Switch } from '@headlessui/react';

import type { ToggleProps } from '@/interfaces/Toggle.interface';

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-8 w-14',
  };

  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-7 w-7',
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
    lg: checked ? 'translate-x-6' : 'translate-x-0',
  };

  const variantClasses = {
    primary: checked 
      ? 'bg-primary-600 focus:ring-primary-500' 
      : 'bg-neutral-200 focus:ring-neutral-300',
    success: checked 
      ? 'bg-success-600 focus:ring-success-500' 
      : 'bg-neutral-200 focus:ring-neutral-300',
    warning: checked 
      ? 'bg-warning-600 focus:ring-warning-500' 
      : 'bg-neutral-200 focus:ring-neutral-300',
    error: checked 
      ? 'bg-error-600 focus:ring-error-500' 
      : 'bg-neutral-200 focus:ring-neutral-300',
  };

  const handleChange = (checked: boolean) => {
    if (!disabled && !loading) {
      onChange(checked);
    }
  };

  const toggleClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
    transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
    ${className}
  `.trim();

  const thumbClasses = `
    ${thumbSizeClasses[size]}
    ${translateClasses[size]}
    pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 
    transition-all duration-200 ease-in-out
    ${checked ? 'shadow-xl' : 'shadow-md'}
  `.trim();

  if (label || description) {
    return (
      <Switch.Group>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {label && (
              <Switch.Label className="text-sm font-medium text-text-primary cursor-pointer">
                {label}
              </Switch.Label>
            )}
            {description && (
              <Switch.Description className="text-sm text-text-secondary">
                {description}
              </Switch.Description>
            )}
          </div>
          <Switch
            checked={checked}
            onChange={handleChange}
            disabled={disabled || loading}
            className={toggleClasses}
            {...props}
          >
            <span className="sr-only">{label || 'Toggle'}</span>
            <span className={thumbClasses} />
          </Switch>
        </div>
      </Switch.Group>
    );
  }

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      disabled={disabled || loading}
      className={toggleClasses}
      {...props}
    >
      <span className="sr-only">Toggle</span>
      <span className={thumbClasses} />
    </Switch>
  );
};

export default Toggle;
