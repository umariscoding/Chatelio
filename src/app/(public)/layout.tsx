'use client';

import React, { useEffect } from 'react';
import { UserReduxProvider } from '@/lib/user-redux-provider';
import { UserAuthProvider } from '@/components/auth/user/UserAuthProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="min-h-screen">
      <UserReduxProvider>
        <UserAuthProvider>
          {children}
        </UserAuthProvider>
      </UserReduxProvider>
    </div>
  );
}

