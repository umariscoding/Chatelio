'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from './useAuth';
import { logoutCompanyComprehensive } from '@/store/slices/companyAuthSlice';
import { logout as logoutUser } from '@/store/slices/userAuthSlice';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ApiError {
  status?: number;
  message: string;
  detail?: string;
  code?: string;
}

export class AppError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    status?: number,
    code?: string,
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.context = context;
  }
}

const useErrorHandler = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logError = useCallback((error: Error | AppError, context?: ErrorContext) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      context,
      ...(error instanceof AppError && {
        status: error.status,
        code: error.code,
        errorContext: error.context,
      }),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData);
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, or custom logging service
    // errorTrackingService.captureError(errorData);
  }, []);

  const handleApiError = useCallback((error: any, context?: ErrorContext): ApiError => {
    let apiError: ApiError;

    if (error.response) {
      // API responded with error status
      const { status, data } = error.response;
      apiError = {
        status,
        message: data?.detail || data?.message || 'An error occurred',
        detail: data?.detail,
        code: data?.code,
      };

      // Handle specific error cases
      switch (status) {
        case 401:
          // Unauthorized - logout both and redirect to login
          dispatch(logoutCompanyComprehensive());
          dispatch(logoutUser());
          router.push('/company/login');
          apiError.message = 'Your session has expired. Please log in again.';
          break;
        
        case 403:
          // Forbidden
          apiError.message = 'You do not have permission to perform this action.';
          break;
        
        case 404:
          // Not found
          apiError.message = 'The requested resource was not found.';
          break;
        
        case 429:
          // Rate limited
          apiError.message = 'Too many requests. Please wait a moment and try again.';
          break;
        
        case 500:
          // Server error
          apiError.message = 'A server error occurred. Please try again later.';
          break;
        
        default:
          // Other errors
          if (!apiError.message || apiError.message === 'An error occurred') {
            apiError.message = `An error occurred (${status}). Please try again.`;
          }
      }
    } else if (error.request) {
      // Network error
      apiError = {
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Other error
      apiError = {
        message: error.message || 'An unexpected error occurred.',
        code: 'UNKNOWN_ERROR',
      };
    }

    // Log the error
    const appError = new AppError(
      apiError.message,
      apiError.status,
      apiError.code,
      context
    );
    logError(appError, context);

    return apiError;
  }, [dispatch, router, logError]);

  const handleError = useCallback((error: Error | AppError, context?: ErrorContext) => {
    logError(error, context);

    // Return user-friendly error message
    if (error instanceof AppError) {
      return error.message;
    }

    // Handle different error types
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    if (error.name === 'ValidationError') {
      return 'Please check your input and try again.';
    }

    // Default error message
    return 'An unexpected error occurred. Please try again.';
  }, [logError]);

  const createErrorBoundaryHandler = useCallback((context?: ErrorContext) => {
    return (error: Error, errorInfo: React.ErrorInfo) => {
      const enhancedContext = {
        ...context,
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      };
      
      logError(error, enhancedContext);
    };
  }, [logError]);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: ErrorContext,
    onError?: (error: ApiError) => void
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error: any) {
        const apiError = handleApiError(error, context);
        
        if (onError) {
          onError(apiError);
        }
        
        return null;
      }
    };
  }, [handleApiError]);

  const retry = useCallback(async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000,
    context?: ErrorContext
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          break;
        }
        
        // Don't retry on certain error types
        if (error.response?.status === 401 || error.response?.status === 403) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw handleApiError(lastError!, { ...context, metadata: { ...context?.metadata, retryAttempts: maxAttempts } });
  }, [handleApiError]);

  return {
    handleError,
    handleApiError,
    logError,
    createErrorBoundaryHandler,
    withErrorHandling,
    retry,
    AppError,
  };
};

export default useErrorHandler;
