'use client';

import React from 'react';

import { useAppSelector } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const { user, company, userType } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to your {userType === 'company' ? 'Company' : 'Team'} Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {userType === 'company' 
            ? 'Manage your chatbot, knowledge base, and team members.' 
            : 'Access your team\'s chatbot and view your chat history.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* User Info Card */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {userType === 'company' ? 'Company Info' : 'User Info'}
            </h3>
            <div className="space-y-3">
              {userType === 'company' && company && (
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
                </>
              )}
              {userType === 'user' && user && (
                <>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-sm text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {userType === 'company' ? (
                <>
                  <Button className="w-full" variant="outline">
                    Manage Knowledge Base
                  </Button>
                  <Button className="w-full" variant="outline">
                    Chatbot Settings
                  </Button>
                  <Button className="w-full" variant="outline">
                    View Analytics
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" variant="outline">
                    Start New Chat
                  </Button>
                  <Button className="w-full" variant="outline">
                    View Chat History
                  </Button>
                  <Button className="w-full" variant="outline">
                    Profile Settings
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Status Card */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-900">Authentication: Active</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-900">API: Connected</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-900">Features: Phase 1 Complete</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Phase 1 Complete Banner */}
      <Card>
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                🎉 Phase 1 Authentication Complete!
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                You have successfully implemented company and user authentication with Redux state management. 
                Next phase will include the dashboard layout, knowledge base management, and chat interface.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
