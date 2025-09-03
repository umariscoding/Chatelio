'use client';

import React, { useEffect } from 'react';
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
  const { isAuthenticated, userType, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(fallbackRoute);
        return;
      }

      if (requiredUserType && userType !== requiredUserType) {
        // Redirect based on user type
        if (userType === 'company') {
          router.push(ROUTES.DASHBOARD);
        } else if (userType === 'user') {
          router.push(ROUTES.CHAT);
        } else {
          router.push(fallbackRoute);
        }
        return;
      }
    }
  }, [isAuthenticated, userType, loading, requiredUserType, fallbackRoute, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
