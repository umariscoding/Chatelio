'use client';

import React, { useState, useRef, useCallback } from 'react';

import Button from '@/components/ui/Button';
import type { FileUploadProps } from '@/interfaces/KnowledgeBase.interface';

// Icons
const CloudUploadIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  loading = false,
  className = "",
  accept = ".txt,.pdf,.doc,.docx,.md",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }

    // Check file type if accept is specified
    if (accept) {
      const allowedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return type.toLowerCase() === fileExtension;
        }
        return file.type.includes(type);
      });

      if (!isValidType) {
        return `File "${file.name}" has an invalid type. Allowed types: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      if (multiple) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
      } else {
        setSelectedFiles(validFiles.slice(0, 1));
      }
    }
  }, [maxSize, accept, multiple]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        onUpload(file);
      });
      setSelectedFiles([]);
      setErrors([]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drag & Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            Drop files here to upload
          </p>
          <p className="mt-1 text-sm text-gray-600">
            or{' '}
            <button
              type="button"
              onClick={openFileDialog}
              className="text-blue-600 hover:text-blue-500 font-medium"
              disabled={loading}
            >
              browse files
            </button>
          </p>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Supported formats: {accept}</p>
          <p>Maximum file size: {formatFileSize(maxSize)}</p>
          {multiple && <p>You can upload multiple files</p>}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              loading={loading}
              disabled={selectedFiles.length === 0}
            >
              Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
