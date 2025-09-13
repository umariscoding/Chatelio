'use client';

import React, { useState } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAppSelector } from '@/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Optional: Handle page transition loading (disabled for faster navigation)
  // useEffect(() => {
  //   dispatch(setLoading({ key: 'pageTransition', loading: true }));
  //   
  //   const timer = setTimeout(() => {
  //     dispatch(setLoading({ key: 'pageTransition', loading: false }));
  //   }, 150);

  //   return () => clearTimeout(timer);
  // }, [pathname, dispatch]);


  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-page-bg">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={handleSidebarClose}
          />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header 
              onMenuToggle={handleMenuToggle}
              showMobileMenuButton={true}
            />
            
            {/* Main content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-page-bg">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
