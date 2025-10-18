"use client";

import React, { useState } from "react";

import Button from "@/components/ui/Button";
import MinimalInput from "@/components/ui/MinimalInput";
import { Icons } from "@/components/ui";
import type { TextUploadProps } from "@/interfaces/KnowledgeBase.interface";

const TextUpload: React.FC<TextUploadProps> = ({
  onUpload,
  loading = false,
  className = "",
}) => {
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ filename?: string; content?: string }>(
    {},
  );

  const validateForm = (): boolean => {
    const newErrors: { filename?: string; content?: string } = {};

    if (!filename.trim()) {
      newErrors.filename = "Filename is required";
    } else if (!filename.endsWith(".txt") && !filename.includes(".")) {
      // Auto-add .txt extension if no extension provided
      setFilename((prev) => prev + ".txt");
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onUpload(content.trim(), filename.trim());
      // Reset form after successful upload
      setFilename("");
      setContent("");
      setErrors({});
    }
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
    if (errors.filename) {
      setErrors((prev) => ({ ...prev, filename: undefined }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <Icons.Document className="mx-auto h-12 w-12 text-secondary-400" />
        <h3 className="mt-4 text-lg font-medium text-secondary-100">
          Add Text Content
        </h3>
        <p className="mt-1 text-sm text-secondary-300">
          Paste or type your content directly to add it to your knowledge base.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Filename Input */}
        <div>
          <MinimalInput
            label="Filename"
            type="text"
            value={filename}
            onChange={handleFilenameChange}
            error={errors.filename}
            placeholder="e.g., company-policy.txt"
            required
            disabled={loading}
            variant="floating"
            theme="light"
          />
          <p className="mt-1 text-sm text-secondary-300">
            Enter a descriptive filename for your content
          </p>
        </div>

        {/* Content Textarea */}
        <div>
          <label className="block text-sm font-medium text-secondary-200 mb-2">
            Content *
          </label>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Paste or type your content here..."
            rows={12}
            className={`w-full rounded-md border border-secondary-700 bg-secondary-900 text-secondary-100 placeholder-secondary-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.content ? "border-error-500 focus:ring-error-500" : ""
            }`}
            disabled={loading}
            required
          />
          {errors.content && (
            <p className="mt-1 text-sm text-error-600">{errors.content}</p>
          )}

          {/* Character and Word Count */}
          <div className="mt-2 flex justify-between text-xs text-secondary-300">
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
      <div className="bg-primary-900 border border-primary-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-primary-200 mb-2">
          Tips for better results:
        </h4>
        <ul className="text-sm text-primary-300 space-y-1">
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
