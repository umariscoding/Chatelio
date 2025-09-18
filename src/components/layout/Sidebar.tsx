'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAppSelector } from '@/hooks/useAuth';
import { Icons } from '@/components/ui';
import type { SidebarProps, NavigationItem, NavigationSection } from '@/interfaces/Sidebar.interface';



const getNavigationSections = (): NavigationSection[] => [
  {
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Icons.Home,
        allowedUserTypes: ['company', 'user'],
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        name: 'Knowledge Base',
        href: '/knowledge-base',
        icon: Icons.Document,
        allowedUserTypes: ['company'],
      },
      {
        name: 'Users',
        href: '/users',
        icon: Icons.User,
        allowedUserTypes: ['company'],
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'Company Settings',
        href: '/settings',
        icon: Icons.Settings,
        allowedUserTypes: ['company'],
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: Icons.User,
        allowedUserTypes: ['company', 'user'],
      },
    ],
  },
];

interface NavigationItemComponentProps {
  item: NavigationItem;
  current: boolean;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps & { onNavigate?: () => void }> = ({ item, current, onNavigate }) => {
  const Icon = item.icon;
  
  const handleClick = () => {
    // Close mobile sidebar on navigation
    if (onNavigate) {
      onNavigate();
    }
  };
  
  return (
    <Link
      href={item.href}
      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative ${
        current
          ? 'bg-primary-500/20 text-primary-400 shadow-sm border border-primary-500/30'
          : 'text-auth-300 hover:bg-auth-800 hover:text-auth-100'
      }`}
      prefetch={true}
      onClick={handleClick}
    >
      {current && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full" />
      )}
      <Icon
        className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
          current
            ? 'text-primary-400'
            : 'text-auth-400 group-hover:text-auth-200'
        }`}
      />
      <span className="truncate">{item.name}</span>
      {item.badge && (
        <span className="ml-auto inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500/20 text-primary-400">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ className = "", isOpen = true, onClose }) => {
  const pathname = usePathname();
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);
  const navigationSections = getNavigationSections();

  // Determine current user type
  const currentUserType = companyAuth.isAuthenticated ? 'company' : userAuth.isAuthenticated ? 'user' : null;
  
  // Filter navigation items based on user type
  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        currentUserType && item.allowedUserTypes.includes(currentUserType)
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-neutral-900/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className="relative">
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-auth-900 transform transition-all duration-300 ease-in-out shadow-2xl
            md:relative md:translate-x-0 md:z-0 md:min-h-screen
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            ${className}
          `}
        >
        <div className="flex flex-col h-full">
          {/* Logo/Header area */}
          <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-auth-800">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-auth-50">Chatelio</h2>
                <p className="text-xs text-auth-400">AI Dashboard</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg text-auth-400 hover:text-auth-200 hover:bg-auth-800 transition-colors"
            >
              <Icons.Close className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-auth-700 scrollbar-track-transparent">
            {filteredSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                {section.title && (
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-auth-500 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavigationItemComponent
                      key={item.name}
                      item={item}
                      current={pathname === item.href}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

        </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
