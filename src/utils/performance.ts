// Performance utilities for optimization

import { ComponentType, lazy, LazyExoticComponent } from 'react';

// Dynamic import with retry logic for better reliability
export const retryImport = <T>(
  importFn: () => Promise<{ default: T }>,
  retries: number = 3,
  delay: number = 1000
): Promise<{ default: T }> => {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        if (retries > 0) {
          setTimeout(() => {
            retryImport(importFn, retries - 1, delay)
              .then(resolve)
              .catch(reject);
          }, delay);
        } else {
          reject(error);
        }
      });
  });
};

// Enhanced lazy loading with retry logic
export const lazyWithRetry = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> => {
  return lazy(() => retryImport(importFn));
};

// Preload components for better UX
export const preloadComponent = (importFn: () => Promise<any>) => {
  // Only preload in browser
  if (typeof window !== 'undefined') {
    importFn().catch(() => {
      // Silently fail, the component will be loaded when needed
    });
  }
};

// Debounce utility for search and other frequent operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll and resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  
  const observe = (element: Element, callback: (isIntersecting: boolean) => void) => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback for SSR or unsupported browsers
      callback(true);
      return () => {};
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting);
        });
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    
    return () => observer.unobserve(element);
  };
  
  return { observe };
};

// Bundle size analyzer (development only)
export const logBundleSize = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Loading component: ${componentName}`);
  }
};

// Virtual scrolling utilities
export const calculateVisibleItems = (
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  overscan: number = 5
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return { startIndex, endIndex };
};

// Memory usage monitor (development only)
export const monitorMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'performance' in window && 'memory' in (performance as any)) {
    const memory = (performance as any).memory;
    console.table({
      'Used JS Heap Size': `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      'Total JS Heap Size': `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      'JS Heap Size Limit': `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
};

// Performance mark utilities
export const performanceMark = (name: string) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${name}-start`);
    
    return () => {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      if (process.env.NODE_ENV === 'development') {
        const measure = performance.getEntriesByName(name)[0];
        console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
      }
    };
  }
  
  return () => {};
};

// Image optimization utilities
export const generateSrcSet = (
  baseUrl: string,
  sizes: number[] = [320, 640, 1024, 1920]
): string => {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
};

export const getOptimalImageSize = (containerWidth: number): number => {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  return Math.ceil(containerWidth * dpr);
};

// Service Worker utilities for caching
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Network status monitoring
export const useNetworkStatus = () => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'onLine' in navigator) {
    return {
      isOnline: navigator.onLine,
      connection: (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection,
    };
  }
  
  return { isOnline: true, connection: null };
};

export default {
  retryImport,
  lazyWithRetry,
  preloadComponent,
  debounce,
  throttle,
  useIntersectionObserver,
  logBundleSize,
  calculateVisibleItems,
  monitorMemoryUsage,
  performanceMark,
  generateSrcSet,
  getOptimalImageSize,
  registerServiceWorker,
  useNetworkStatus,
};
