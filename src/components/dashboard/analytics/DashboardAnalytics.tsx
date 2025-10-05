'use client';

import React, { useEffect } from 'react';

import { useCompanyAnalytics } from '@/hooks/company/useCompanyAnalytics';
import StatsCard from '@/components/dashboard/StatsCard';
import MessagesChart from './MessagesChart';
import ChatsChart from './ChatsChart';
import { Icons } from '@/components/ui';
import Card from '@/components/ui/Card';
import type { DashboardAnalyticsProps } from '@/interfaces/Analytics.interface';

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ className = "" }) => {
  const { dashboard, loading, error, loadDashboardAnalytics } = useCompanyAnalytics();

  useEffect(() => {
    loadDashboardAnalytics();
  }, [loadDashboardAnalytics]);

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-6 text-center">
          <div className="text-error-600 mb-2">
            <Icons.AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Failed to Load Analytics
          </h3>
          <p className="text-text-secondary mb-4">{typeof error === 'string' ? error : 'An error occurred while loading analytics.'}</p>
          <button 
            onClick={() => loadDashboardAnalytics()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Icons.MessageCircle className="h-5 w-5 text-white" />
              </div>
              {!loading && dashboard?.overview.totalMessages.change && (
                <div className={`flex items-center text-sm font-medium ${
                  dashboard.overview.totalMessages.change.type === 'increase' 
                    ? 'text-success-600' 
                    : dashboard.overview.totalMessages.change.type === 'decrease'
                    ? 'text-error-600'
                    : 'text-neutral-600'
                }`}>
                  {dashboard.overview.totalMessages.change.value}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900">
                {loading ? '...' : (dashboard?.overview.totalMessages.count || 0).toLocaleString()}
              </p>
              <p className="text-sm font-medium text-neutral-700">Total Messages</p>
              <p className="text-xs text-neutral-600">Last 7 days</p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-success-50 to-success-100 border-success-200 hover:shadow-lg hover:shadow-success-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 to-success-600/10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-lg">
                <Icons.Users className="h-5 w-5 text-white" />
              </div>
              {!loading && dashboard?.overview.users.change && (
                <div className={`flex items-center text-sm font-medium ${
                  dashboard.overview.users.change.type === 'increase' 
                    ? 'text-success-600' 
                    : dashboard.overview.users.change.type === 'decrease'
                    ? 'text-error-600'
                    : 'text-neutral-600'
                }`}>
                  {dashboard.overview.users.change.value}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900">
                {loading ? '...' : (dashboard?.overview.users.count || 0).toLocaleString()}
              </p>
              <p className="text-sm font-medium text-neutral-700">New Users</p>
              <p className="text-xs text-neutral-600">Registered users</p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200 hover:shadow-lg hover:shadow-warning-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-warning-500/5 to-warning-600/10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl shadow-lg">
                <Icons.MessageSquare className="h-5 w-5 text-white" />
              </div>
              {!loading && dashboard?.overview.totalChats.change && (
                <div className={`flex items-center text-sm font-medium ${
                  dashboard.overview.totalChats.change.type === 'increase' 
                    ? 'text-success-600' 
                    : dashboard.overview.totalChats.change.type === 'decrease'
                    ? 'text-error-600'
                    : 'text-neutral-600'
                }`}>
                  {dashboard.overview.totalChats.change.value}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900">
                {loading ? '...' : (dashboard?.overview.totalChats.count || 0).toLocaleString()}
              </p>
              <p className="text-sm font-medium text-neutral-700">Total Chats</p>
              <p className="text-xs text-neutral-600">Last 7 days</p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 border-neutral-200 hover:shadow-lg hover:shadow-neutral-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-neutral-600/10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-xl shadow-lg">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
              {!loading && dashboard?.overview.knowledgeBases.change && (
                <div className={`flex items-center text-sm font-medium ${
                  dashboard.overview.knowledgeBases.change.type === 'increase' 
                    ? 'text-success-600' 
                    : dashboard.overview.knowledgeBases.change.type === 'decrease'
                    ? 'text-error-600'
                    : 'text-neutral-600'
                }`}>
                  {dashboard.overview.knowledgeBases.change.value}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900">
                {loading ? '...' : (dashboard?.overview.knowledgeBases.count || 0).toLocaleString()}
              </p>
              <p className="text-sm font-medium text-neutral-700">Knowledge Bases</p>
              <p className="text-xs text-neutral-600">Last 7 days</p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-error-50 to-error-100 border-error-200 hover:shadow-lg hover:shadow-error-500/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-error-500/5 to-error-600/10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-br from-error-500 to-error-600 rounded-xl shadow-lg">
                <Icons.UserX className="h-5 w-5 text-white" />
              </div>
              {!loading && dashboard?.overview.guestSessions.change && (
                <div className={`flex items-center text-sm font-medium ${
                  dashboard.overview.guestSessions.change.type === 'increase' 
                    ? 'text-success-600' 
                    : dashboard.overview.guestSessions.change.type === 'decrease'
                    ? 'text-error-600'
                    : 'text-neutral-600'
                }`}>
                  {dashboard.overview.guestSessions.change.value}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900">
                {loading ? '...' : (dashboard?.overview.guestSessions.count || 0).toLocaleString()}
              </p>
              <p className="text-sm font-medium text-neutral-700">Guest Sessions</p>
              <p className="text-xs text-neutral-600">Last 7 days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <MessagesChart 
            data={dashboard?.timeSeries.messagesOverTime || []}
            loading={loading}
            className="shadow-lg shadow-primary-500/5 border-primary-200/50"
          />
        </div>
        <div>
          <ChatsChart 
            data={dashboard?.timeSeries.chatsOverTime || []}
            loading={loading}
            className="shadow-lg shadow-success-500/5 border-success-200/50"
          />
        </div>
      </div>

    </div>
  );
};

export default DashboardAnalytics;
