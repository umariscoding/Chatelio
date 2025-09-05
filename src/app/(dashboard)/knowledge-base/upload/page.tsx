'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/hooks/useAuth';
import { uploadFile, uploadText } from '@/store/slices/knowledgeBaseSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/knowledge-base/FileUpload';
import TextUpload from '@/components/knowledge-base/TextUpload';

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CloudUploadIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentTextIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

type UploadMode = 'choose' | 'file' | 'text';

export default function UploadPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [uploadMode, setUploadMode] = useState<UploadMode>('choose');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await dispatch(uploadFile(file)).unwrap();
      setUploadSuccess(true);
      setTimeout(() => {
        router.push('/knowledge-base');
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextUpload = async (content: string, filename: string) => {
    setIsUploading(true);
    try {
      await dispatch(uploadText({ content, filename })).unwrap();
      setUploadSuccess(true);
      setTimeout(() => {
        router.push('/knowledge-base');
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const goBack = () => {
    if (uploadMode === 'choose') {
      router.push('/knowledge-base');
    } else {
      setUploadMode('choose');
    }
  };

  if (uploadSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Successful!</h1>
          <p className="mt-2 text-gray-600">
            Your document has been uploaded and is being processed. You'll be redirected to the knowledge base shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={goBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeftIcon />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {uploadMode === 'choose' && 'Upload Document'}
            {uploadMode === 'file' && 'Upload File'}
            {uploadMode === 'text' && 'Upload Text Content'}
          </h1>
          <p className="mt-1 text-gray-600">
            {uploadMode === 'choose' && 'Choose how you want to add content to your knowledge base'}
            {uploadMode === 'file' && 'Upload files from your computer'}
            {uploadMode === 'text' && 'Add content by typing or pasting text'}
          </p>
        </div>
      </div>

      {/* Upload Mode Selection */}
      {uploadMode === 'choose' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload Option */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setUploadMode('file')}>
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <CloudUploadIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h3>
              <p className="text-gray-600 mb-4">
                Upload documents from your computer. Supports PDF, DOC, TXT, and more.
              </p>
              <div className="text-sm text-gray-500">
                <p>• Drag & drop support</p>
                <p>• Multiple file upload</p>
                <p>• Up to 10MB per file</p>
              </div>
            </div>
          </Card>

          {/* Text Upload Option */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setUploadMode('text')}>
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <DocumentTextIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add Text Content</h3>
              <p className="text-gray-600 mb-4">
                Type or paste content directly. Perfect for policies, FAQs, or quick notes.
              </p>
              <div className="text-sm text-gray-500">
                <p>• Direct text input</p>
                <p>• Word and character count</p>
                <p>• Instant upload</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* File Upload Mode */}
      {uploadMode === 'file' && (
        <Card>
          <div className="p-6">
            <FileUpload
              onUpload={handleFileUpload}
              loading={isUploading}
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              accept=".txt,.pdf,.doc,.docx,.md"
            />
          </div>
        </Card>
      )}

      {/* Text Upload Mode */}
      {uploadMode === 'text' && (
        <Card>
          <div className="p-6">
            <TextUpload
              onUpload={handleTextUpload}
              loading={isUploading}
            />
          </div>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Supported File Types</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Plain Text (.txt, .md)</li>
                <li>• PDF Documents (.pdf)</li>
                <li>• Word Documents (.doc, .docx)</li>
                <li>• Rich Text Format (.rtf)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use descriptive filenames</li>
                <li>• Keep content organized and structured</li>
                <li>• Break large documents into smaller sections</li>
                <li>• Include relevant keywords and context</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}