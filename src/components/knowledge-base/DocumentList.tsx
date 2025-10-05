'use client';

import React, { useState, useEffect } from 'react';

import { useCompanyAppSelector, useCompanyAppDispatch } from '@/hooks/company/useCompanyAuth';
import { listDocuments, deleteDocument } from '@/store/company/slices/knowledgeBaseSlice';
import MinimalButton from '@/components/ui/MinimalButton';
import { Icons } from '@/components/ui';
import type { DocumentListProps, DocumentItemProps } from '@/interfaces/KnowledgeBase.interface';
import type { Document } from '@/types/knowledgeBase';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusIcon = (status: Document['embeddings_status']) => {
  switch (status) {
    case 'completed':
      return <Icons.CheckCircle className="h-5 w-5 text-success-500" />;
    case 'pending':
      return <Icons.Clock className="h-5 w-5 text-warning-400" />;
    case 'failed':
      return <Icons.AlertCircle className="h-5 w-5 text-error-600" />;
    default:
      return <Icons.Clock className="h-5 w-5 text-text-tertiary" />;
  }
};

const getStatusColor = (status: Document['embeddings_status']) => {
  switch (status) {
    case 'completed':
      return 'bg-success-100 text-success-800';
    case 'pending':
      return 'bg-warning-50 text-warning-700';
    case 'failed':
      return 'bg-error-100 text-error-800';
    default:
      return 'bg-secondary-100 text-secondary-600';
  }
};

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDelete, className = "" }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setIsDeleting(true);
      try {
        await onDelete(document.doc_id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getFileTypeIcon = (contentType: string) => {
    if (contentType.includes('pdf')) return <Icons.FileText className="h-6 w-6 text-error-600" />;
    if (contentType.includes('word') || contentType.includes('document')) return <Icons.FileText className="h-6 w-6 text-primary-600" />;
    if (contentType.includes('text')) return <Icons.Document className="h-6 w-6 text-success-600" />;
    return <Icons.Document className="h-6 w-6 text-neutral-600" />;
  };

  return (
    <div className={`group bg-white border border-neutral-200 rounded-2xl p-5 hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Header with Icon, Title and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 group-hover:from-primary-50 group-hover:to-primary-100 transition-colors duration-300">
            {getFileTypeIcon(document.content_type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
              {document.filename}
            </h4>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <MinimalButton
            variant="outline"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-neutral-400 border-neutral-200 hover:text-error-600 hover:border-error-300 hover:bg-error-50"
          >
            <Icons.Trash className="h-4 w-4" />
          </MinimalButton>
        </div>
      </div>
      
      {/* Compact Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Size</span>
          <span className="font-medium text-neutral-700">{formatFileSize(document.file_size)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Type</span>
          <span className="font-medium text-neutral-700">{document.content_type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Created</span>
          <span className="font-medium text-neutral-700">{formatDate(document.created_at)}</span>
        </div>
      </div>
      
      {/* Status Badge */}
      <div className="flex justify-center">
        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(document.embeddings_status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
            document.embeddings_status === 'completed' ? 'bg-success-500' :
            document.embeddings_status === 'pending' ? 'bg-warning-500' :
            'bg-error-500'
          }`}></span>
          {document.embeddings_status.charAt(0).toUpperCase() + document.embeddings_status.slice(1)}
        </span>
      </div>
    </div>
  );
};



const DocumentList: React.FC<DocumentListProps> = ({ className = "" }) => {
  const dispatch = useCompanyAppDispatch();
  const { documents, loading, error } = useCompanyAppSelector((state) => state.knowledgeBase);

  useEffect(() => {
    dispatch(listDocuments());
  }, [dispatch]);

  const handleDelete = async (docId: string) => {
    await dispatch(deleteDocument(docId));
  };

  if (loading && documents.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-20">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-600 border-t-transparent"></div>
          </div>
          <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Loading documents...</h3>
          <p className="text-lg text-neutral-600">
            Please wait while we fetch your knowledge base documents.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your Documents</h2>
        <div className="flex items-center space-x-2 text-neutral-600">
          <span className="text-lg font-medium">{documents.length}</span>
          <span>{documents.length === 1 ? 'document' : 'documents'} in your knowledge base</span>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-5 bg-gradient-to-r from-error-50 to-error-100 border border-error-200 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-1 bg-error-200 rounded-full">
              <Icons.AlertCircle className="h-5 w-5 text-error-700" />
            </div>
            <p className="text-sm font-medium text-error-800">{typeof error === 'string' ? error : 'An error occurred while loading documents.'}</p>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 mb-8">
            <Icons.Document className="h-12 w-12 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-semibold text-neutral-900 mb-3">No documents yet</h3>
          <p className="text-lg text-neutral-600 max-w-lg mx-auto leading-relaxed">
            Use the upload options above to start building your knowledge base. Your chatbot will use this content to provide intelligent responses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents.map((document) => (
            <DocumentItem
              key={document.doc_id}
              document={document}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
