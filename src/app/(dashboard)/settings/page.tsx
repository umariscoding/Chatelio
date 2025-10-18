"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  publishChatbot,
  updateChatbotInfo,
  updateCompanySlug,
  clearError,
} from "@/store/company/slices/companySlice";
import { updateCompanyInfo } from "@/store/company/slices/companyAuthSlice";
import { Toggle, Icons, IOSContentLoader } from "@/components/ui";
import MinimalInput from "@/components/ui/MinimalInput";
import MinimalButton from "@/components/ui/MinimalButton";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const { publicUrl, loading, error } = useCompanyAppSelector(
    (state) => state.company,
  );

  const [publishData, setPublishData] = useState({
    isPublished: companyAuth.company?.is_published || false,
    chatbotTitle:
      companyAuth.company?.chatbot_title || companyAuth.company?.name || "",
    chatbotDescription:
      companyAuth.company?.chatbot_description ||
      "Get help with our services and products",
  });

  const [slugData, setSlugData] = useState({
    slug: companyAuth.company?.slug || "",
  });

  const [showSlugSuccess, setShowSlugSuccess] = useState(false);

  // Initialize component data
  useEffect(() => {
    if (companyAuth.company) {
      setPublishData({
        isPublished: companyAuth.company.is_published || false,
        chatbotTitle:
          companyAuth.company.chatbot_title || companyAuth.company.name || "",
        chatbotDescription:
          companyAuth.company.chatbot_description ||
          "Get help with our services and products",
      });
      setSlugData({
        slug: companyAuth.company.slug || "",
      });
      setShowSlugSuccess(false);
    }
  }, [companyAuth.company]);

  const handlePublishToggle = async (checked: boolean) => {
    try {
      dispatch(clearError());

      const result = await dispatch(
        publishChatbot({
          is_published: checked,
        }),
      ).unwrap();

      setPublishData((prev) => ({ ...prev, isPublished: checked }));

      // Update auth slice with new publish status
      if (companyAuth.company) {
        const updatedCompany = {
          ...companyAuth.company,
          is_published: result.is_published,
        };
        dispatch(updateCompanyInfo(updatedCompany));
      }
    } catch (error: any) {
      console.error("Failed to toggle publish status:", error);
      // Revert toggle on error
      setPublishData((prev) => ({ ...prev, isPublished: !checked }));
    }
  };

  const handleUpdateChatbotInfo = async () => {
    try {
      dispatch(clearError());

      const result = await dispatch(
        updateChatbotInfo({
          chatbot_title: publishData.chatbotTitle,
          chatbot_description: publishData.chatbotDescription,
        }),
      ).unwrap();

      // Update auth slice with new chatbot info
      if (companyAuth.company) {
        const updatedCompany = {
          ...companyAuth.company,
          chatbot_title: result.chatbot_title,
          chatbot_description: result.chatbot_description,
        };
        dispatch(updateCompanyInfo(updatedCompany));
      }
    } catch (error: any) {
      console.error("Failed to update chatbot info:", error);
    }
  };

  const handleUpdateSlug = async () => {
    if (!slugData.slug.trim()) {
      alert("Please enter a valid slug");
      return;
    }

    try {
      dispatch(clearError());

      const result = await dispatch(
        updateCompanySlug({
          slug: slugData.slug.trim().toLowerCase(),
        }),
      ).unwrap();

      // Update auth slice with new slug
      if (companyAuth.company) {
        const updatedCompany = { ...companyAuth.company, slug: result.slug };
        dispatch(updateCompanyInfo(updatedCompany));
      }

      // Show success message temporarily
      setShowSlugSuccess(true);
      setTimeout(() => setShowSlugSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to update slug:", error);
      alert(error || "Failed to update slug. Please try again.");
    }
  };

  const handleVisitPublicChatbot = () => {
    if (companyAuth.company?.slug && typeof window !== "undefined") {
      const publicChatbotUrl = `${window.location.origin}/${companyAuth.company.slug}`;
      window.open(publicChatbotUrl, "_blank");
    }
  };

  // Check if page is loading
  if (companyAuth.loading) {
    return <IOSContentLoader isLoading={true} message="Loading settings..." />;
  }

  if (!companyAuth.isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
            <p className="mt-1 text-secondary-700">
              Settings access is restricted to company accounts.
            </p>
          </div>

          <div className="text-center py-12">
            <Icons.Settings className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-4 text-lg font-medium text-secondary-900">
              Access Restricted
            </h3>
            <p className="mt-2 text-secondary-400">
              Only company administrators can access settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-6 py-2">
          Settings
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Configure your chatbot and manage public access settings
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 bg-error-50 border-l-4 border-error-500 rounded-r-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.AlertCircle className="h-5 w-5 text-error-500 mr-3" />
              <p className="text-sm text-error-700 font-medium">
                {typeof error === "string"
                  ? error
                  : "An error occurred. Please try again."}
              </p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-error-400 hover:text-error-600 transition-colors"
            >
              <Icons.Close className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Grid */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row - Company URL & Chatbot Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 lg:h-96">
          {/* Company URL */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-xl">
                <Icons.Globe className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">
                Company URL
              </h2>
            </div>

            <div className="flex flex-col flex-1">
              <div className="space-y-5 flex-1">
                <MinimalInput
                  label="Company Slug"
                  value={slugData.slug}
                  onChange={(e) => setSlugData({ slug: e.target.value })}
                  placeholder="your-company-name"
                  variant="floating"
                  theme="light"
                />
                <p className="text-sm text-text-secondary flex items-center space-x-2">
                  <Icons.AlertCircle className="h-4 w-4 text-primary-500" />
                  <span>Lowercase letters, numbers, and hyphens only</span>
                </p>

                {showSlugSuccess && (
                  <div className="bg-gradient-to-r from-success-50 to-emerald-50 p-4 rounded-xl border border-success-200">
                    <div className="flex items-center space-x-2">
                      <Icons.CheckCircle className="h-5 w-5 text-success-600" />
                      <span className="text-success-800 font-medium">
                        Slug updated successfully!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <MinimalButton
                onClick={handleUpdateSlug}
                loading={loading}
                disabled={
                  !slugData.slug.trim() ||
                  slugData.slug === companyAuth.company?.slug
                }
                variant="primary"
                size="md"
                fullWidth={true}
                className="mt-5"
              >
                Update Slug
              </MinimalButton>
            </div>
          </div>

          {/* Chatbot Details */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-xl">
                <Icons.Edit className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">
                Chatbot Details
              </h2>
            </div>

            <div className="flex flex-col flex-1">
              <div className="space-y-5 flex-1">
                <MinimalInput
                  label="Chatbot Title"
                  value={publishData.chatbotTitle}
                  onChange={(e) =>
                    setPublishData((prev) => ({
                      ...prev,
                      chatbotTitle: e.target.value,
                    }))
                  }
                  placeholder="Customer Support Assistant"
                  variant="floating"
                  theme="light"
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Description
                  </label>
                  <textarea
                    value={publishData.chatbotDescription}
                    onChange={(e) =>
                      setPublishData((prev) => ({
                        ...prev,
                        chatbotDescription: e.target.value,
                      }))
                    }
                    placeholder="Brief description of what your chatbot can help with..."
                    rows={4}
                    className="w-full rounded-xl border border-border-medium bg-white/80 text-text-primary placeholder-text-placeholder px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none backdrop-blur-sm transition-all"
                  />
                </div>
              </div>

              <MinimalButton
                onClick={handleUpdateChatbotInfo}
                loading={loading}
                variant="primary"
                size="md"
                fullWidth={true}
                className="mt-5"
              >
                Update Details
              </MinimalButton>
            </div>
          </div>
        </div>

        {/* Bottom Row - Publishing */}
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success-100 rounded-xl">
                <Icons.Settings className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Publishing Control
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Make your chatbot publicly accessible
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  {publishData.isPublished ? "Live" : "Private"}
                </p>
                <p className="text-xs text-text-secondary">
                  {publishData.isPublished
                    ? "Publicly accessible"
                    : "Not accessible"}
                </p>
              </div>
              <Toggle
                checked={publishData.isPublished}
                onChange={handlePublishToggle}
                disabled={!companyAuth.company?.slug || loading}
                variant="success"
                size="lg"
                label=""
                description=""
              />
            </div>
          </div>

          <div className="space-y-6">
            {!companyAuth.company?.slug && (
              <div className="bg-gradient-to-r from-warning-50 to-orange-50 p-6 rounded-xl border border-warning-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-warning-200 rounded-lg">
                    <Icons.AlertCircle className="h-5 w-5 text-warning-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning-800 mb-1">
                      Company Slug Required
                    </h4>
                    <p className="text-sm text-warning-700">
                      Set a company slug in the section above before you can
                      publish your chatbot.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {companyAuth.company?.slug && publishData.isPublished && (
              <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-text-primary">
                    Your Chatbot is Live
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Path-based URL */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      Path URL
                    </span>
                    <div
                      className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-neutral-300 text-text-primary hover:text-primary-600 hover:border-primary-300 cursor-pointer transition-all group"
                      onClick={handleVisitPublicChatbot}
                    >
                      <span className="font-medium text-sm">
                        {typeof window !== "undefined"
                          ? window.location.origin
                          : "https://yoursite.com"}
                        /{companyAuth.company.slug}
                      </span>
                      <Icons.Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Subdomain URL */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      Subdomain URL
                    </span>
                    <div
                      className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-neutral-300 text-text-primary hover:text-primary-600 hover:border-primary-300 cursor-pointer transition-all group"
                      onClick={() => {
                        if (
                          typeof window !== "undefined" &&
                          companyAuth.company?.slug
                        ) {
                          const hostname = window.location.hostname;
                          const port = window.location.port
                            ? `:${window.location.port}`
                            : "";
                          const protocol = window.location.protocol;

                          // Handle localhost vs production
                          let subdomainUrl;
                          if (
                            hostname === "localhost" ||
                            hostname === "127.0.0.1"
                          ) {
                            subdomainUrl = `${protocol}//${companyAuth.company.slug}.localhost${port}`;
                          } else {
                            // Production: subdomain.domain.com
                            const domainParts = hostname.split(".");
                            const baseDomain =
                              domainParts.length >= 2
                                ? domainParts.slice(-2).join(".")
                                : hostname;
                            subdomainUrl = `${protocol}//${companyAuth.company.slug}.${baseDomain}${port}`;
                          }
                          window.open(subdomainUrl, "_blank");
                        }
                      }}
                    >
                      <span className="font-medium text-sm">
                        {(() => {
                          if (
                            typeof window === "undefined" ||
                            !companyAuth.company?.slug
                          )
                            return "Loading...";
                          const hostname = window.location.hostname;
                          const port = window.location.port
                            ? `:${window.location.port}`
                            : "";

                          if (
                            hostname === "localhost" ||
                            hostname === "127.0.0.1"
                          ) {
                            return `${companyAuth.company.slug}.localhost${port}`;
                          } else {
                            const domainParts = hostname.split(".");
                            const baseDomain =
                              domainParts.length >= 2
                                ? domainParts.slice(-2).join(".")
                                : hostname;
                            return `${companyAuth.company.slug}.${baseDomain}${port}`;
                          }
                        })()}
                      </span>
                      <Icons.Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {companyAuth.company?.slug && !publishData.isPublished && (
              <div className="bg-gradient-to-r from-neutral-50 to-gray-50 p-6 rounded-xl border border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-neutral-200 rounded-lg">
                    <Icons.Eye className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-1">
                      Chatbot is Private
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Toggle the switch above to make your chatbot publicly
                      accessible
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
