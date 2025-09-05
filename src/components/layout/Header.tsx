'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { logoutCompany, logoutUser } from '@/store/slices/authSlice';
import type { HeaderProps, UserMenuProps, UserMenuItemProps } from '@/interfaces/Header.interface';

// Icons (simple SVG components)
const UserIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CogIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const UserMenuItem: React.FC<UserMenuItemProps> = ({ icon: Icon, label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left ${className}`}
  >
    <Icon className="mr-3 h-4 w-4" />
    {label}
  </button>
);

const UserMenu: React.FC<UserMenuProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, company, activeSession } = useAppSelector((state) => state.auth);
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
    
    // Logout the appropriate session
    if (activeSession === 'company') {
      dispatch(logoutCompany());
      router.push('/company/login');
    } else if (activeSession === 'user') {
      dispatch(logoutUser());
      router.push('/user/login');
    } else {
      router.push('/');
    }
  };

  const displayName = activeSession === 'company' 
    ? company?.name || 'Company' 
    : user?.name || 'User';
  
  const displayEmail = activeSession === 'company' 
    ? company?.email || '' 
    : user?.email || '';

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center max-w-xs bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {displayEmail}
            </p>
          </div>
          <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <UserMenuItem
              icon={UserIcon}
              label="Profile"
              onClick={handleProfileClick}
            />
            <UserMenuItem
              icon={CogIcon}
              label="Settings"
              onClick={handleSettingsClick}
            />
            <hr className="my-1" />
            <UserMenuItem
              icon={LogoutIcon}
              label="Sign out"
              onClick={handleLogout}
              className="text-red-700 hover:bg-red-50 hover:text-red-900"
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
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {showMobileMenuButton && (
              <button
                onClick={onMenuToggle}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <MenuIcon />
              </button>
            )}
            <div className="flex-shrink-0 ml-4 md:ml-0">
              <h1 className="text-xl font-semibold text-gray-900">
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
