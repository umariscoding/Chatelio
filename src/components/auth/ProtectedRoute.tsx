'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/components/ui/Loading';
import { useAppSelector } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/APP_CONSTANTS';
import type { UserType } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: UserType;
  fallbackRoute?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType,
  fallbackRoute = ROUTES.COMPANY_LOGIN
}) => {
  const router = useRouter();
  const { 
    isCompanyAuthenticated, 
    isUserAuthenticated, 
    companyLoading, 
    userLoading, 
    activeSession 
  } = useAppSelector((state) => state.auth);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize before making routing decisions
    if (!companyLoading && !userLoading) {
      setIsInitialLoad(false);
      
      // Check if user needs company access
      if (requiredUserType === 'company') {
        if (!isCompanyAuthenticated) {
          router.push(ROUTES.COMPANY_LOGIN);
          return;
        }
      }
      
      // Check if user needs user access  
      if (requiredUserType === 'user') {
        if (!isUserAuthenticated) {
          // Users can only authenticate through company chatbot pages, redirect to home
          router.push(ROUTES.HOME);
          return;
        }
      }
      
      // If no specific type required, check for any authentication
      if (!requiredUserType) {
        if (!isCompanyAuthenticated && !isUserAuthenticated) {
          router.push(fallbackRoute);
          return;
        }
      }
      
      // Handle wrong user type redirects
      if (requiredUserType && requiredUserType === 'company' && !isCompanyAuthenticated) {
        if (isUserAuthenticated) {
          router.push(ROUTES.CHAT); // Redirect user to their area
        } else {
          router.push(ROUTES.COMPANY_LOGIN);
        }
        return;
      }
      
      if (requiredUserType && requiredUserType === 'user' && !isUserAuthenticated) {
        if (isCompanyAuthenticated) {
          router.push(ROUTES.DASHBOARD); // Redirect company to their area
        } else {
          // Users can only authenticate through company chatbot pages, redirect to home
          router.push(ROUTES.HOME);
        }
        return;
      }
    }
  }, [
    isCompanyAuthenticated, 
    isUserAuthenticated, 
    companyLoading, 
    userLoading, 
    requiredUserType, 
    fallbackRoute, 
    router
  ]);

  // Show loading during initial auth check or while auth is loading
  if (companyLoading || userLoading || isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Check authentication based on required user type
  if (requiredUserType === 'company' && !isCompanyAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  
  if (requiredUserType === 'user' && !isUserAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  
  // If no specific type required, check for any authentication
  if (!requiredUserType && !isCompanyAuthenticated && !isUserAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
