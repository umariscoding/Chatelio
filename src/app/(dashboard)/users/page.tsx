'use client';

import React, { useState, useEffect } from 'react';

import { useAppSelector } from '@/hooks/useAuth';
import MinimalButton from '@/components/ui/MinimalButton';
import Card from '@/components/ui/Card';
import { Icons } from '@/components/ui';
import { API_ENDPOINTS } from '@/constants/api';

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
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<{ company_name?: string; total_users?: number } | null>(null);

  // Fetch company users
  const fetchUsers = async () => {
      if (!companyAuth.company?.company_id) {
        setError('Company information not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${API_ENDPOINTS.USERS.COMPANY_USERS}/${companyAuth.company.company_id}/users`, {
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
    if (companyAuth.company?.company_id && companyAuth.isAuthenticated) {
      fetchUsers();
    } else if (companyAuth.isAuthenticated && !companyAuth.company?.company_id) {
      // If we're a company user but don't have company data, wait for it to load
      setLoading(true);
    }
  }, [companyAuth.company?.company_id, companyAuth.isAuthenticated]);

  // Access control check - render this if not authorized
  if (!companyAuth.isAuthenticated) {
    return (
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-100">User Management</h1>
              <p className="mt-1 text-secondary-900">
                Access to user management is restricted to company accounts.
              </p>
            </div>
            
            <div className="text-center py-12">
              <Icons.Users className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-4 text-lg font-medium text-secondary-900">
                Access Restricted
              </h3>
              <p className="mt-2 text-secondary-400">
                Only company administrators can manage users.
              </p>
            </div>
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
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-100">User Management</h1>
              <p className="mt-1 text-secondary-400">
                Manage users who have access to your company's chatbot.
              </p>
            </div>
            <p className="text-lg text-secondary-900">Loading...</p>
          </div>
        </div>
    );
  }

  return (
        <div className="max-w-7xl mx-auto space-y-8 p-8">
          {/* Header */}
          <div className="text-center py-6">
            <h1 className="text-3xl font-bold text-secondary-100 mb-3">User Management</h1>
            <p className="text-secondary-500 mb-6">
              Manage users who have access to your company's chatbot.
              {companyData?.company_name && (
                <span className="ml-2 font-semibold text-primary-400">
                  ({companyData.company_name})
                </span>
              )}
            </p>
            <div className="flex justify-center items-center space-x-4">
              <MinimalButton 
                variant="secondary" 
                size="md"
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Icons.Refresh className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </MinimalButton>
              <MinimalButton variant="primary" size="md" className="flex items-center space-x-2">
                <Icons.Plus />
                <span>Invite User</span>
              </MinimalButton>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-error-50 border border-error-200 p-4 rounded-md">
              <div className="flex">
                <div className="flex-1">
                  <p className="text-sm text-error-600">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-error-400 hover:text-error-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            <Card className="shadow-lg text-center">
              <div className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-2xl bg-secondary-900">
                    <Icons.Users className="h-6 w-6 text-primary-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-secondary-100 mb-1">
                  {companyData?.total_users || users.length}
                </p>
                <p className="text-sm font-medium text-secondary-300">Total Users</p>
              </div>
            </Card>
            
            <Card className="shadow-lg text-center">
              <div className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-2xl bg-success-800">
                    <div className="h-6 w-6 rounded-full bg-success-600 flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-secondary-100 mb-1">
                  {users.filter(user => user.status === 'active' || user.is_active === true).length}
                </p>
                <p className="text-sm font-medium text-secondary-300">Active Users</p>
              </div>
            </Card>
            
            <Card className="shadow-lg text-center">
              <div className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-2xl bg-secondary-900">
                    <Icons.User className="h-6 w-6 text-secondary-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-secondary-100 mb-1">
                  {users.filter(user => {
                    const userDate = new Date(user.created_at);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-sm font-medium text-secondary-300">New This Month</p>
              </div>
            </Card>
          </div>

          {/* Users List */}
          <Card className="shadow-lg">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-secondary-100 mb-6 text-center">Company Users</h3>
              
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Icons.Users className="mx-auto h-12 w-12 mb-4 text-secondary-400" />
                  <h3 className="text-lg font-medium text-secondary-100 mb-2">No Users Yet</h3>
                  <p className="text-sm text-secondary-300 mb-4">
                    Users who sign up for your chatbot will appear here.
                  </p>
                  <MinimalButton variant="primary" size="md">
                    Share Your Chatbot URL
                  </MinimalButton>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-secondary-900 ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-secondary-300">
                    <thead className="bg-secondary-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-200 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-200 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-200 uppercase tracking-wider">
                          Joined
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-200 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-secondary-50 divide-y divide-secondary-200">
                      {users.map((user) => (
                        <tr 
                          key={user.user_id || user.id || user.email} 
                          className="hover:bg-secondary-100"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-secondary-200 flex items-center justify-center">
                                  <Icons.User className="h-5 w-5 text-secondary-400" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-secondary-900">{user.name}</div>
                                <div className="text-sm text-secondary-600">{user.email}</div>
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
                                    ? 'bg-secondary-800 text-primary-400' 
                                    : 'bg-secondary-800 text-secondary-400'
                                }`}>
                                  {statusText}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                            {formatLastLogin(user.last_login)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-700">
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
