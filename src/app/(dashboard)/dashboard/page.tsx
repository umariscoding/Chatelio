"use client";

import React from "react";
import Link from "next/link";

import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import MinimalButton from "@/components/ui/MinimalButton";
import Card from "@/components/ui/Card";
import { Icons, IOSContentLoader } from "@/components/ui";
import DashboardAnalytics from "@/components/dashboard/analytics/DashboardAnalytics";

export default function DashboardPage() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);

  // Company dashboard
  const isCompanyUser = companyAuth.isAuthenticated;
  const isLoading = companyAuth.loading;

  const displayName = companyAuth.company?.name || "Company";

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

      {/* Analytics Dashboard - Company Dashboard */}
      <DashboardAnalytics />

    </div>
  );
}
