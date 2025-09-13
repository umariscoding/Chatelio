'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import MinimalInput from '@/components/ui/MinimalInput';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { registerCompany, clearError } from '@/store/slices/companyAuthSlice';
import { APP_CONFIG, ROUTES, FORM_VALIDATION } from '@/constants/APP_CONSTANTS';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function CompanyRegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading: companyLoading, error, isAuthenticated: isCompanyAuthenticated } = useAppSelector((state) => state.companyAuth);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Redirect if already authenticated as company
  useEffect(() => {
    if (isCompanyAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isCompanyAuthenticated, router]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Company name validation
    if (!formData.name.trim()) {
      errors.name = FORM_VALIDATION.COMPANY_NAME.REQUIRED;
    } else if (formData.name.trim().length < FORM_VALIDATION.COMPANY_NAME.MIN_LENGTH) {
      errors.name = `Company name must be at least ${FORM_VALIDATION.COMPANY_NAME.MIN_LENGTH} characters`;
    } else if (formData.name.trim().length > FORM_VALIDATION.COMPANY_NAME.MAX_LENGTH) {
      errors.name = `Company name must be less than ${FORM_VALIDATION.COMPANY_NAME.MAX_LENGTH} characters`;
    }

    // Email validation
    if (!formData.email) {
      errors.email = FORM_VALIDATION.EMAIL.REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = FORM_VALIDATION.EMAIL.INVALID;
    }

    // Password validation
    if (!formData.password) {
      errors.password = FORM_VALIDATION.PASSWORD.REQUIRED;
    } else if (formData.password.length < FORM_VALIDATION.PASSWORD.MIN_LENGTH) {
      errors.password = `Password must be at least ${FORM_VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = FORM_VALIDATION.PASSWORD.WEAK;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const registrationData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      await dispatch(registerCompany(registrationData)).unwrap();
      // Redirect will happen automatically due to useEffect above
    } catch (error) {
      // Error is handled by the Redux slice
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">{APP_CONFIG.NAME}</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            Create your company account
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Start building your custom chatbot today
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-secondary-50 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-secondary-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <MinimalInput
                id="name"
                label="Company Name"
                name="name"
                type="text"
                autoComplete="organization"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                error={formErrors.name}
                variant="floating"
                theme="light"
              />
            </div>

            <div>
              <MinimalInput
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                error={formErrors.email}
                variant="floating"
                theme="light"
              />
            </div>

            <div>
              <MinimalInput
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                error={formErrors.password}
                variant="floating"
                theme="light"
              />
            </div>

            <div>
              <MinimalInput
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                error={formErrors.confirmPassword}
                variant="floating"
                theme="light"
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={companyLoading}
                disabled={companyLoading}
              >
                Create Account
              </Button>
            </div>

            <div className="text-center">
              <span className="text-sm text-secondary-600">
                Already have an account?{' '}
                <Link href={ROUTES.COMPANY_LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
