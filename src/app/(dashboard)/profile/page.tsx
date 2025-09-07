'use client';

import React, { useState } from 'react';

import { useAppSelector } from '@/hooks/useAuth';
import { UserProfileForm, CompanyProfileForm } from '@/components/profile/ProfileForm';
import Card from '@/components/ui/Card';
import type { ProfileFormData, CompanyProfileFormData } from '@/interfaces/Profile.interface';

export default function ProfilePage() {
  const companyAuth = useAppSelector((state) => state.companyAuth);
  const userAuth = useAppSelector((state) => state.userAuth);
  const [loading, setLoading] = useState(false);

  const handleUserProfileSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      // TODO: Implement API call to update user profile
      console.log('Updating user profile:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyProfileSubmit = async (data: CompanyProfileFormData) => {
    setLoading(true);
    try {
      // TODO: Implement API call to update company profile
      console.log('Updating company profile:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Company profile updated successfully!');
    } catch (error) {
      console.error('Failed to update company profile:', error);
      alert('Failed to update company profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine which auth is active
  const isCompanyUser = companyAuth.isAuthenticated;
  const isRegularUser = userAuth.isAuthenticated;
  
  const displayName = isCompanyUser 
    ? companyAuth.company?.name || 'Company' 
    : userAuth.user?.name || 'User';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your {isCompanyUser ? 'company' : 'personal'} information and account settings.
        </p>
      </div>

      {/* Current User Info */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{displayName}</h3>
              <p className="text-sm text-gray-600">
                {isCompanyUser ? companyAuth.company?.email : userAuth.user?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isCompanyUser ? 'Company Account' : 'Team Member'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Forms */}
      {isCompanyUser ? (
        <CompanyProfileForm
          onSubmit={handleCompanyProfileSubmit}
          loading={loading}
          initialData={{
            name: companyAuth.company?.name || '',
            email: companyAuth.company?.email || '',
            slug: companyAuth.company?.slug || '',
          }}
        />
      ) : (
        <UserProfileForm
          onSubmit={handleUserProfileSubmit}
          loading={loading}
          initialData={{
            name: userAuth.user?.name || '',
            email: userAuth.user?.email || '',
          }}
        />
      )}

      {/* Account Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Download Your Data</h4>
                <p className="text-sm text-gray-600">
                  Export all your chat history and account data.
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-md">
                Download
              </button>
            </div>
            
            {isCompanyUser && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-red-900">Delete Company Account</h4>
                  <p className="text-sm text-gray-600">
                    Permanently delete your company and all associated data.
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 rounded-md">
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
