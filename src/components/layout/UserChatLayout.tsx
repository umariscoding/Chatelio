'use client';

import React from 'react';

import type { UserChatLayoutProps } from '@/interfaces/UserChatLayout.interface';

const UserChatLayout: React.FC<UserChatLayoutProps> = ({ 
  children,
  user,
  company 
}) => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="flex h-screen">
        {/* Main content area - full width for user chat */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserChatLayout;
