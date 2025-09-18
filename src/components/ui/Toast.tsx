'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/ui';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'error':
        return 'bg-error-50 border-error-200 text-error-800';
      case 'info':
        return 'bg-primary-50 border-primary-200 text-primary-800';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icons.CheckCircle className="h-5 w-5 text-success-600" />;
      case 'error':
        return <Icons.AlertCircle className="h-5 w-5 text-error-600" />;
      case 'info':
        return <Icons.AlertCircle className="h-5 w-5 text-primary-600" />;
      default:
        return <Icons.AlertCircle className="h-5 w-5 text-neutral-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${getToastStyles()}`}>
        {getIcon()}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity"
        >
          <Icons.Close className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
