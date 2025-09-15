'use client';

import React, { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { listDocuments, deleteDocument } from '@/store/slices/knowledgeBaseSlice';
import Card from '@/components/ui/Card';
import MinimalButton from '@/components/ui/MinimalButton';
import MinimalInput from '@/components/ui/MinimalInput';
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

  return (
    <div className={`bg-bg-primary border border-border-light rounded-lg p-4 hover:shadow-lg transition-shadow shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            <Icons.Document className="h-6 w-6 text-text-tertiary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-text-primary truncate">
              {document.filename}
            </h4>
            <div className="mt-1 flex items-center space-x-4 text-sm text-text-secondary">
              <span>{formatFileSize(document.file_size)}</span>
              <span>{document.content_type}</span>
              <span>{formatDate(document.created_at)}</span>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              {getStatusIcon(document.embeddings_status)}
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(document.embeddings_status)}`}>
                {document.embeddings_status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <MinimalButton
            variant="outline"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            className="text-error-600 border-error-600 hover:bg-error-50"
          >
            <Icons.Trash className="h-4 w-4" />
          </MinimalButton>
        </div>
      </div>
    </div>
  );
};

const DocumentSearch: React.FC<{ onSearch: (query: string) => void; onFilter: (status: string) => void }> = ({ 
  onSearch, 
  onFilter 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    onFilter(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icons.Search className="h-4 w-4 text-text-tertiary" />
          </div>
          <MinimalInput
            label="Search documents..."
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
            variant="default"
            theme="light"
          />
        </div>
      </div>
      <div className="sm:w-48">
        <select
          value={statusFilter}
          onChange={handleFilterChange}
          className="w-full h-10 rounded-md border border-border-medium bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>
  );
};

const DocumentStats: React.FC<{ documents: Document[] }> = ({ documents }) => {
  const stats = {
    total: documents.length,
    completed: documents.filter(doc => doc.embeddings_status === 'completed').length,
    pending: documents.filter(doc => doc.embeddings_status === 'pending').length,
    failed: documents.filter(doc => doc.embeddings_status === 'failed').length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-bg-primary rounded-lg border border-border-light p-4 shadow-md">
        <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
        <div className="text-sm text-text-secondary">Total Documents</div>
      </div>
      <div className="bg-bg-primary rounded-lg border border-border-light p-4 shadow-md">
        <div className="text-2xl font-bold text-success-600">{stats.completed}</div>
        <div className="text-sm text-text-secondary">Completed</div>
      </div>
      <div className="bg-bg-primary rounded-lg border border-border-light p-4 shadow-md">
        <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
        <div className="text-sm text-text-secondary">Processing</div>
      </div>
      <div className="bg-bg-primary rounded-lg border border-border-light p-4 shadow-md">
        <div className="text-2xl font-bold text-error-600">{stats.failed}</div>
        <div className="text-sm text-text-secondary">Failed</div>
      </div>
    </div>
  );
};

const DocumentList: React.FC<DocumentListProps> = ({ className = "" }) => {
  const dispatch = useAppDispatch();
  const { documents, loading, error } = useAppSelector((state) => state.knowledgeBase);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(listDocuments());
  }, [dispatch]);

  useEffect(() => {
    let filtered = documents;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.embeddings_status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, statusFilter]);

  const handleDelete = async (docId: string) => {
    await dispatch(deleteDocument(docId));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (status: string) => {
    setStatusFilter(status);
  };

  if (loading && documents.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <DocumentStats documents={[]} />
        <Card>
          <div className="p-8 text-center">
            <p className="text-lg text-text-secondary">Loading...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <DocumentStats documents={documents} />
      
      <Card>
        <div className="p-6">
          <DocumentSearch onSearch={handleSearch} onFilter={handleFilter} />
          
          {error && (
            <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-md">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <Icons.Document className="mx-auto h-12 w-12 text-text-tertiary" />
              <h3 className="mt-4 text-lg font-medium text-text-primary">
                {searchQuery || statusFilter !== 'all' ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="mt-2 text-text-secondary">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Upload your first document to get started.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <DocumentItem
                  key={document.doc_id}
                  document={document}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentList;
