'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import MinimalInput from '@/components/ui/MinimalInput';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { loginCompany, clearError } from '@/store/slices/companyAuthSlice';
import { APP_CONFIG, ROUTES, FORM_VALIDATION } from '@/constants/APP_CONSTANTS';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function CompanyLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading: companyLoading, error, isAuthenticated: isCompanyAuthenticated } = useAppSelector((state) => state.companyAuth);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
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

    // Email validation
    if (!formData.email) {
      errors.email = FORM_VALIDATION.EMAIL.REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = FORM_VALIDATION.EMAIL.INVALID;
    }

    // Password validation
    if (!formData.password) {
      errors.password = FORM_VALIDATION.PASSWORD.REQUIRED;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    const loginData = {
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      await dispatch(loginCompany(loginData)).unwrap();
      // Redirect will happen automatically due to useEffect above
    } catch (error) {
      // Error is handled by the Redux slice
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">{APP_CONFIG.NAME}</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            Company Dashboard Login
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Access your company dashboard to manage chatbots, knowledge base, and users
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                error={formErrors.password}
                variant="floating"
                theme="light"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-secondary-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={companyLoading}
                disabled={companyLoading}
              >
                Sign in
              </Button>
            </div>

            <div className="text-center">
              <span className="text-sm text-secondary-600">
                Don't have an account?{' '}
                <Link href={ROUTES.COMPANY_REGISTER} className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </span>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-secondary-500">
                Looking for customer support? Visit your company's chatbot page or contact your administrator.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
