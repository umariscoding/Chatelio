import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { Document, DocumentListResponse, UploadTextRequest, DocumentUploadResponse } from '@/types/knowledgeBase';
import { companyApi as api } from '@/utils/company/api';

interface KnowledgeBaseState {
  documents: Document[];
  uploadProgress: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: KnowledgeBaseState = {
  documents: [],
  uploadProgress: {},
  loading: false,
  error: null,
};

// List Documents
export const listDocuments = createAsyncThunk(
  'knowledgeBase/listDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<DocumentListResponse>('/chat/documents');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to fetch documents'
      );
    }
  }
);

// Upload Text Content
export const uploadText = createAsyncThunk(
  'knowledgeBase/uploadText',
  async (data: UploadTextRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<DocumentUploadResponse>('/chat/upload-text', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to upload text'
      );
    }
  }
);

// Upload File
export const uploadFile = createAsyncThunk(
  'knowledgeBase/uploadFile',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<DocumentUploadResponse>('/chat/upload-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to upload file'
      );
    }
  }
);

// Delete Document
export const deleteDocument = createAsyncThunk(
  'knowledgeBase/deleteDocument',
  async (docId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/chat/documents/${docId}`);
      return docId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to delete document'
      );
    }
  }
);

const knowledgeBaseSlice = createSlice({
  name: 'knowledgeBase',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      state.uploadProgress[action.payload.id] = action.payload.progress;
    },
    removeUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },
    resetKnowledgeBase: (state) => {
      state.documents = [];
      state.uploadProgress = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // List Documents
    builder
      .addCase(listDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents;
      })
      .addCase(listDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload Text
    builder
      .addCase(uploadText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadText.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.unshift(action.payload.document);
      })
      .addCase(uploadText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload File
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.unshift(action.payload.document);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Document
    builder
      .addCase(deleteDocument.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc.doc_id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetKnowledgeBase 
} = knowledgeBaseSlice.actions;

export default knowledgeBaseSlice.reducer;
