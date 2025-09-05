'use client';

import React from 'react';
import Link from 'next/link';

import { useAppSelector } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import RecentActivity from '@/components/dashboard/RecentActivity';

// Icons for stats
const ChatIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);


const CogIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function DashboardPage() {
  const { user, company, activeSession } = useAppSelector((state) => state.auth);

  const displayName = activeSession === 'company' 
    ? company?.name || 'Company' 
    : user?.name || 'User';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {displayName}
        </h1>
        <p className="mt-2 text-gray-600">
          {activeSession === 'company' 
            ? 'Manage your chatbot, knowledge base, and team members from your dashboard.' 
            : 'Access your team\'s chatbot and view your conversation history.'
          }
        </p>
      </div>

      {/* Quick Actions Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activeSession === 'company' ? (
          <>
            
            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Knowledge Base</h3>
                    <p className="text-sm text-gray-600">Upload and manage your documents</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/knowledge-base">
                    <Button className="w-full" variant="outline">
                      Manage Documents
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CogIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Chatbot Settings</h3>
                    <p className="text-sm text-gray-600">Configure and publish your chatbot</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/settings">
                    <Button className="w-full" variant="outline">
                      Open Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Start Chatting</h3>
                    <p className="text-sm text-gray-600">Begin a new conversation with AI</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/chat">
                    <Button className="w-full" variant="primary">
                      New Chat
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Chat History</h3>
                    <p className="text-sm text-gray-600">View your previous conversations</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/chat">
                    <Button className="w-full" variant="outline">
                      View History
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                    <p className="text-sm text-gray-600">Manage your account settings</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/profile">
                    <Button className="w-full" variant="outline">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Account Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {activeSession === 'company' ? 'Company Info' : 'Account Info'}
              </h3>
              <div className="space-y-3">
                {activeSession === 'company' && company && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Company:</span>
                      <p className="text-sm text-gray-900">{company.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <p className="text-sm text-gray-900">{company.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Plan:</span>
                      <p className="text-sm text-gray-900 capitalize">{company.plan}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        company.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.status}
                      </span>
                    </div>
                    {company.slug && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Public URL:</span>
                        <p className="text-sm text-blue-600 break-all">{typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/{company.slug}</p>
                      </div>
                    )}
                  </>
                )}
                {activeSession === 'user' && user && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <p className="text-sm text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <p className="text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Role:</span>
                      <p className="text-sm text-gray-900">Team Member</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
