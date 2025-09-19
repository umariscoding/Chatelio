'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/APP_CONSTANTS';
import IOSLoader from '@/components/ui/IOSLoader';
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
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize before making routing decisions
    if (!companyAuth.loading && !userAuth.loading) {
      setIsInitialLoad(false);
      
      // Check if user needs company access
      if (requiredUserType === 'company') {
        if (!companyAuth.isAuthenticated) {
          router.push(ROUTES.COMPANY_LOGIN);
          return;
        }
      }
      
      // Check if user needs user access  
      if (requiredUserType === 'user') {
        if (!userAuth.isAuthenticated) {
          // Users can only authenticate through company chatbot pages, redirect to home
          router.push(ROUTES.HOME);
          return;
        }
      }
      
      // If no specific type required, check for any authentication
      if (!requiredUserType) {
        if (!companyAuth.isAuthenticated && !userAuth.isAuthenticated) {
          router.push(fallbackRoute);
          return;
        }
      }
      
      // Handle wrong user type redirects
      if (requiredUserType && requiredUserType === 'company' && !companyAuth.isAuthenticated) {
        if (userAuth.isAuthenticated) {
          router.push(ROUTES.CHAT); // Redirect user to their area
        } else {
          router.push(ROUTES.COMPANY_LOGIN);
        }
        return;
      }
      
      if (requiredUserType && requiredUserType === 'user' && !userAuth.isAuthenticated) {
        if (companyAuth.isAuthenticated) {
          router.push(ROUTES.DASHBOARD); // Redirect company to their area
        } else {
          // Users can only authenticate through company chatbot pages, redirect to home
          router.push(ROUTES.HOME);
        }
        return;
      }
    }
  }, [
    companyAuth.isAuthenticated, 
    userAuth.isAuthenticated, 
    companyAuth.loading, 
    userAuth.loading, 
    requiredUserType, 
    fallbackRoute, 
    router
  ]);

  // Show loading during initial auth check or while auth is loading
  if (companyAuth.loading || userAuth.loading || isInitialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <IOSLoader size="xl" color="primary" className="mx-auto mb-4" />
        </div>
      </div>
    );
  }

  // Check authentication based on required user type
  if (requiredUserType === 'company' && !companyAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <IOSLoader size="xl" color="primary" className="mx-auto mb-4" />
        </div>
      </div>
    );
  }
  
  if (requiredUserType === 'user' && !userAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <IOSLoader size="xl" color="primary" className="mx-auto mb-4" />
        </div>
      </div>
    );
  }
  
  // If no specific type required, check for any authentication
  if (!requiredUserType && !companyAuth.isAuthenticated && !userAuth.isAuthenticated) {
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

export default ProtectedRoute;
