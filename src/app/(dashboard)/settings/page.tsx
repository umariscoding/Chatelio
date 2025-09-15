'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { publishChatbot, updateCompanySlug, setCompany, clearError } from '@/store/slices/companySlice';
import { updateCompanyInfo } from '@/store/slices/companyAuthSlice';
import MinimalButton from '@/components/ui/MinimalButton';
import Card from '@/components/ui/Card';
import MinimalInput from '@/components/ui/MinimalInput';
import { Icons } from '@/components/ui';

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const { publicUrl, loading, error } = useAppSelector((state) => state.company);
  
  const [publishData, setPublishData] = useState({
    isPublished: companyAuth.company?.is_published || false,
    chatbotTitle: companyAuth.company?.name ? `${companyAuth.company.name}` : '',
    chatbotDescription: 'Get help with our services and products',
  });
  
  const [slugData, setSlugData] = useState({
    slug: companyAuth.company?.slug || '',
  });

  // Initialize company data in company slice
  useEffect(() => {
    if (companyAuth.company) {
      dispatch(setCompany(companyAuth.company));
      setPublishData({
        isPublished: companyAuth.company.is_published || false,
        chatbotTitle: companyAuth.company.name ? `${companyAuth.company.name}` : '',
        chatbotDescription: 'Get help with our services and products',
      });
      setSlugData({
        slug: companyAuth.company.slug || '',
      });
    }
  }, [companyAuth.company, dispatch]);

  const handlePublishToggle = async () => {
    try {
      dispatch(clearError());
      
      const result = await dispatch(publishChatbot({
        is_published: !publishData.isPublished,
        chatbot_title: publishData.chatbotTitle,
        chatbot_description: publishData.chatbotDescription,
      })).unwrap();
      
      setPublishData(prev => ({ ...prev, isPublished: !prev.isPublished }));
      
      // Update auth slice with new publish status
      if (companyAuth.company) {
        const updatedCompany = { ...companyAuth.company, is_published: result.is_published };
        dispatch(updateCompanyInfo(updatedCompany));
      }
      
      alert(`Chatbot ${!publishData.isPublished ? 'published' : 'unpublished'} successfully!`);
    } catch (error: any) {
      console.error('Failed to toggle publish status:', error);
      alert(error || 'Failed to update publish status. Please try again.');
    }
  };

  const handleUpdateChatbotInfo = async () => {
    try {
      dispatch(clearError());
      
      const result = await dispatch(publishChatbot({
        is_published: publishData.isPublished,
        chatbot_title: publishData.chatbotTitle,
        chatbot_description: publishData.chatbotDescription,
      })).unwrap();
      
      // Update auth slice with new chatbot info
      if (companyAuth.company) {
        const updatedCompany = { 
          ...companyAuth.company, 
          is_published: result.is_published,
          chatbot_title: publishData.chatbotTitle,
          chatbot_description: publishData.chatbotDescription,
        };
        dispatch(updateCompanyInfo(updatedCompany));
      }
      
      alert('Chatbot information updated successfully!');
    } catch (error: any) {
      console.error('Failed to update chatbot info:', error);
      alert(error || 'Failed to update chatbot information. Please try again.');
    }
  };

  const handleUpdateSlug = async () => {
    if (!slugData.slug.trim()) {
      alert('Please enter a valid slug');
      return;
    }

    try {
      dispatch(clearError());
      
      const result = await dispatch(updateCompanySlug({
        slug: slugData.slug.trim().toLowerCase(),
      })).unwrap();
      
      // Update both auth slice and company slice immediately
      if (companyAuth.company) {
        const updatedCompany = { ...companyAuth.company, slug: result.slug };
        dispatch(setCompany(updatedCompany));
        dispatch(updateCompanyInfo(updatedCompany));
      }
      
      alert('Company slug updated successfully!');
    } catch (error: any) {
      console.error('Failed to update slug:', error);
      alert(error || 'Failed to update slug. Please try again.');
    }
  };

  const handleVisitPublicChatbot = () => {
    if (companyAuth.company?.slug && typeof window !== 'undefined') {
      const publicChatbotUrl = `${window.location.origin}/${companyAuth.company.slug}`;
      window.open(publicChatbotUrl, '_blank');
    }
  };

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
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-secondary-100 mb-3">Settings</h1>
          <p className="text-secondary-400">
            Manage your chatbot settings and public configuration.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-1">
                <p className="text-sm text-error-600">{error}</p>
              </div>
              <button
                onClick={() => dispatch(clearError())}
                className="text-error-400 hover:text-error-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Company Slug Management */}
        <Card className="shadow-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl bg-secondary-800">
                  <Icons.Globe className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-100 mb-2">Company Slug</h3>
              <p className="text-secondary-300">
                Set your custom URL path for public chatbot access
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <MinimalInput
                    label="Company Slug"
                    value={slugData.slug}
                    onChange={(e) => setSlugData({ slug: e.target.value })}
                    placeholder="your-company-name"
                    variant="floating"
                    theme="light"
                  />
                  <p className="mt-1 text-sm text-secondary-300">Only lowercase letters, numbers, and hyphens allowed</p>
                </div>
                <div className="flex items-end">
                  <MinimalButton
                    onClick={handleUpdateSlug}
                    loading={loading}
                    disabled={!slugData.slug.trim() || slugData.slug === companyAuth.company?.slug}
                    variant="primary"
                    size="md"
                  >
                    Update Slug
                  </MinimalButton>
                </div>
              </div>

              {companyAuth.company?.slug && (
                <div className="p-3 rounded-lg bg-secondary-900">
                  <p className="text-sm text-primary-400">
                    Your public URL: <code className="text-primary-400">{typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/{companyAuth.company.slug}</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Chatbot Publishing */}
        <Card className="shadow-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl bg-secondary-900">
                  <Icons.Globe className="h-8 w-8 text-success-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-100 mb-2">Public Chatbot</h3>
              <p className="text-secondary-300">
                Make your chatbot publicly available with a custom URL
              </p>
            </div>

            <div className="space-y-6">
              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary-900">
                <div>
                  <h4 className="text-sm font-medium text-secondary-100">
                    Chatbot Status
                  </h4>
                  <p className="text-sm text-secondary-300">
                    {publishData.isPublished 
                      ? '🟢 Your chatbot is publicly accessible' 
                      : '🔴 Your chatbot is currently private'
                    }
                  </p>
                </div>
                <MinimalButton
                  onClick={handlePublishToggle}
                  loading={loading}
                  variant={publishData.isPublished ? 'secondary' : 'primary'}
                  size="md"
                  disabled={!companyAuth.company?.slug}
                >
                  {publishData.isPublished ? 'Unpublish' : 'Publish'}
                </MinimalButton>
              </div>

              {!companyAuth.company?.slug && (
                <div className="p-4 rounded-lg bg-secondary-800 border border-secondary-700">
                  <p className="text-sm text-secondary-50">
                    ⚠️ You need to set a company slug before publishing your chatbot.
                  </p>
                </div>
              )}

              {/* Public URL with Visit MinimalButton */}
              {companyAuth.company?.slug && publishData.isPublished && (
                <div className="p-4 rounded-lg bg-secondary-800 border border-primary-700">
                  <h4 className="text-sm font-medium text-secondary-50 mb-3">🎉 Your chatbot is live!</h4>
                  <div className="flex items-center space-x-3">
                    <code className="flex-1 bg-secondary-50 px-3 py-2 rounded border-secondary-200 text-sm text-secondary-900">
                      {typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/{companyAuth.company.slug}
                    </code>
                    <MinimalButton
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(`${window.location.origin}/${companyAuth.company?.slug}`);
                          alert('URL copied to clipboard!');
                        }
                      }}
                    >
                      Copy
                    </MinimalButton>
                    <MinimalButton
                      size="sm"
                      variant="primary"
                      onClick={handleVisitPublicChatbot}
                    >
                      Visit Chatbot
                    </MinimalButton>
                  </div>
                  <p className="text-sm text-primary-400 mt-2">
                    Share this URL with your customers so they can chat with your AI assistant!
                  </p>
                </div>
              )}

              {/* Chatbot Configuration */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-secondary-100">Chatbot Configuration</h4>
                
                <MinimalInput
                  label="Chatbot Title"
                  value={publishData.chatbotTitle}
                  onChange={(e) => setPublishData(prev => ({ ...prev, chatbotTitle: e.target.value }))}
                  placeholder="e.g., Company Assistant"
                  variant="floating"
                  theme="light"
                />
                <p className="mt-1 text-sm text-secondary-300">This will be displayed as the chatbot's name</p>

                <div>
                  <label className="block text-sm font-medium text-secondary-200 mb-2">
                    Chatbot Description
                  </label>
                  <textarea
                    value={publishData.chatbotDescription}
                    onChange={(e) => setPublishData(prev => ({ ...prev, chatbotDescription: e.target.value }))}
                    placeholder="Brief description of what your chatbot can help with"
                    rows={3}
                    className="w-full rounded-md border border-secondary-700 bg-secondary-900 text-secondary-100 placeholder-secondary-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="mt-1 text-sm text-secondary-300">
                    This description will be shown to users when they visit your chatbot
                  </p>
                </div>

                <div className="flex justify-center">
                  <MinimalButton
                    onClick={handleUpdateChatbotInfo}
                    loading={loading}
                    variant="primary"
                    size="lg"
                  >
                    Update Configuration
                  </MinimalButton>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
  );
}