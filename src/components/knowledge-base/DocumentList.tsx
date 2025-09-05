'use client';

import React, { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { listDocuments, deleteDocument } from '@/store/slices/knowledgeBaseSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import type { DocumentListProps, DocumentItemProps } from '@/interfaces/KnowledgeBase.interface';
import type { Document } from '@/types/knowledgeBase';

// Icons
const DocumentIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'pending':
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case 'failed':
      return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    default:
      return <ClockIcon className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusColor = (status: Document['embeddings_status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
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
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            <DocumentIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {document.filename}
            </h4>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>
      <div className="sm:w-48">
        <select
          value={statusFilter}
          onChange={handleFilterChange}
          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Documents</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-gray-600">Completed</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        <div className="text-sm text-gray-600">Processing</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        <div className="text-sm text-gray-600">Failed</div>
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
            <Loading />
            <p className="mt-4 text-gray-600">Loading documents...</p>
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
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchQuery || statusFilter !== 'all' ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="mt-2 text-gray-500">
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
