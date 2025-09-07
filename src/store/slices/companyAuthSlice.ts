import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Company, Tokens } from '@/types/auth';
import { api } from '@/utils/api';

interface CompanyAuthState {
  company: Company | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyAuthState = {
  company: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Company Registration
export const registerCompany = createAsyncThunk(
  'companyAuth/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/company/register', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Registration failed'
      );
    }
  }
);

// Company Login
export const loginCompany = createAsyncThunk(
  'companyAuth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/company/login', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Login failed'
      );
    }
  }
);

// Verify Company Token
export const verifyCompanyToken = createAsyncThunk(
  'companyAuth/verify',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { companyAuth: CompanyAuthState };
      const token = state.companyAuth.tokens?.access_token || localStorage.getItem('company_access_token');
      
      if (!token) {
        throw new Error('No company token found');
      }
      
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Token verification failed'
      );
    }
  }
);

const companyAuthSlice = createSlice({
  name: 'companyAuth',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.company = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('company_access_token');
        localStorage.removeItem('company_refresh_token');
      }
    },
    updateCompanyInfo: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    // Load tokens from storage
    loadFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('company_access_token');
        const refreshToken = localStorage.getItem('company_refresh_token');
        
        if (accessToken && refreshToken) {
          state.tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'bearer',
          };
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Company Registration
    builder
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('company_access_token', action.payload.tokens.access_token);
          localStorage.setItem('company_refresh_token', action.payload.tokens.refresh_token);
        }
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Company Login
    builder
      .addCase(loginCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('company_access_token', action.payload.tokens.access_token);
          localStorage.setItem('company_refresh_token', action.payload.tokens.refresh_token);
        }
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Token Verification
    builder
      .addCase(verifyCompanyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyCompanyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.valid;
        if (action.payload.valid && action.payload.company) {
          state.company = action.payload.company;
        } else if (!action.payload.valid) {
          // Token invalid - clear everything
          state.company = null;
          state.tokens = null;
          state.isAuthenticated = false;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('company_access_token');
            localStorage.removeItem('company_refresh_token');
          }
        }
      })
      .addCase(verifyCompanyToken.rejected, (state) => {
        state.loading = false;
        state.company = null;
        state.tokens = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('company_access_token');
          localStorage.removeItem('company_refresh_token');
        }
      });
  },
});

export const { 
  setError, 
  clearError, 
  logout,
  updateCompanyInfo,
  loadFromStorage 
} = companyAuthSlice.actions;

export default companyAuthSlice.reducer;
