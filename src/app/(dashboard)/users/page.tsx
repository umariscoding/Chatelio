'use client';

import React, { useState, useEffect } from 'react';

import { useAppSelector } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import { API_ENDPOINTS } from '@/constants/api';

// Icons
const UsersIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const RefreshIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface CompanyUser {
  user_id?: string;
  id?: string; // Backend might use 'id' instead of 'user_id'
  name: string;
  email: string;
  role?: string;
  status?: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
  is_active?: boolean; // Backend might use boolean instead of status string
}

export default function UsersPage() {
  const { activeSession, company, isCompanyAuthenticated } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<{ company_name?: string; total_users?: number } | null>(null);

  // Fetch company users
  const fetchUsers = async () => {
      if (!company?.company_id) {
        setError('Company information not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${API_ENDPOINTS.USERS.COMPANY_USERS}/${company.company_id}/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('company_access_token')}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Access denied: Only company admins can view user lists');
          } else if (response.status === 404) {
            throw new Error('Company not found');
          } else {
            throw new Error('Failed to fetch users');
          }
        }

        const data = await response.json();
        setUsers(data.users || []);
        setCompanyData({
          company_name: data.company_name,
          total_users: data.total_users,
        });
      } catch (error: any) {
        console.error('Failed to fetch users:', error);
        setError(error.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    // Only fetch if we have company data and are authenticated as company
    if (company?.company_id && activeSession === 'company' && isCompanyAuthenticated) {
      fetchUsers();
    } else if (activeSession === 'company' && isCompanyAuthenticated && !company?.company_id) {
      // If we're a company user but don't have company data, wait for it to load
      setLoading(true);
    }
  }, [company?.company_id, activeSession, isCompanyAuthenticated]);

  // Access control check - render this if not authorized
  if (activeSession !== 'company' || !isCompanyAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">
            Access to user management is restricted to company accounts.
          </p>
        </div>
        
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Access Restricted
          </h3>
          <p className="mt-2 text-gray-500">
            Only company administrators can manage users.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">
            Manage users who have access to your company's chatbot.
          </p>
        </div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">
            Manage users who have access to your company's chatbot.
            {companyData?.company_name && (
              <span className="ml-2 text-blue-600 font-medium">
                ({companyData.company_name})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshIcon className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <PlusIcon />
            <span>Invite User</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-lg font-semibold text-gray-900">
                  {companyData?.total_users || users.length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-lg font-semibold text-gray-900">
                  {users.filter(user => user.status === 'active' || user.is_active === true).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-500">New This Month</p>
                <p className="text-lg font-semibold text-gray-900">
                  {users.filter(user => {
                    const userDate = new Date(user.created_at);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Company Users</h3>
          
          {users.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Yet</h3>
              <p className="text-sm text-gray-600 mb-4">
                Users who sign up for your chatbot will appear here.
              </p>
              <Button variant="primary">
                Share Your Chatbot URL
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.user_id || user.id || user.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const isActive = user.status === 'active' || user.is_active === true;
                          const statusText = user.status || (user.is_active !== undefined ? (user.is_active ? 'active' : 'inactive') : 'unknown');
                          
                          return (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {statusText}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatLastLogin(user.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
