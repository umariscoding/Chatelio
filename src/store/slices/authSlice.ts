import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { User, Company, Tokens, UserType } from '@/types/auth';
import { api } from '@/utils/api';

interface AuthState {
  user: User | null;
  company: Company | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  userType: UserType | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  company: null,
  tokens: null,
  isAuthenticated: false,
  userType: null,
  loading: false,
  error: null,
};

// Company Registration
export const registerCompany = createAsyncThunk(
  'auth/registerCompany',
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
  'auth/loginCompany',
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

// User Registration  
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string; password: string; name: string; company_id: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/register', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Registration failed'
      );
    }
  }
);

// User Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/login', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Login failed'
      );
    }
  }
);

// Verify Token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Token verification failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.company = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.error = null;
      // Clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_type');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    loadTokensFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userType = localStorage.getItem('user_type') as UserType;
        
        if (accessToken && refreshToken) {
          state.tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'bearer',
          };
          state.userType = userType;
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
        state.userType = 'company';
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', action.payload.tokens.access_token);
          localStorage.setItem('refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('user_type', 'company');
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
        state.userType = 'company';
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', action.payload.tokens.access_token);
          localStorage.setItem('refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('user_type', 'company');
        }
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // User Registration
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.userType = 'user';
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', action.payload.tokens.access_token);
          localStorage.setItem('refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('user_type', 'user');
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // User Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.userType = 'user';
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', action.payload.tokens.access_token);
          localStorage.setItem('refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('user_type', 'user');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Token Verification
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.valid;
        if (!action.payload.valid) {
          // Token is invalid, clear auth state
          state.user = null;
          state.company = null;
          state.tokens = null;
          state.userType = null;
        }
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.company = null;
        state.tokens = null;
        state.userType = null;
      });
  },
});

export const { 
  setLoading, 
  setError, 
  logout, 
  clearError, 
  loadTokensFromStorage 
} = authSlice.actions;

export default authSlice.reducer;
