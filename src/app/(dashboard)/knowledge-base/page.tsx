"use client";

import React, { useState } from "react";

import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  uploadFile,
  uploadText,
} from "@/store/company/slices/knowledgeBaseSlice";
import { Icons, IOSContentLoader } from "@/components/ui";
import DocumentList from "@/components/knowledge-base/DocumentList";
import FileUpload from "@/components/knowledge-base/FileUpload";
import TextUpload from "@/components/knowledge-base/TextUpload";

type UploadMode = "file" | "text";

export default function KnowledgeBasePage() {
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const knowledgeBase = useCompanyAppSelector((state) => state.knowledgeBase);
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");
  const [isUploading, setIsUploading] = useState(false);

  // Check if page is loading
  if (companyAuth.loading) {
    return (
      <IOSContentLoader isLoading={true} message="Loading knowledge base..." />
    );
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await dispatch(uploadFile(file)).unwrap();
      // Keep upload section open for more uploads
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextUpload = async (content: string, filename: string) => {
    setIsUploading(true);
    try {
      await dispatch(uploadText({ content, filename })).unwrap();
      // Keep upload section open for more uploads
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Only company accounts can access knowledge base management
  if (!companyAuth.isAuthenticated) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100">
              <Icons.BookOpen className="h-10 w-10 text-primary-600" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-text-primary">
                Knowledge Base
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Access to knowledge base management is restricted to company
                accounts.
              </p>
            </div>

            {/* Access Restricted Card */}
            <div className="bg-bg-secondary border border-border-light rounded-xl p-8 max-w-md mx-auto">
              <div className="text-center space-y-4">
                <Icons.Shield className="mx-auto h-12 w-12 text-warning-500" />
                <h3 className="text-lg font-medium text-text-primary">
                  Access Restricted
                </h3>
                <p className="text-text-secondary">
                  Only company administrators can manage the knowledge base and
                  upload documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
            <Icons.BookOpen className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Knowledge Base
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Manage your documents and content that powers your chatbot's
            responses
          </p>
        </div>

        {/* Upload Mode Switch - Always Visible & Centered */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-neutral-100 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setUploadMode("file")}
              className={`flex items-center space-x-2 px-6 py-3 text-base font-medium rounded-lg transition-all ${
                uploadMode === "file"
                  ? "bg-white text-primary-600 shadow-md"
                  : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              <Icons.CloudUpload className="h-5 w-5" />
              <span>Upload Files</span>
            </button>
            <button
              onClick={() => setUploadMode("text")}
              className={`flex items-center space-x-2 px-6 py-3 text-base font-medium rounded-lg transition-all ${
                uploadMode === "text"
                  ? "bg-white text-primary-600 shadow-md"
                  : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              <Icons.Document className="h-5 w-5" />
              <span>Add Text</span>
            </button>
          </div>
        </div>

        {/* Upload Interface - Always Visible */}
        <div className="bg-bg-primary border border-border-light rounded-xl p-6 mb-8">
          {uploadMode === "file" && (
            <FileUpload
              onUpload={handleFileUpload}
              loading={isUploading}
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              accept=".txt,.pdf,.doc,.docx,.md"
            />
          )}

          {uploadMode === "text" && (
            <TextUpload onUpload={handleTextUpload} loading={isUploading} />
          )}
        </div>

        {/* Documents List */}
        <DocumentList />
      </div>
    </div>
  );
}
