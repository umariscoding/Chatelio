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
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
        current
          ? 'bg-secondary-800 text-primary-400'
          : 'text-secondary-50 hover:bg-secondary-800 hover:text-secondary-50'
      }`}
      prefetch={true}
      onClick={handleClick}
    >
      <Icon
        className={`mr-3 flex-shrink-0 h-5 w-5 ${
          current
            ? 'text-primary-400'
            : 'text-secondary-400 group-hover:text-secondary-50'
        }`}
      />
      {item.name}
      {item.badge && (
        <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-secondary-800 text-secondary-50">
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
          className="fixed inset-0 z-40 md:hidden bg-secondary-900 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-secondary-900 border-r border-secondary-700 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header area */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h2 className="text-lg font-semibold text-secondary-50">Chatelio</h2>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-md text-secondary-50 hover:text-secondary-50 hover:bg-secondary-800"
            >
              <Icons.Close className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {filteredSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="px-2 text-xs font-semibold text-secondary-50 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <div className={`space-y-1 ${section.title ? 'mt-2' : ''}`}>
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

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-secondary-700">
            <div className="text-xs text-secondary-50 text-center">
              Chatelio v1.0 - Phase 2
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
