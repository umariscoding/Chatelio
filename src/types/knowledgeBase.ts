// Knowledge Base related types
export interface Document {
  doc_id: string;
  kb_id: string;
  filename: string;
  content_type: string;
  file_size: number;
  embeddings_status: 'pending' | 'failed' | 'completed';
  created_at: string;
}

export interface DocumentListResponse {
  documents: Document[];
}

export interface UploadTextRequest {
  content: string;
  filename: string;
}

export interface DocumentUploadResponse {
  message: string;
  document: Document;
}
