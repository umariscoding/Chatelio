'use client';

import React, { useState, useEffect } from 'react';

import { useAppSelector } from '@/hooks/useAuth';
import MinimalButton from '@/components/ui/MinimalButton';
import Card from '@/components/ui/Card';
import { Icons, IOSContentLoader } from '@/components/ui';

interface CompanyUser {
  user_id: string;
  email: string | null;
  name: string | null;
  is_anonymous: boolean;
  chat_count: number;
  message_count: number;
  created_at: string;
}

interface UsersApiResponse {
  users: CompanyUser[];
  total_users: number;
  total_chats: number;
  total_messages: number;
  company_id: string;
}

export default function UsersPage() {
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<UsersApiResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/company/analytics/users`, {
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

        const data: UsersApiResponse = await response.json();
        setUsers(data.users || []);
        setCompanyData(data);
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

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const name = user.is_anonymous ? 'anonymous user' : (user.name || '').toLowerCase();
    const email = user.is_anonymous ? '' : (user.email || '').toLowerCase();
    
    return name.includes(searchLower) || email.includes(searchLower);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset to first page when search term or users per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, usersPerPage]);

  // Generate pagination pages array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };



  if (loading) {
    return <IOSContentLoader isLoading={true} message="Loading users..." />;
  }

  return (
    <div className="space-y-8">

          {/* Error Display */}
          {error && (
        <div className="bg-gradient-to-r from-error-50 to-error-100 border border-error-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icons.AlertTriangle className="h-5 w-5 text-error-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-error-800">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
              className="text-error-400 hover:text-error-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/10"></div>
          <div className="relative p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Icons.Users className="h-6 w-6 text-white" />
                  </div>
                </div>
            <p className="text-2xl font-bold text-neutral-900 mb-1">
                  {companyData?.total_users || users.length}
                </p>
            <p className="text-sm font-medium text-neutral-700">Total Users</p>
              </div>
            </Card>
            
        <Card className="relative overflow-hidden bg-gradient-to-br from-success-50 to-success-100 border-success-200 hover:shadow-lg hover:shadow-success-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 to-success-600/10"></div>
          <div className="relative p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-lg">
                <Icons.MessageSquare className="h-6 w-6 text-white" />
                    </div>
                  </div>
            <p className="text-2xl font-bold text-neutral-900 mb-1">
              {companyData?.total_chats || 0}
            </p>
            <p className="text-sm font-medium text-neutral-700">Total Chats</p>
                </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200 hover:shadow-lg hover:shadow-warning-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-warning-500/5 to-warning-600/10"></div>
          <div className="relative p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl shadow-lg">
                <Icons.MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mb-1">
              {companyData?.total_messages || 0}
            </p>
            <p className="text-sm font-medium text-neutral-700">Total Messages</p>
              </div>
            </Card>
            
        <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 border-neutral-200 hover:shadow-lg hover:shadow-neutral-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-neutral-600/10"></div>
          <div className="relative p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-xl shadow-lg">
                <Icons.Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
            <p className="text-2xl font-bold text-neutral-900 mb-1">
                  {users.filter(user => {
                    const userDate = new Date(user.created_at);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
            <p className="text-sm font-medium text-neutral-700">New This Month</p>
              </div>
            </Card>
          </div>

      {/* Users List */}
      <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h3 className="text-xl font-semibold text-text-primary">
                Company Users 
                <span className="text-sm font-normal text-text-secondary ml-2">
                  ({filteredUsers.length} {searchTerm ? 'found' : 'total'})
                </span>
              </h3>
              {searchTerm && (
                <div className="text-sm text-text-secondary">
                  Showing results for "{searchTerm}"
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Box */}
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <Icons.Close className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Pagination Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary whitespace-nowrap">Show:</span>
                <select
                  value={usersPerPage}
                  onChange={(e) => setUsersPerPage(Number(e.target.value))}
                  className="border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mb-6">
                  <Icons.Users className="h-8 w-8 text-neutral-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {searchTerm ? 'No Users Found' : 'No Users Yet'}
              </h3>
              <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                {searchTerm 
                  ? `No users found matching "${searchTerm}". Try adjusting your search.`
                  : 'Users who sign up for your chatbot will appear here.'
                }
              </p>
            </div>
          ) : (
                <div className="overflow-hidden rounded-xl border border-border-light bg-white shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-light">
                  <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Name
                        </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Email
                        </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Chats
                        </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Messages
                        </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        Joined Date
                        </th>
                      </tr>
                    </thead>
                  <tbody className="bg-white divide-y divide-border-light">
                    {currentUsers.map((user, index) => (
                      <tr 
                        key={user.user_id} 
                        className="hover:bg-neutral-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">
                          {user.is_anonymous ? (
                            <span className="text-neutral-500 italic">Anonymous User</span>
                          ) : (
                            user.name || 'No Name'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {user.is_anonymous ? (
                            <span className="text-neutral-400 italic">Not provided</span>
                          ) : (
                            user.email || 'No Email'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                            {user.chat_count}
                          </span>
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                            {user.message_count}
                                </span>
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                            {formatDate(user.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {filteredUsers.length > 0 && totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-text-secondary">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  
                  <nav className="flex items-center space-x-1">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === 1
                          ? 'text-neutral-400 cursor-not-allowed'
                          : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <Icons.ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-neutral-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              currentPage === page
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>
                    
                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === totalPages
                          ? 'text-neutral-400 cursor-not-allowed'
                          : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      Next
                      <Icons.ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                    </button>
                  </nav>
                </div>
              )}
      </div>
    </div>
  );
}
