'use client';

import React, { useState, useEffect } from 'react';
import { CompanyReduxProvider } from '@/lib/company-redux-provider';
import { CompanyAuthProvider } from '@/components/auth/company/CompanyAuthProvider';
import { CompanyProtectedRoute } from '@/components/auth/company/CompanyProtectedRoute';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#0f172a';
    document.body.style.backgroundColor = '#0f172a';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <CompanyReduxProvider>
      <CompanyAuthProvider>
        <CompanyProtectedRoute>
          <div className="min-h-screen bg-sidebar-bg">
            <div className="flex min-h-screen">
              {/* Sidebar - Fixed/Sticky */}
              <div className="sticky top-0 self-start">
                <Sidebar 
                  isOpen={sidebarOpen} 
                  onClose={handleSidebarClose}
                />
              </div>
              
              {/* Main content area */}
              <div className="flex-1 bg-bg-secondary min-h-screen relative">
                {/* Thick border with pointy outside, rounded inside */}
                <div className="absolute inset-0 bg-sidebar-bg"></div>
                <div className="absolute inset-4 bg-bg-secondary rounded-xl overflow-y-auto smooth-scroll-container">
                  {/* Header */}
                  <Header 
                    onMenuToggle={handleMenuToggle}
                    showMobileMenuButton={true}
                  />
                  
                  {/* Main content */}
                  <main>
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </div>
        </CompanyProtectedRoute>
      </CompanyAuthProvider>
    </CompanyReduxProvider>
  );
}
