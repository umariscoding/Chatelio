'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCompanyAppSelector, useCompanyAppDispatch } from '@/hooks/company/useCompanyAuth';
import { logoutCompanyComprehensive } from '@/store/company/slices/companyAuthSlice';
import { Icons } from '@/components/ui';
import MinimalButton from '@/components/ui/MinimalButton';
import IOSLoader from '@/components/ui/IOSLoader';
import type { HeaderProps } from '@/interfaces/Header.interface';

const LogoutButton: React.FC = () => {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const dispatch = useCompanyAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Company logout: Clear company data (knowledge base, analytics, etc.)
      await dispatch(logoutCompanyComprehensive());
      router.push('/company/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <MinimalButton
      onClick={handleLogout}
      variant="outline"
      size="sm"
      disabled={isLoggingOut}
      className="text-secondary-300 border-secondary-600 hover:border-primary-500 hover:bg-primary-600/10 hover:text-primary-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isLoggingOut ? (
          <IOSLoader size="sm" color="primary" className="mr-2" />
      ) : (
        <>
          <Icons.Logout className="h-4 w-4 mr-2" />
          Logout
        </>
      )}
    </MinimalButton>
  );
};

const Header: React.FC<HeaderProps> = ({ 
  className = "", 
  onMenuToggle,
  showMobileMenuButton = true 
}) => {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);

  // Get first name from company name
  const getFirstName = () => {
    if (companyAuth.isAuthenticated && companyAuth.company?.name) {
      // Extract first word from company name
      return companyAuth.company.name.split(' ')[0];
    }
    return 'Company';
  };

  return (
    <header className={`bg-secondary-900 shadow-sm border-b border-secondary-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {showMobileMenuButton && (
              <button
                onClick={onMenuToggle}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-secondary-50 hover:text-secondary-50 hover:bg-secondary-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <Icons.Menu />
              </button>
            )}
            <div className="flex-shrink-0 ml-4 md:ml-0">
              <h1 className="text-xl font-semibold text-secondary-50">
                Hi, <span className="text-primary-400">{getFirstName()}</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
