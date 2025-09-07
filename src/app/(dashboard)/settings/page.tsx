'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { publishChatbot, updateCompanySlug, setCompany, clearError } from '@/store/slices/companySlice';
import { updateCompanyInfo } from '@/store/slices/companyAuthSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

// Icons
const GlobeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CogIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const { publicUrl, loading, error } = useAppSelector((state) => state.company);
  
  const [publishData, setPublishData] = useState({
    isPublished: companyAuth.company?.is_published || false,
    chatbotTitle: companyAuth.company?.name ? `${companyAuth.company.name} Assistant` : '',
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
        chatbotTitle: companyAuth.company.name ? `${companyAuth.company.name} Assistant` : '',
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Settings access is restricted to company accounts.
          </p>
        </div>
        
        <div className="text-center py-12">
          <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Access Restricted
          </h3>
          <p className="mt-2 text-gray-500">
            Only company administrators can access settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your chatbot settings and public configuration.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Company Slug Management */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <GlobeIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Company Slug</h3>
              <p className="text-sm text-gray-600">
                Set your custom URL path for public chatbot access
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  label="Company Slug"
                  value={slugData.slug}
                  onChange={(e) => setSlugData({ slug: e.target.value })}
                  placeholder="your-company-name"
                  description="Only lowercase letters, numbers, and hyphens allowed"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleUpdateSlug}
                  loading={loading}
                  disabled={!slugData.slug.trim() || slugData.slug === companyAuth.company?.slug}
                >
                  Update Slug
                </Button>
              </div>
            </div>

            {companyAuth.company?.slug && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Your public URL: <code className="text-blue-600">{typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/{companyAuth.company.slug}</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Chatbot Publishing */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <GlobeIcon className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Public Chatbot</h3>
              <p className="text-sm text-gray-600">
                Make your chatbot publicly available with a custom URL
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Chatbot Status
                </h4>
                <p className="text-sm text-gray-600">
                  {publishData.isPublished 
                    ? '🟢 Your chatbot is publicly accessible' 
                    : '🔴 Your chatbot is currently private'
                  }
                </p>
              </div>
              <Button
                onClick={handlePublishToggle}
                loading={loading}
                variant={publishData.isPublished ? 'outline' : 'primary'}
                disabled={!companyAuth.company?.slug}
              >
                {publishData.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
            </div>

            {!companyAuth.company?.slug && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ You need to set a company slug before publishing your chatbot.
                </p>
              </div>
            )}

            {/* Public URL with Visit Button */}
            {companyAuth.company?.slug && publishData.isPublished && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 mb-3">🎉 Your chatbot is live!</h4>
                <div className="flex items-center space-x-3">
                  <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/{companyAuth.company.slug}
                  </code>
                  <Button
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
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleVisitPublicChatbot}
                  >
                    Visit Chatbot
                  </Button>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Share this URL with your customers so they can chat with your AI assistant!
                </p>
              </div>
            )}

            {/* Chatbot Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Chatbot Configuration</h4>
              
              <Input
                label="Chatbot Title"
                value={publishData.chatbotTitle}
                onChange={(e) => setPublishData(prev => ({ ...prev, chatbotTitle: e.target.value }))}
                placeholder="e.g., Company Assistant"
                description="This will be displayed as the chatbot's name"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chatbot Description
                </label>
                <textarea
                  value={publishData.chatbotDescription}
                  onChange={(e) => setPublishData(prev => ({ ...prev, chatbotDescription: e.target.value }))}
                  placeholder="Brief description of what your chatbot can help with"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  This description will be shown to users when they visit your chatbot
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleUpdateChatbotInfo}
                  loading={loading}
                >
                  Update Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
          
          <div className="space-y-6">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default AI Model
              </label>
              <select className="w-full md:w-48 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="OpenAI">OpenAI GPT</option>
                <option value="Claude">Anthropic Claude</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Choose the default AI model for your chatbot responses
              </p>
            </div>

            {/* Rate Limiting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate Limiting
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  defaultValue={10}
                  min={1}
                  max={100}
                  className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">messages per user per hour</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Limit the number of messages users can send to prevent abuse
              </p>
            </div>

            {/* Security */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Settings
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Enable CORS protection</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Log user interactions</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Require user registration</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}