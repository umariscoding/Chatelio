'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import MinimalInput from '@/components/ui/MinimalInput';
import MinimalButton from '@/components/ui/MinimalButton';
import { Icons } from '@/components/ui';
import { useCompanyAppDispatch, useCompanyAppSelector } from '@/hooks/company/useCompanyAuth';
import { loginCompany, registerCompany, clearError } from '@/store/company/slices/companyAuthSlice';
import { APP_CONFIG, ROUTES, FORM_VALIDATION } from '@/constants/APP_CONSTANTS';

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function CompanyAuthPage() {
  const router = useRouter();
  const dispatch = useCompanyAppDispatch();
  const { loading: companyLoading, error, isAuthenticated: isCompanyAuthenticated } = useCompanyAppSelector((state) => state.companyAuth);

  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [signupData, setSignupData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isCompanyAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isCompanyAuthenticated, router]);

  // Clear error when component mounts or form type changes
  useEffect(() => {
    dispatch(clearError());
    setFormErrors({});
  }, [dispatch, isLogin]);

  const validateLoginForm = (): boolean => {
    const errors: FormErrors = {};

    if (!loginData.email) {
      errors.email = FORM_VALIDATION.EMAIL.REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = FORM_VALIDATION.EMAIL.INVALID;
    }

    if (!loginData.password) {
      errors.password = FORM_VALIDATION.PASSWORD.REQUIRED;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: FormErrors = {};

    if (!signupData.name.trim()) {
      errors.name = FORM_VALIDATION.COMPANY_NAME.REQUIRED;
    } else if (signupData.name.trim().length < FORM_VALIDATION.COMPANY_NAME.MIN_LENGTH) {
      errors.name = `Company name must be at least ${FORM_VALIDATION.COMPANY_NAME.MIN_LENGTH} characters`;
    }

    if (!signupData.email) {
      errors.email = FORM_VALIDATION.EMAIL.REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      errors.email = FORM_VALIDATION.EMAIL.INVALID;
    }

    if (!signupData.password) {
      errors.password = FORM_VALIDATION.PASSWORD.REQUIRED;
    } else if (signupData.password.length < FORM_VALIDATION.PASSWORD.MIN_LENGTH) {
      errors.password = `Password must be at least ${FORM_VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupData.password)) {
      errors.password = FORM_VALIDATION.PASSWORD.WEAK;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;

    try {
      await dispatch(loginCompany({
        email: loginData.email.trim(),
        password: loginData.password,
      })).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;

    try {
      await dispatch(registerCompany({
        name: signupData.name.trim(),
        email: signupData.email.trim(),
        password: signupData.password,
      })).unwrap();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-bg relative overflow-hidden">
        <div className="flex flex-col justify-center items-center text-center p-12 text-white w-full h-full">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-6 shadow-2xl shadow-primary-600/50">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">Welcome to {APP_CONFIG.NAME}</h1>
            <p className="text-neutral-400 text-lg">Your AI-powered customer engagement platform</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 max-w-xs w-full">
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/50 hover:border-primary-600/50 transition-all duration-300">
              <Icons.Zap className="h-8 w-8 text-primary-400 mb-3" />
              <h3 className="font-semibold mb-2 text-white">Quick Setup</h3>
              <p className="text-sm text-neutral-400">Get your chatbot running in minutes</p>
            </div>
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/50 hover:border-primary-600/50 transition-all duration-300">
              <Icons.Shield className="h-8 w-8 text-accent-400 mb-3" />
              <h3 className="font-semibold mb-2 text-white">Secure & Reliable</h3>
              <p className="text-sm text-neutral-400">Enterprise-grade security and uptime</p>
            </div>
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/50 hover:border-primary-600/50 transition-all duration-300">
              <Icons.Users className="h-8 w-8 text-primary-400 mb-3" />
              <h3 className="font-semibold mb-2 text-white">Customer Insights</h3>
              <p className="text-sm text-neutral-400">Analytics and user management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Company Name */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">{APP_CONFIG.NAME}</h1>
          </div>

          {/* Toggle Switch */}
          <div className="mb-8">
            <div className="flex bg-bg-secondary rounded-xl p-1 border border-border-light">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isLogin
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  !isLogin
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {isLogin 
                  ? 'Sign in to access your dashboard' 
                  : 'Start building your chatbot today'
                }
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg text-sm">
                {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <MinimalInput
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  error={formErrors.email}
                  variant="floating"
                  theme="light"
                />

                <MinimalInput
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  error={formErrors.password}
                  variant="floating"
                  theme="light"
                />

                <MinimalButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={companyLoading}
                  disabled={companyLoading}
                >
                  Sign In
                </MinimalButton>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <MinimalInput
                  label="Company Name"
                  name="name"
                  type="text"
                  autoComplete="organization"
                  value={signupData.name}
                  onChange={handleSignupInputChange}
                  error={formErrors.name}
                  variant="floating"
                  theme="light"
                />

                <MinimalInput
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={signupData.email}
                  onChange={handleSignupInputChange}
                  error={formErrors.email}
                  variant="floating"
                  theme="light"
                />

                <MinimalInput
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={signupData.password}
                  onChange={handleSignupInputChange}
                  error={formErrors.password}
                  variant="floating"
                  theme="light"
                />

                <MinimalButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={companyLoading}
                  disabled={companyLoading}
                >
                  Create Account
                </MinimalButton>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-xs text-text-tertiary">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
