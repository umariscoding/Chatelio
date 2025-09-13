'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { logout as logoutCompany } from '@/store/slices/companyAuthSlice';
import { logout as logoutUser } from '@/store/slices/userAuthSlice';
import { Icons } from '@/components/ui';
import type { HeaderProps, UserMenuProps, UserMenuItemProps } from '@/interfaces/Header.interface';



const UserMenuItem: React.FC<UserMenuItemProps> = ({ icon: Icon, label, onClick, className = "" }) => {
  const isLogout = label === 'Sign out';
  const baseClasses = "flex items-center px-4 py-2 text-sm w-full text-left";
  const colorClasses = isLogout 
    ? "text-error-700 hover:bg-secondary-700 hover:text-error-400"
    : "text-secondary-50 hover:bg-secondary-700 hover:text-secondary-50";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${colorClasses} ${className}`}
    >
      <Icon className="mr-3 h-4 w-4" />
      {label}
    </button>
  );
};

const UserMenu: React.FC<UserMenuProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push('/profile');
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    router.push('/settings');
  };

  const handleLogout = () => {
    setIsOpen(false);
    
    // Logout the appropriate session based on which auth is active
    if (companyAuth.isAuthenticated) {
      dispatch(logoutCompany());
      router.push('/company/login');
    } else if (userAuth.isAuthenticated) {
      dispatch(logoutUser());
      router.push('/');
    } else {
      router.push('/');
    }
  };

  // Determine which auth is active and get display info
  const isCompanyUser = companyAuth.isAuthenticated;
  const isRegularUser = userAuth.isAuthenticated;
  
  const displayName = isCompanyUser 
    ? companyAuth.company?.name || 'Company' 
    : userAuth.user?.name || 'User';
  
  const displayEmail = isCompanyUser 
    ? companyAuth.company?.email || '' 
    : userAuth.user?.email || '';

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center max-w-xs bg-secondary-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-secondary-700 flex items-center justify-center">
              <Icons.User className="h-5 w-5 text-secondary-50" />
            </div>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium text-secondary-50 truncate">
              {displayName}
            </p>
            <p className="text-xs text-secondary-400 truncate">
              {displayEmail}
            </p>
          </div>
          <Icons.ChevronDown className={`h-4 w-4 transition-transform text-secondary-50 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary-800 ring-1 ring-secondary-700 ring-opacity-50 z-50">
          <div className="py-1">
            <UserMenuItem
              icon={Icons.User}
              label="Profile"
              onClick={handleProfileClick}
            />
            <UserMenuItem
              icon={Icons.Settings}
              label="Settings"
              onClick={handleSettingsClick}
            />
            <hr className="my-1" />
            <UserMenuItem
              icon={Icons.Logout}
              label="Sign out"
              onClick={handleLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ 
  className = "", 
  onMenuToggle,
  showMobileMenuButton = true 
}) => {
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
                Chatelio Dashboard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
