'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { loadTokensFromStorage, verifyCompanyToken, verifyUserToken, setActiveSessionCompany, setActiveSessionUser } from '@/store/slices/authSlice';
import Loading from '@/components/ui/Loading';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { 
    isCompanyAuthenticated, 
    isUserAuthenticated, 
    companyLoading, 
    userLoading, 
    activeSession 
  } = useAppSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Load tokens from localStorage first
      dispatch(loadTokensFromStorage());
      
      // Check which tokens we have and verify them
      const companyToken = localStorage.getItem('company_access_token');
      const userToken = localStorage.getItem('user_access_token');
      const storedActiveSession = localStorage.getItem('active_session');
      
      try {
        // Verify company token if available
        if (companyToken) {
          dispatch(setActiveSessionCompany());
          await dispatch(verifyCompanyToken()).unwrap();
        }
        
        // Verify user token if available
        if (userToken) {
          dispatch(setActiveSessionUser());
          await dispatch(verifyUserToken()).unwrap();
        }
        
        // If we have a stored active session, set it
        if (storedActiveSession === 'company' && companyToken) {
          dispatch(setActiveSessionCompany());
        } else if (storedActiveSession === 'user' && userToken) {
          dispatch(setActiveSessionUser());
        }
        
      } catch (error) {
        console.error('Token verification failed:', error);
        // Token verification will clear invalid tokens automatically
      }
      
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading while initializing auth state
  if (isInitializing || companyLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
