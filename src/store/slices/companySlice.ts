import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { Company } from '@/types/auth';
import { api } from '@/utils/api';

interface PublishChatbotRequest {
  is_published: boolean;
  chatbot_title: string;
  chatbot_description: string;
}

interface PublishChatbotResponse {
  message: string;
  is_published: boolean;
  public_url: string;
}

interface UpdateSlugRequest {
  slug: string;
}

interface UpdateSlugResponse {
  message: string;
  slug: string;
  public_url: string;
}

interface CompanyState {
  company: Company | null;
  publicUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  publicUrl: null,
  loading: false,
  error: null,
};

// Update Company Slug
export const updateCompanySlug = createAsyncThunk(
  'company/updateSlug',
  async (data: UpdateSlugRequest, { rejectWithValue }) => {
    try {
      const response = await api.put<UpdateSlugResponse>('/auth/company/slug', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to update slug'
      );
    }
  }
);

// Publish/Unpublish Chatbot
export const publishChatbot = createAsyncThunk(
  'company/publishChatbot',
  async (data: PublishChatbotRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<PublishChatbotResponse>('/auth/company/publish-chatbot', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to publish chatbot'
      );
    }
  }
);

const companySlice = createSlice({
  name: 'company',
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
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
      // Generate public URL if slug exists
      if (action.payload.slug && typeof window !== 'undefined') {
        state.publicUrl = `${window.location.origin}/${action.payload.slug}`;
      }
    },
    updatePublishStatus: (state, action: PayloadAction<{ is_published: boolean; public_url?: string }>) => {
      if (state.company) {
        state.company.is_published = action.payload.is_published;
      }
      if (action.payload.public_url) {
        state.publicUrl = action.payload.public_url;
      }
    },
  },
  extraReducers: (builder) => {
    // Update Slug
    builder
      .addCase(updateCompanySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanySlug.fulfilled, (state, action) => {
        state.loading = false;
        if (state.company) {
          state.company.slug = action.payload.slug;
        }
        state.publicUrl = action.payload.public_url;
      })
      .addCase(updateCompanySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Publish Chatbot
    builder
      .addCase(publishChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishChatbot.fulfilled, (state, action) => {
        state.loading = false;
        if (state.company) {
          state.company.is_published = action.payload.is_published;
        }
        state.publicUrl = action.payload.public_url;
      })
      .addCase(publishChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setLoading, 
  setError, 
  clearError,
  setCompany,
  updatePublishStatus,
} = companySlice.actions;

export default companySlice.reducer;
