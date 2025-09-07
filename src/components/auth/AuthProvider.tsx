'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { loadFromStorage as loadCompanyFromStorage, verifyCompanyToken } from '@/store/slices/companyAuthSlice';
import { loadFromStorage as loadUserFromStorage, verifyUserToken, verifyUserTokenGraceful } from '@/store/slices/userAuthSlice';
import Loading from '@/components/ui/Loading';

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
        if (companyToken && isDashboardRoute) {
          // Strict verification for dashboard routes
          await dispatch(verifyCompanyToken());
        }
        
        // Handle user authentication
        const userToken = localStorage.getItem('user_access_token');
        if (userToken) {
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

    initializeAuth();
  }, [dispatch, pathname]);

  // Show loading while initializing
  if (isInitializing || companyAuth.loading || userAuth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
