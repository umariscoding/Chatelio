'use client';

import React, { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
}) => {
  const responsiveClasses = [
    className,
    mobileClassName && `sm:${mobileClassName}`,
    tabletClassName && `md:${tabletClassName}`,
    desktopClassName && `lg:${desktopClassName}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={responsiveClasses}>
      {children}
    </div>
  );
};

// Utility hook for responsive breakpoints
export const useResponsive = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkBreakpoint = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);
        setIsDesktop(width >= 1024);
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 4 },
  gap = { mobile: 4, tablet: 6, desktop: 6 },
  className = '',
}) => {
  const gridClasses = [
    'grid',
    `grid-cols-${cols.mobile || 1}`,
    cols.tablet && `md:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`,
    `gap-${gap.mobile || 4}`,
    gap.tablet && `md:gap-${gap.tablet}`,
    gap.desktop && `lg:gap-${gap.desktop}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Mobile-optimized Text Component
interface ResponsiveTextProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  mobileSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = 'base',
  mobileSize,
  className = '',
}) => {
  const textSize = mobileSize || size;
  const responsiveSize = mobileSize ? `sm:text-${size}` : '';
  
  const textClasses = [
    `text-${textSize}`,
    responsiveSize,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={textClasses}>
      {children}
    </span>
  );
};

// Touch-friendly Button Component
interface TouchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]', // Minimum 40px for touch targets
    md: 'px-4 py-3 text-base min-h-[44px]', // Minimum 44px for touch targets
    lg: 'px-6 py-4 text-lg min-h-[48px]', // Minimum 48px for touch targets
  };

  const buttonClasses = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95', // Touch feedback
    variants[variant],
    sizes[size],
    className,
  ].join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

// Responsive Modal Component
interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    full: 'max-w-full mx-4',
  };

  const mobileClasses = size === 'full' 
    ? 'h-full w-full' 
    : 'max-h-[90vh] mx-4 my-8';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`
          relative bg-white rounded-lg shadow-xl transform transition-all
          ${sizeClasses[size]} ${mobileClasses}
          w-full overflow-hidden
        `}>
          {title && (
            <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 sm:top-6 sm:right-6"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto max-h-[70vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveContainer;
