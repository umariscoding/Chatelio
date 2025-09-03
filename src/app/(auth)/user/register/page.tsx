'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { APP_CONFIG, ROUTES, FORM_VALIDATION } from '@/constants/APP_CONSTANTS';
import { api } from '@/utils/api';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyId: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  companyId?: string;
}

interface Company {
  company_id: string;
  name: string;
  slug: string;
}

export default function UserRegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyId: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Fetch companies for dropdown (This would be a public endpoint)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // For now, we'll simulate this with a static list
        // In real implementation, this would be a public endpoint
        setCompanies([
          { company_id: 'demo-company-1', name: 'Demo Company A', slug: 'companya' },
          { company_id: 'demo-company-2', name: 'Demo Company B', slug: 'companyb' },
        ]);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = FORM_VALIDATION.NAME.REQUIRED;
    } else if (formData.name.trim().length < FORM_VALIDATION.NAME.MIN_LENGTH) {
      errors.name = `Name must be at least ${FORM_VALIDATION.NAME.MIN_LENGTH} characters`;
    } else if (formData.name.trim().length > FORM_VALIDATION.NAME.MAX_LENGTH) {
      errors.name = `Name must be less than ${FORM_VALIDATION.NAME.MAX_LENGTH} characters`;
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

    // Company validation
    if (!formData.companyId) {
      errors.companyId = 'Please select a company';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      company_id: formData.companyId,
    };

    try {
      await dispatch(registerUser(registrationData)).unwrap();
      // Redirect will happen automatically due to useEffect above
    } catch (error) {
      // Error is handled by the Redux slice
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">{APP_CONFIG.NAME}</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join your team
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start using your company's chatbot
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <div className="mt-1">
                <select
                  id="companyId"
                  name="companyId"
                  required
                  value={formData.companyId}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select your company</option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {formErrors.companyId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyId}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  error={formErrors.name}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  error={formErrors.email}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  error={formErrors.password}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  error={formErrors.confirmPassword}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading || loadingCompanies}
              >
                Create Account
              </Button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href={ROUTES.USER_LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </span>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">
                  Are you a company owner?{' '}
                  <Link href={ROUTES.COMPANY_REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
                    Company Registration
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}