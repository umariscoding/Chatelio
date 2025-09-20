'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { loadFromStorage as loadCompanyFromStorage, verifyCompanyToken } from '@/store/slices/companyAuthSlice';
import { loadFromStorage as loadUserFromStorage, verifyUserToken, verifyUserTokenGraceful } from '@/store/slices/userAuthSlice';
import IOSLoader from '@/components/ui/IOSLoader';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  
  // Get independent auth states
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);
  
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Load tokens from localStorage for both auth systems independently
      dispatch(loadCompanyFromStorage());
      dispatch(loadUserFromStorage());
      
      // Check if current route is a public chatbot route
      const isPublicRoute = pathname?.match(/^\/[^/]+$/) || pathname?.match(/^\/[^/]+\/chat$/);
      const isDashboardRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings') || pathname?.startsWith('/profile') || pathname?.startsWith('/knowledge-base') || pathname?.startsWith('/users');
      
      try {
        // Handle company authentication (for dashboard routes)
        const companyToken = localStorage.getItem('company_access_token');
        const companyData = localStorage.getItem('company_data');
        if (companyToken && isDashboardRoute && !companyData) {
          // Only verify if we don't have stored company data
          await dispatch(verifyCompanyToken());
        }
        
        // Handle user authentication
        const userToken = localStorage.getItem('user_access_token');
        const userData = localStorage.getItem('user_data');
        if (userToken && !userData) {
          // Only verify if we don't have stored user data
          if (isPublicRoute) {
            // Graceful verification for public routes (doesn't log out on failure)
            await dispatch(verifyUserTokenGraceful());
          } else if (isDashboardRoute) {
            // Strict verification for dashboard routes
            await dispatch(verifyUserToken());
          }
        }
        
      } catch (error) {
        console.warn('Token verification failed:', error);
        // Errors are handled by individual slices
      }
      
      setIsInitializing(false);
    };

    // Only initialize auth once on mount, not on every pathname change
    initializeAuth();
  }, [dispatch]); // Removed pathname from dependencies

  // Show loading while initializing
  if (isInitializing || companyAuth.loading || userAuth.loading) {
    // Check if we're in company context (dashboard routes or company is authenticated)
    const isCompanyContext = pathname.startsWith('/dashboard') || 
                             pathname.startsWith('/knowledge-base') || 
                             pathname.startsWith('/users') || 
                             pathname.startsWith('/settings') || 
                             pathname.startsWith('/profile') ||
                             companyAuth.isAuthenticated;

    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <IOSLoader size="xl" color="primary" className="mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
