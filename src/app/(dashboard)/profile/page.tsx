'use client';

import React, { useState } from 'react';

import { useAppSelector } from '@/hooks/useAuth';
import { UserProfileForm, CompanyProfileForm } from '@/components/profile/ProfileForm';
import Card from '@/components/ui/Card';
import { Icons } from '@/components/ui';
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
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold text-secondary-100 mb-4">Profile Settings</h1>
            <p className="text-lg text-secondary-400 max-w-2xl mx-auto">
              Manage your {isCompanyUser ? 'company' : 'personal'} information and account settings.
            </p>
          </div>

          {/* Current User Info */}
          <Card className="border border-secondary-700 bg-secondary-800 shadow-lg">
            <div className="p-10">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-secondary-900 to-secondary-800 flex items-center justify-center shadow-inner ring-4 ring-secondary-700">
                    <Icons.User className="h-12 w-12 text-primary-400" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-semibold text-secondary-100">{displayName}</h3>
                  <p className="text-lg text-secondary-300">
                    {isCompanyUser ? companyAuth.company?.email : userAuth.user?.email}
                  </p>
                  <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-full ${
                    isCompanyUser 
                      ? 'bg-secondary-900 text-primary-400' 
                      : 'bg-secondary-900 text-secondary-200'
                  }`}>
                    {isCompanyUser ? 'Company Account' : 'Team Member'}
                  </span>
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
        </div>
      </div>
    </div>
  );
}
