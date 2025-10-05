'use client';

import React, { useEffect, useState } from 'react';
import { useCompanyAppSelector, useCompanyAppDispatch } from '@/hooks/company/useCompanyAuth';
import { loadFromStorage, verifyCompanyToken } from '@/store/company/slices/companyAuthSlice';

interface CompanyAuthProviderProps {
  children: React.ReactNode;
}

export const CompanyAuthProvider: React.FC<CompanyAuthProviderProps> = ({ children }) => {
  const dispatch = useCompanyAppDispatch();
  const { tokens, isAuthenticated } = useCompanyAppSelector((state) => state.companyAuth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Load from storage first
      dispatch(loadFromStorage());

      // If we have tokens, verify them
      const storedToken = localStorage.getItem('company_access_token');
      if (storedToken) {
        try {
          await dispatch(verifyCompanyToken()).unwrap();
        } catch (error) {
          console.error('Company token verification failed:', error);
        }
      }

      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch]);

  // Show loading state until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

