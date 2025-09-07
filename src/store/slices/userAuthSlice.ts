import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, Tokens } from '@/types/auth';
import { api } from '@/utils/api';

interface UserAuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserAuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// User Registration
export const registerUser = createAsyncThunk(
  'userAuth/register',
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
  'userAuth/login',
  async (data: { email: string; password: string; company_id: string }, { rejectWithValue }) => {
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

// Verify User Token
export const verifyUserToken = createAsyncThunk(
  'userAuth/verify',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { userAuth: UserAuthState };
      const token = state.userAuth.tokens?.access_token || localStorage.getItem('user_access_token');
      
      if (!token) {
        throw new Error('No user token found');
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

// Graceful User Token Verification (doesn't clear tokens on failure)
export const verifyUserTokenGraceful = createAsyncThunk(
  'userAuth/verifyGraceful',
  async (_, { getState }) => {
    try {
      const state = getState() as { userAuth: UserAuthState };
      const token = state.userAuth.tokens?.access_token || localStorage.getItem('user_access_token');
      
      if (!token) {
        return { valid: false, reason: 'No token found' };
      }
      
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { ...response.data, valid: true };
    } catch (error: any) {
      // Return failure info without throwing
      return { 
        valid: false, 
        reason: error.response?.data?.detail || error.message || 'Token verification failed' 
      };
    }
  }
);

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('user_refresh_token');
      }
    },
    setUserData: (state, action: PayloadAction<{ user: User; tokens: Tokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_access_token', action.payload.tokens.access_token);
        localStorage.setItem('user_refresh_token', action.payload.tokens.refresh_token);
      }
    },
    // Load tokens from storage
    loadFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('user_access_token');
        const refreshToken = localStorage.getItem('user_refresh_token');
        
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
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_access_token', action.payload.tokens.access_token);
          localStorage.setItem('user_refresh_token', action.payload.tokens.refresh_token);
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
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_access_token', action.payload.tokens.access_token);
          localStorage.setItem('user_refresh_token', action.payload.tokens.refresh_token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Token Verification (strict - clears tokens on failure)
    builder
      .addCase(verifyUserToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUserToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.valid;
        if (action.payload.valid && action.payload.user_info) {
          state.user = action.payload.user_info;
        } else if (!action.payload.valid) {
          // Token invalid - clear everything
          state.user = null;
          state.tokens = null;
          state.isAuthenticated = false;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user_access_token');
            localStorage.removeItem('user_refresh_token');
          }
        }
      })
      .addCase(verifyUserToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_access_token');
          localStorage.removeItem('user_refresh_token');
        }
      });

    // Graceful Token Verification (doesn't clear tokens on failure)
    builder
      .addCase(verifyUserTokenGraceful.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUserTokenGraceful.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.valid && action.payload.user_info) {
          state.user = action.payload.user_info;
          state.isAuthenticated = true;
        } else {
          // Token is invalid but don't clear it - let the component handle it
          state.isAuthenticated = false;
        }
      })
      .addCase(verifyUserTokenGraceful.rejected, (state) => {
        state.loading = false;
        // Don't clear tokens on graceful verification failure
        state.isAuthenticated = false;
      });
  },
});

export const { 
  setError, 
  clearError, 
  logout,
  setUserData,
  loadFromStorage 
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
