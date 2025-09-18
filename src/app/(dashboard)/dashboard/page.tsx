"use client";

import React from "react";
import Link from "next/link";

import { useAppSelector } from "@/hooks/useAuth";
import MinimalButton from "@/components/ui/MinimalButton";
import Card from "@/components/ui/Card";
import { Icons, IOSContentLoader } from "@/components/ui";
import DashboardAnalytics from "@/components/dashboard/analytics/DashboardAnalytics";

export default function DashboardPage() {
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);

  // Determine which auth is active and display name
  const isCompanyUser = companyAuth.isAuthenticated;
  const isLoading = companyAuth.loading || userAuth.loading;

  const displayName = isCompanyUser
    ? companyAuth.company?.name || "Company"
    : userAuth.user?.name || "User";

  if (isLoading) {
    return <IOSContentLoader isLoading={true} message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-neutral-50 to-success-50 rounded-2xl border border-primary-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-success-500/5"></div>
        <div className="relative px-6 py-8 lg:px-8 lg:py-12 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Welcome back, <span className="bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">{displayName}</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            {isCompanyUser
              ? "Monitor your chatbot performance, user engagement, and knowledge base analytics with real-time insights."
              : "Access your team's chatbot and view your conversation history."}
          </p>
        </div>
      </div>

      {/* Analytics Dashboard - Only for Company Users */}
      {isCompanyUser ? (
        <DashboardAnalytics />
      ) : (
        <>
          {/* Quick Actions Cards for Regular Users */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-200">
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-primary-100 hover:bg-primary-200 transition-colors">
                    <Icons.Chat className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Start Chatting
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Begin a new conversation with AI
                </p>
                <Link href="/chat">
                  <MinimalButton variant="primary" size="md" fullWidth>
                    New Chat
                  </MinimalButton>
                </Link>
              </div>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200">
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-success-100 hover:bg-success-200 transition-colors">
                    <Icons.Chat className="h-8 w-8 text-success-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Chat History
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  View your previous conversations
                </p>
                <Link href="/chat">
                  <MinimalButton variant="outline" size="md" fullWidth>
                    View History
                  </MinimalButton>
                </Link>
              </div>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200">
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors">
                    <Icons.User className="h-8 w-8 text-neutral-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Profile
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Manage your account settings
                </p>
                <Link href="/profile">
                  <MinimalButton variant="outline" size="md" fullWidth>
                    Edit Profile
                  </MinimalButton>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}

    </div>
  );
}
