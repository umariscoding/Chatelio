'use client';

import React from 'react';
import { UserReduxProvider } from '@/lib/user-redux-provider';
import { UserAuthProvider } from '@/components/auth/user/UserAuthProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserReduxProvider>
      <UserAuthProvider>
        {children}
      </UserAuthProvider>
    </UserReduxProvider>
  );
}

