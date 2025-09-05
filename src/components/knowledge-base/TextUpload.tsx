'use client';

import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { TextUploadProps } from '@/interfaces/KnowledgeBase.interface';

// Icons
const DocumentTextIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TextUpload: React.FC<TextUploadProps> = ({
  onUpload,
  loading = false,
  className = "",
}) => {
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ filename?: string; content?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { filename?: string; content?: string } = {};

    if (!filename.trim()) {
      newErrors.filename = 'Filename is required';
    } else if (!filename.endsWith('.txt') && !filename.includes('.')) {
      // Auto-add .txt extension if no extension provided
      setFilename(prev => prev + '.txt');
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpload(content.trim(), filename.trim());
      // Reset form after successful upload
      setFilename('');
      setContent('');
      setErrors({});
    }
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
    if (errors.filename) {
      setErrors(prev => ({ ...prev, filename: undefined }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Add Text Content
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Paste or type your content directly to add it to your knowledge base.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Filename Input */}
        <div>
          <Input
            label="Filename"
            type="text"
            value={filename}
            onChange={handleFilenameChange}
            error={errors.filename}
            placeholder="e.g., company-policy.txt"
            description="Enter a descriptive filename for your content"
            required
            disabled={loading}
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Paste or type your content here..."
            rows={12}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.content ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={loading}
            required
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
          
          {/* Character and Word Count */}
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            disabled={!filename.trim() || !content.trim()}
          >
            Upload Content
          </Button>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for better results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use clear, descriptive filenames</li>
          <li>• Include relevant context and details</li>
          <li>• Break up very long content into separate documents</li>
          <li>• Use proper formatting with paragraphs and sections</li>
        </ul>
      </div>
    </div>
  );
};

export default TextUpload;
