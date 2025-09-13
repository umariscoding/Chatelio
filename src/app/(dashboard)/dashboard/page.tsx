"use client";

import React from "react";
import Link from "next/link";

import { useAppSelector } from "@/hooks/useAuth";
import MinimalButton from "@/components/ui/MinimalButton";
import Card from "@/components/ui/Card";
import { Icons } from "@/components/ui";

export default function DashboardPage() {
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);

  // Determine which auth is active and display name
  const isCompanyUser = companyAuth.isAuthenticated;
  const isRegularUser = userAuth.isAuthenticated;

  const displayName = isCompanyUser
    ? companyAuth.company?.name || "Company"
    : userAuth.user?.name || "User";

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-secondary-100 mb-3">
            Welcome back, {displayName}
          </h1>
          <p className="text-secondary-400 max-w-2xl mx-auto">
            {isCompanyUser
              ? "Manage your chatbot, knowledge base, and team members from your dashboard."
              : "Access your team's chatbot and view your conversation history."}
          </p>
        </div>

        {/* Quick Actions Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {isCompanyUser ? (
            <>
              <Card className="group hover:shadow-lg transition-all duration-200 border border-secondary-700 bg-secondary-800">
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-2xl bg-secondary-900 hover:bg-secondary-700 transition-colors">
                        <Icons.Document className="h-8 w-8 text-success-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-100 mb-2">
                      Knowledge Base
                    </h3>
                    <p className="text-sm text-secondary-300 mb-6">
                    Upload and manage your documents
                  </p>
                  <Link href="/knowledge-base">
                    <MinimalButton variant="secondary" size="md" fullWidth>
                      Manage Documents
                    </MinimalButton>
                  </Link>
                </div>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-200 border border-secondary-700 bg-secondary-800">
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-2xl bg-secondary-900 hover:bg-secondary-700 transition-colors">
                        <Icons.Settings className="h-8 w-8 text-primary-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-100 mb-2">
                      Settings
                    </h3>
                    <p className="text-sm text-secondary-300 mb-6">
                    Configure and publish your chatbot
                  </p>
                  <Link href="/settings">
                    <MinimalButton variant="secondary" size="md" fullWidth>
                      Open Settings
                    </MinimalButton>
                  </Link>
                </div>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-200 border border-secondary-700 bg-secondary-800">
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-primary-800 hover:bg-primary-700 transition-colors">
                      <Icons.User className="h-8 w-8 text-primary-400" />
                    </div>
                  </div>
                    <h3 className="text-xl font-semibold text-secondary-100 mb-2">
                      Users
                    </h3>
                    <p className="text-sm text-secondary-300 mb-6">
                    Manage team members and access
                  </p>
                  <Link href="/users">
                    <MinimalButton variant="secondary" size="md" fullWidth>
                      Manage Users
                    </MinimalButton>
                  </Link>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className="group hover:shadow-lg transition-all duration-200 border border-secondary-700 bg-secondary-800">
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-primary-800 hover:bg-primary-700 transition-colors">
                      <Icons.Chat className="h-8 w-8 text-primary-400" />
                    </div>
                  </div>
                    <h3 className="text-xl font-semibold text-secondary-100 mb-2">
                      Start Chatting
                    </h3>
                    <p className="text-sm text-secondary-300 mb-6">
                    Begin a new conversation with AI
                  </p>
                  <Link href="/chat">
                    <MinimalButton variant="primary" size="md" fullWidth>
                      New Chat
                    </MinimalButton>
                  </Link>
                </div>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-200 border border-secondary-700 bg-secondary-800">
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-2xl bg-secondary-900 hover:bg-secondary-700 transition-colors">
                        <Icons.Chat className="h-8 w-8 text-success-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-100 mb-2">
                      Chat History
                    </h3>
                    <p className="text-sm text-secondary-300 mb-6">
                    View your previous conversations
                  </p>
                  <Link href="/chat">
                    <MinimalButton variant="outline" size="md" fullWidth>
                      View History
                    </MinimalButton>
                  </Link>
                </div>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-200 border border-secondary-700 bg-secondary-800">
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-2xl bg-secondary-900 hover:bg-secondary-700 transition-colors">
                        <Icons.User className="h-8 w-8 text-primary-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-100 mb-2">
                      Profile
                    </h3>
                    <p className="text-sm text-secondary-300 mb-6">
                    Manage your account settings
                  </p>
                  <Link href="/profile">
                    <MinimalButton variant="outline" size="md" fullWidth>
                      Edit Profile
                    </MinimalButton>
                  </Link>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Account Info and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Company Info Card */}
          {isCompanyUser && (
            <div className="lg:col-span-1">
              <Card className="h-fit border border-secondary-700 bg-secondary-800">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-100 mb-6">
                    Company Overview
                  </h3>
                  {companyAuth.company && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-secondary-700">
                        <span className="text-sm font-medium text-secondary-300">
                          Company
                        </span>
                        <span className="text-sm font-medium text-secondary-100">
                          {companyAuth.company.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-secondary-700">
                        <span className="text-sm font-medium text-secondary-300">
                          Email
                        </span>
                        <span className="text-sm text-secondary-100">
                          {companyAuth.company.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-secondary-700">
                        <span className="text-sm font-medium text-secondary-300">
                          Plan
                        </span>
                        <span className="text-sm font-medium capitalize text-secondary-100">
                          {companyAuth.company.plan}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-secondary-700">
                        <span className="text-sm font-medium text-secondary-300">
                          Status
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            companyAuth.company.status === "active"
                              ? "bg-success-100 text-success-700"
                              : "bg-secondary-800 text-secondary-600"
                          }`}
                        >
                          {companyAuth.company.status}
                        </span>
                      </div>
                      {companyAuth.company.slug && (
                        <div className="pt-2">
                          <span className="text-sm font-medium text-secondary-300 block mb-2">
                            Public URL
                          </span>
                          <p className="text-xs text-primary-600 bg-primary-50 p-2 rounded border-secondary-200 break-all">
                            {typeof window !== "undefined"
                              ? window.location.origin
                              : "https://yoursite.com"}
                            /{companyAuth.company.slug}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
