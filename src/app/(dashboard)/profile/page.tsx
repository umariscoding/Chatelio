"use client";

import React from "react";

import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { Icons, IOSContentLoader } from "@/components/ui";

export default function ProfilePage() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);

  // Company profile page
  const isCompanyUser = companyAuth.isAuthenticated;
  const isLoading = companyAuth.loading;

  const displayName = companyAuth.company?.name || "Company";

  if (isLoading) {
    return <IOSContentLoader isLoading={true} message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <Icons.User className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-success-500 rounded-full border-3 border-white"></div>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Profile
            </h1>
            <p className="text-lg text-neutral-600">
              Your {isCompanyUser ? "company" : "account"} information
            </p>
          </div>

          {/* Profile Information Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="group">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Icons.User className="h-4 w-4 text-primary-600" />
                  </div>
                  <label className="text-sm font-semibold text-neutral-700">
                    {isCompanyUser ? "Company Name" : "Full Name"}
                  </label>
                </div>
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4 border border-neutral-200 group-hover:shadow-sm transition-shadow">
                  <p className="text-neutral-900 font-medium">{displayName}</p>
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Icons.Globe className="h-4 w-4 text-primary-600" />
                  </div>
                  <label className="text-sm font-semibold text-neutral-700">
                    Email Address
                  </label>
                </div>
                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4 border border-neutral-200 group-hover:shadow-sm transition-shadow">
                  <p className="text-neutral-900 font-medium">
                    {companyAuth.company?.email}
                  </p>
                </div>
              </div>

              {/* Public URL Field (Company only) */}
              {isCompanyUser && companyAuth.company?.slug && (
                <div className="lg:col-span-2 group">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Icons.Globe className="h-4 w-4 text-primary-600" />
                    </div>
                    <label className="text-sm font-semibold text-neutral-700">
                      Public URL
                    </label>
                  </div>
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4 border border-neutral-200 group-hover:shadow-sm transition-shadow">
                    <p className="text-neutral-900 font-medium">
                      {companyAuth.company.slug}.chatelio.com
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
