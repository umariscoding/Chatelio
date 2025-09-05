'use client';

import React from 'react';
import Link from "next/link";

import Button from "@/components/ui/Button";
import { APP_CONFIG, ROUTES } from "@/constants/APP_CONSTANTS";
import { useAppSelector, useAppDispatch } from "@/hooks/useAuth";
import { logoutCompany, logoutUser } from "@/store/slices/authSlice";

export default function Home() {
  const { isCompanyAuthenticated, isUserAuthenticated, activeSession } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    if (activeSession === 'company') {
      dispatch(logoutCompany());
    } else if (activeSession === 'user') {
      dispatch(logoutUser());
    }
  };

  const renderAuthButtons = () => {
    if (isCompanyAuthenticated || isUserAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          <Link href={activeSession === 'company' ? ROUTES.DASHBOARD : ROUTES.DASHBOARD}>
            <Button variant="ghost">
              Dashboard
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <Link href={ROUTES.COMPANY_LOGIN}>
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href={ROUTES.COMPANY_REGISTER}>
          <Button>Get Started</Button>
        </Link>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">{APP_CONFIG.NAME}</h1>
              </div>
            </div>
            {renderAuthButtons()}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Chatbot as a</span>{' '}
            <span className="block text-blue-600 xl:inline">Service</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {APP_CONFIG.DESCRIPTION}. Upload your knowledge base and deploy branded chatbots for your customers.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {!isCompanyAuthenticated && !isUserAuthenticated ? (
              <>
                <div className="rounded-md shadow">
                  <Link href={ROUTES.COMPANY_REGISTER}>
                    <Button size="lg" className="w-full">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href={ROUTES.COMPANY_LOGIN}>
                    <Button variant="outline" size="lg" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-md shadow">
                <Link href={ROUTES.DASHBOARD}>
                  <Button size="lg" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Setup</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Upload your documents and create a chatbot in minutes. No coding required.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Smart AI</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Powered by OpenAI and Claude. Your chatbot understands context and provides accurate answers.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Custom Branding</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Deploy branded chatbots on your domain. Full customization and white-label options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
