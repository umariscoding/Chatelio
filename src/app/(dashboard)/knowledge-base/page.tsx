'use client';

import React from 'react';
import Link from 'next/link';

import { useAppSelector } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import DocumentList from '@/components/knowledge-base/DocumentList';

// Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default function KnowledgeBasePage() {
  const { activeSession, isCompanyAuthenticated } = useAppSelector((state) => state.auth);

  // Only company accounts can access knowledge base management
  if (activeSession !== 'company' || !isCompanyAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-1 text-gray-600">
            Access to knowledge base management is restricted to company accounts.
          </p>
        </div>
        
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Access Restricted
          </h3>
          <p className="mt-2 text-gray-500">
            Only company administrators can manage the knowledge base.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-1 text-gray-600">
            Manage your documents and content that powers your chatbot's responses.
          </p>
        </div>
        <Link href="/knowledge-base/upload">
          <Button className="flex items-center space-x-2">
            <PlusIcon />
            <span>Upload Document</span>
          </Button>
        </Link>
      </div>

      {/* Document List */}
      <DocumentList />
    </div>
  );
}