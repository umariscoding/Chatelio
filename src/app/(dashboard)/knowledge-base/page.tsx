'use client';

import React from 'react';
import Link from 'next/link';

import { useAppSelector } from '@/hooks/useAuth';
import MinimalButton from '@/components/ui/MinimalButton';
import { Icons } from '@/components/ui';
import DocumentList from '@/components/knowledge-base/DocumentList';

export default function KnowledgeBasePage() {
  const companyAuth = useAppSelector((state) => state.companyAuth);

  // Only company accounts can access knowledge base management
  if (!companyAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-page-bg p-8">
        <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-100">Knowledge Base</h1>
          <p className="mt-1 text-secondary-400">
            Access to knowledge base management is restricted to company accounts.
          </p>
        </div>
        
        <div className="text-center py-12">
          <Icons.BookOpen className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-4 text-lg font-medium text-secondary-100">
              Access Restricted
            </h3>
            <p className="mt-2 text-secondary-400">
            Only company administrators can manage the knowledge base.
          </p>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-secondary-100 mb-3">Knowledge Base</h1>
          <p className="text-secondary-400 mb-6">
            Manage your documents and content that powers your chatbot's responses.
          </p>
          <Link href="/knowledge-base/upload">
            <MinimalButton variant="primary" size="lg" className="flex items-center space-x-2">
              <Icons.Plus />
              <span>Upload Document</span>
            </MinimalButton>
          </Link>
        </div>

        {/* Document List */}
        <DocumentList />
      </div>
    </div>
  );
}