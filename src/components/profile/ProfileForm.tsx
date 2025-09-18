'use client';

import React, { useState } from 'react';

import MinimalButton from '@/components/ui/MinimalButton';
import MinimalInput from '@/components/ui/MinimalInput';
import Card from '@/components/ui/Card';
import type { ProfileFormProps, ProfileFormData, CompanyProfileFormProps, CompanyProfileFormData } from '@/interfaces/Profile.interface';

const ProfileSection: React.FC<{ title: string; description?: string; children: React.ReactNode; className?: string }> = ({
  title,
  description,
  children,
  className = ""
}) => (
  <div className={`border rounded-2xl shadow-sm ${className}`}>
    <div className="p-8">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
        {description && (
          <p className="text-neutral-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  </div>
);

export const UserProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, loading = false, className = "", initialData }) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  const handleInputChange = (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation (only if changing password)
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <ProfileSection
        title="Personal Information"
        description="Update your personal details and email address."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MinimalInput
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              placeholder="Enter your full name"
              required
              variant="floating"
              theme="light"
            />
            
            <MinimalInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder="Enter your email address"
              required
              variant="floating"
              theme="light"
            />
          </div>

          <div className="flex justify-end pt-4">
            <MinimalButton type="submit" loading={loading} variant="primary" size="lg">
              Save Changes
            </MinimalButton>
          </div>
        </form>
      </ProfileSection>

      <ProfileSection
        title="Security Settings"
        description="Update your password to keep your account secure."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <MinimalInput
              label="Current Password"
              type="password"
              value={formData.currentPassword || ''}
              onChange={handleInputChange('currentPassword')}
              error={errors.currentPassword}
              placeholder="Enter your current password"
              variant="floating"
              theme="light"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MinimalInput
                label="New Password"
                type="password"
                value={formData.newPassword || ''}
                onChange={handleInputChange('newPassword')}
                error={errors.newPassword}
                placeholder="Enter your new password"
                variant="floating"
                theme="light"
              />
              
              <MinimalInput
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword || ''}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                placeholder="Confirm your new password"
                variant="floating"
                theme="light"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <MinimalButton 
              type="submit" 
              loading={loading} 
              variant="secondary" 
              size="lg"
              disabled={!formData.newPassword}
            >
              Update Password
            </MinimalButton>
          </div>
        </form>
      </ProfileSection>
    </div>
  );
};

export const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ onSubmit, loading = false, className = "", initialData }) => {
  const [formData, setFormData] = useState<CompanyProfileFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    slug: initialData?.slug || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<CompanyProfileFormData>>({});

  const handleInputChange = (field: keyof CompanyProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyProfileFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Slug validation
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    // Password validation (only if changing password)
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <ProfileSection
        title="Company Information"
        description="Update your company details and public settings."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MinimalInput
              label="Company Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              placeholder="Enter your company name"
              required
              variant="floating"
              theme="light"
            />
            
            <MinimalInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder="Enter your company email"
              required
              variant="floating"
              theme="light"
            />
          </div>

          <div>
            <MinimalInput
              label="Public Slug"
              type="text"
              value={formData.slug || ''}
              onChange={handleInputChange('slug')}
              error={errors.slug}
              placeholder="your-company"
              variant="floating"
              theme="light"
            />
            <p className="mt-2 text-sm text-neutral-500 flex items-center">
              <span>🌐 This will be your public chatbot URL: </span>
              <code className="ml-1 px-2 py-1 bg-neutral-100 rounded text-xs">
                {formData.slug || 'your-company'}.chatelio.com
              </code>
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <MinimalButton type="submit" loading={loading} variant="primary" size="lg">
              Save Changes
            </MinimalButton>
          </div>
        </form>
      </ProfileSection>

      <ProfileSection
        title="Security Settings"
        description="Update your password to keep your account secure."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <MinimalInput
              label="Current Password"
              type="password"
              value={formData.currentPassword || ''}
              onChange={handleInputChange('currentPassword')}
              error={errors.currentPassword}
              placeholder="Enter your current password"
              variant="floating"
              theme="light"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MinimalInput
                label="New Password"
                type="password"
                value={formData.newPassword || ''}
                onChange={handleInputChange('newPassword')}
                error={errors.newPassword}
                placeholder="Enter your new password"
                variant="floating"
                theme="light"
              />
              
              <MinimalInput
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword || ''}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                placeholder="Confirm your new password"
                variant="floating"
                theme="light"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <MinimalButton 
              type="submit" 
              loading={loading} 
              variant="secondary" 
              size="lg"
              disabled={!formData.newPassword}
            >
              Update Password
            </MinimalButton>
          </div>
        </form>
      </ProfileSection>
    </div>
  );
};
