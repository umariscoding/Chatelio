'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customWidth?: string;
  theme?: 'light' | 'dark';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  customWidth,
  theme = 'light',
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    custom: customWidth || 'max-w-md',
  };

  const themeClasses = {
    light: {
      background: 'bg-white',
      text: 'text-gray-900',
      closeButton: 'text-gray-400 hover:text-gray-500',
      closeButtonBg: 'bg-white',
    },
    dark: {
      background: 'bg-zinc-900',
      text: 'text-zinc-100',
      closeButton: 'text-zinc-600 hover:text-zinc-500',
      closeButtonBg: 'bg-transparent',
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        
        <div 
          className={`
            relative transform overflow-hidden rounded-3xl ${currentTheme.background} 
            px-6 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full 
            ${maxWidthClasses[maxWidth]} sm:px-8 sm:py-6 border border-zinc-800
          `}
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {title && (
            <div className="mb-4">
              <h3 className={`text-lg font-medium leading-6 ${currentTheme.text}`}>
                {title}
              </h3>
            </div>
          )}
          
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className={`${currentTheme.closeButtonBg} ${currentTheme.closeButton} focus:outline-none`}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;