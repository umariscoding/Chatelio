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
      <div className="p-8">
        <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Knowledge Base</h1>
          <p className="mt-1 text-text-secondary">
            Access to knowledge base management is restricted to company accounts.
          </p>
        </div>
        
        <div className="text-center py-12">
          <Icons.BookOpen className="mx-auto h-12 w-12 text-text-tertiary" />
            <h3 className="mt-4 text-lg font-medium text-text-primary">
            Access Restricted
          </h3>
            <p className="mt-2 text-text-secondary">
            Only company administrators can manage the knowledge base.
          </p>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-text-primary mb-3">Knowledge Base</h1>
          <p className="text-text-secondary mb-6">
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
  );
}