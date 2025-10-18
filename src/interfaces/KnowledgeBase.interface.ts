import type { Document } from "@/types/knowledgeBase";

export interface DocumentListProps {
  className?: string;
}

export interface DocumentItemProps {
  document: Document;
  onDelete: (docId: string) => void;
  className?: string;
}

export interface FileUploadProps {
  onUpload: (file: File) => void;
  loading?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
}

export interface TextUploadProps {
  onUpload: (content: string, filename: string) => void;
  loading?: boolean;
  className?: string;
}
