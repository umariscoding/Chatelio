import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { Company } from '@/types/auth';
import { api } from '@/utils/api';

interface UpdateChatbotInfoRequest {
  chatbot_title: string;
  chatbot_description: string;
}

interface UpdateChatbotInfoResponse {
  message: string;
  chatbot_title: string;
  chatbot_description: string;
}

interface PublishChatbotRequest {
  is_published: boolean;
}

interface PublishChatbotResponse {
  message: string;
  is_published: boolean;
  public_url?: string;
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
  publicUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
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
      const errorMessage = typeof error.response?.data?.detail === 'string' 
        ? error.response.data.detail 
        : error.message || 'Failed to update slug';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Chatbot Info
export const updateChatbotInfo = createAsyncThunk(
  'company/updateChatbotInfo',
  async (data: UpdateChatbotInfoRequest, { rejectWithValue }) => {
    try {
      const response = await api.put<UpdateChatbotInfoResponse>('/auth/company/chatbot-info', data);
      return response.data;
    } catch (error: any) {
      const errorMessage = typeof error.response?.data?.detail === 'string' 
        ? error.response.data.detail 
        : error.message || 'Failed to update chatbot info';
      return rejectWithValue(errorMessage);
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
      const errorMessage = typeof error.response?.data?.detail === 'string' 
        ? error.response.data.detail 
        : error.message || 'Failed to publish chatbot';
      return rejectWithValue(errorMessage);
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
    setPublicUrl: (state, action: PayloadAction<string>) => {
      state.publicUrl = action.payload;
    },
    resetCompany: (state) => {
      state.publicUrl = null;
      state.loading = false;
      state.error = null;
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
        state.publicUrl = action.payload.public_url;
      })
      .addCase(updateCompanySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Chatbot Info
    builder
      .addCase(updateChatbotInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatbotInfo.fulfilled, (state, action) => {
        state.loading = false;
        // Company data will be updated in companyAuthSlice
      })
      .addCase(updateChatbotInfo.rejected, (state, action) => {
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
        if (action.payload.public_url) {
          state.publicUrl = action.payload.public_url;
        }
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
  setPublicUrl,
  resetCompany,
} = companySlice.actions;

export default companySlice.reducer;
