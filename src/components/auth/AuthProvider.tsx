'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAuth';
import { loadTokensFromStorage } from '@/store/slices/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load tokens from localStorage on app start
    dispatch(loadTokensFromStorage());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
