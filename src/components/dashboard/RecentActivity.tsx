'use client';

import React from 'react';

import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import type { RecentActivityProps, ActivityItemProps, ActivityItem } from '@/interfaces/RecentActivity.interface';

// Activity type icons
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

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'chat':
      return ChatIcon;
    case 'document':
      return DocumentIcon;
    case 'user':
      return UserIcon;
    case 'settings':
      return CogIcon;
    default:
      return ChatIcon;
  }
};

const getActivityIconColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'chat':
      return 'bg-blue-50 text-blue-600';
    case 'document':
      return 'bg-green-50 text-green-600';
    case 'user':
      return 'bg-purple-50 text-purple-600';
    case 'settings':
      return 'bg-gray-50 text-gray-600';
    default:
      return 'bg-blue-50 text-blue-600';
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString();
};

const ActivityItemComponent: React.FC<ActivityItemProps> = ({ activity, className = "" }) => {
  const Icon = getActivityIcon(activity.type);
  const iconColorClass = getActivityIconColor(activity.type);

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className={`flex-shrink-0 p-2 rounded-full ${iconColorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.title}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {activity.description}
        </p>
        {activity.user && (
          <p className="text-xs text-gray-400 mt-1">
            by {activity.user.name}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-xs text-gray-400">
        {formatTimeAgo(activity.timestamp)}
      </div>
    </div>
  );
};

// Sample activity data generator
const generateSampleActivities = (): ActivityItem[] => [
  {
    id: '1',
    type: 'chat',
    title: 'New chat started',
    description: 'User started a conversation about product features',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: '2',
    type: 'document',
    title: 'Document uploaded',
    description: 'company-info.pdf added to knowledge base',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: {
      name: 'Admin',
      email: 'admin@company.com',
    },
  },
  {
    id: '3',
    type: 'user',
    title: 'New user registered',
    description: 'jane.smith@company.com joined the team',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    user: {
      name: 'System',
      email: 'system@chatelio.com',
    },
  },
  {
    id: '4',
    type: 'settings',
    title: 'Company settings updated',
    description: 'Chatbot publish settings changed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    user: {
      name: 'Admin',
      email: 'admin@company.com',
    },
  },
  {
    id: '5',
    type: 'chat',
    title: 'Long conversation',
    description: 'Extended chat session about technical support',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    user: {
      name: 'Support User',
      email: 'support@company.com',
    },
  },
];

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  maxItems = 5,
  className = "",
  loading = false,
}) => {
  // Use sample data if no activities provided
  const displayActivities = activities || generateSampleActivities();
  const limitedActivities = displayActivities.slice(0, maxItems);

  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Activity
          </h3>
          {displayActivities.length > maxItems && (
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </button>
          )}
        </div>
        
        {limitedActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <ChatIcon className="mx-auto h-12 w-12" />
            </div>
            <p className="text-gray-500 text-sm">
              No recent activity to display
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {limitedActivities.map((activity, index) => (
              <ActivityItemComponent
                key={activity.id}
                activity={activity}
                className={index < limitedActivities.length - 1 ? 'pb-4 border-b border-gray-100' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;
