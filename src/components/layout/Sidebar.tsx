'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAppSelector } from '@/hooks/useAuth';
import type { SidebarProps, NavigationItem, NavigationSection } from '@/interfaces/Sidebar.interface';

// Icons
const HomeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChatIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);


const CogIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);



const getNavigationSections = (): NavigationSection[] => [
  {
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
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
        icon: DocumentIcon,
        allowedUserTypes: ['company'],
      },
      {
        name: 'Users',
        href: '/users',
        icon: UserIcon,
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
        icon: CogIcon,
        allowedUserTypes: ['company'],
      },
      {
        name: 'Profile',
        href: '/profile',
        icon: UserIcon,
        allowedUserTypes: ['company', 'user'],
      },
    ],
  },
];

interface NavigationItemComponentProps {
  item: NavigationItem;
  current: boolean;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = ({ item, current }) => {
  const Icon = item.icon;
  
  return (
    <Link
      href={item.href}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
        current
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon
        className={`mr-3 flex-shrink-0 h-5 w-5 ${
          current
            ? 'text-blue-500'
            : 'text-gray-400 group-hover:text-gray-500'
        }`}
      />
      {item.name}
      {item.badge && (
        <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-600">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ className = "", isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { activeSession } = useAppSelector((state) => state.auth);
  const navigationSections = getNavigationSections();

  // Filter navigation items based on user type
  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        activeSession && item.allowedUserTypes.includes(activeSession)
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header area */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">Chatelio</h2>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {filteredSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <div className={`space-y-1 ${section.title ? 'mt-2' : ''}`}>
                  {section.items.map((item) => (
                    <NavigationItemComponent
                      key={item.name}
                      item={item}
                      current={pathname === item.href}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Chatelio v1.0 - Phase 2
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
