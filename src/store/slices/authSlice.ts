import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { User, Company, Tokens, UserType } from '@/types/auth';
import { api } from '@/utils/api';

interface AuthState {
  // Company Authentication
  company: Company | null;
  companyTokens: Tokens | null;
  isCompanyAuthenticated: boolean;
  companyLoading: boolean;
  
  // User Authentication  
  user: User | null;
  userTokens: Tokens | null;
  isUserAuthenticated: boolean;
  userLoading: boolean;
  
  // Current Active Session
  activeSession: 'company' | 'user' | null;
  
  // Shared
  error: string | null;
}

const initialState: AuthState = {
  // Company state
  company: null,
  companyTokens: null,
  isCompanyAuthenticated: false,
  companyLoading: false,
  
  // User state
  user: null,
  userTokens: null,
  isUserAuthenticated: false,
  userLoading: false,
  
  // Active session
  activeSession: null,
  
  // Shared
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

// Verify Company Token
export const verifyCompanyToken = createAsyncThunk(
  'auth/verifyCompanyToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.companyTokens?.access_token || localStorage.getItem('company_access_token');
      
      if (!token) {
        throw new Error('No company token found');
      }
      
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Company token verification failed'
      );
    }
  }
);

// Verify User Token  
export const verifyUserToken = createAsyncThunk(
  'auth/verifyUserToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.userTokens?.access_token || localStorage.getItem('user_access_token');
      
      if (!token) {
        throw new Error('No user token found');
      }
      
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'User token verification failed'
      );
    }
  }
);

// Legacy verify token (for backward compatibility)
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      let token = null;
      
      if (state.auth.activeSession === 'company') {
        token = state.auth.companyTokens?.access_token || localStorage.getItem('company_access_token');
      } else if (state.auth.activeSession === 'user') {
        token = state.auth.userTokens?.access_token || localStorage.getItem('user_access_token');
      }
      
      if (!token) {
        throw new Error('No token found');
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Company Actions
    logoutCompany: (state) => {
      state.company = null;
      state.companyTokens = null;
      state.isCompanyAuthenticated = false;
      state.companyLoading = false;
      if (state.activeSession === 'company') {
        state.activeSession = null;
      }
      state.error = null;
      
      // Clear company tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('company_access_token');
        localStorage.removeItem('company_refresh_token');
        localStorage.removeItem('active_session');
      }
    },
    updateCompanyInfo: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    setActiveSessionCompany: (state) => {
      state.activeSession = 'company';
      if (typeof window !== 'undefined') {
        localStorage.setItem('active_session', 'company');
      }
    },
    
    // User Actions
    logoutUser: (state) => {
      state.user = null;
      state.userTokens = null;
      state.isUserAuthenticated = false;
      state.userLoading = false;
      if (state.activeSession === 'user') {
        state.activeSession = null;
      }
      state.error = null;
      
      // Clear user tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('user_refresh_token');
        localStorage.removeItem('active_session');
      }
    },
    setActiveSessionUser: (state) => {
      state.activeSession = 'user';
      if (typeof window !== 'undefined') {
        localStorage.setItem('active_session', 'user');
      }
    },
    setUserData: (state, action: PayloadAction<{ user: User; tokens: Tokens }>) => {
      state.user = action.payload.user;
      state.userTokens = action.payload.tokens;
      state.isUserAuthenticated = true;
      state.userLoading = false;
      state.error = null;
      
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_access_token', action.payload.tokens.access_token);
        localStorage.setItem('user_refresh_token', action.payload.tokens.refresh_token);
      }
    },
    
    // Load tokens from storage
    loadTokensFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        // Load company tokens
        const companyAccessToken = localStorage.getItem('company_access_token');
        const companyRefreshToken = localStorage.getItem('company_refresh_token');
        
        if (companyAccessToken && companyRefreshToken) {
          state.companyTokens = {
            access_token: companyAccessToken,
            refresh_token: companyRefreshToken,
            token_type: 'bearer',
          };
          state.isCompanyAuthenticated = true;
        }
        
        // Load user tokens
        const userAccessToken = localStorage.getItem('user_access_token');
        const userRefreshToken = localStorage.getItem('user_refresh_token');
        
        if (userAccessToken && userRefreshToken) {
          state.userTokens = {
            access_token: userAccessToken,
            refresh_token: userRefreshToken,
            token_type: 'bearer',
          };
          state.isUserAuthenticated = true;
        }
        
        // Load active session
        const activeSession = localStorage.getItem('active_session') as 'company' | 'user' | null;
        state.activeSession = activeSession;
      }
    },
  },
  extraReducers: (builder) => {
    // Company Registration
    builder
      .addCase(registerCompany.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.company = action.payload.company;
        state.companyTokens = action.payload.tokens;
        state.isCompanyAuthenticated = true;
        state.activeSession = 'company';
        
        // Store company tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('company_access_token', action.payload.tokens.access_token);
          localStorage.setItem('company_refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('active_session', 'company');
        }
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload as string;
      });

    // Company Login
    builder
      .addCase(loginCompany.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.company = action.payload.company;
        state.companyTokens = action.payload.tokens;
        state.isCompanyAuthenticated = true;
        state.activeSession = 'company';
        
        // Store company tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('company_access_token', action.payload.tokens.access_token);
          localStorage.setItem('company_refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('active_session', 'company');
        }
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload as string;
      });

    // User Registration
    builder
      .addCase(registerUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload.user;
        state.userTokens = action.payload.tokens;
        state.isUserAuthenticated = true;
        state.activeSession = 'user';
        
        // Store user tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_access_token', action.payload.tokens.access_token);
          localStorage.setItem('user_refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('active_session', 'user');
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      });

    // User Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload.user;
        state.userTokens = action.payload.tokens;
        state.isUserAuthenticated = true;
        state.activeSession = 'user';
        
        // Store user tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_access_token', action.payload.tokens.access_token);
          localStorage.setItem('user_refresh_token', action.payload.tokens.refresh_token);
          localStorage.setItem('active_session', 'user');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      });

    // Company Token Verification
    builder
      .addCase(verifyCompanyToken.pending, (state) => {
        state.companyLoading = true;
      })
      .addCase(verifyCompanyToken.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.isCompanyAuthenticated = action.payload.valid;
        if (action.payload.valid && action.payload.company) {
          state.company = action.payload.company;
        } else if (!action.payload.valid) {
          // Company token invalid
          state.company = null;
          state.companyTokens = null;
          state.isCompanyAuthenticated = false;
          state.activeSession = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('company_access_token');
            localStorage.removeItem('company_refresh_token');
            localStorage.removeItem('active_session');
          }
        }
      })
      .addCase(verifyCompanyToken.rejected, (state) => {
        state.companyLoading = false;
        state.company = null;
        state.companyTokens = null;
        state.isCompanyAuthenticated = false;
        state.activeSession = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('company_access_token');
          localStorage.removeItem('company_refresh_token');
          localStorage.removeItem('active_session');
        }
      });

    // User Token Verification  
    builder
      .addCase(verifyUserToken.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(verifyUserToken.fulfilled, (state, action) => {
        state.userLoading = false;
        state.isUserAuthenticated = action.payload.valid;
        if (action.payload.valid && action.payload.user) {
          state.user = action.payload.user;
        } else if (!action.payload.valid) {
          // User token invalid
          state.user = null;
          state.userTokens = null;
          state.isUserAuthenticated = false;
          state.activeSession = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user_access_token');
            localStorage.removeItem('user_refresh_token');
            localStorage.removeItem('active_session');
          }
        }
      })
      .addCase(verifyUserToken.rejected, (state) => {
        state.userLoading = false;
        state.user = null;
        state.userTokens = null;
        state.isUserAuthenticated = false;
        state.activeSession = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_access_token');
          localStorage.removeItem('user_refresh_token');
          localStorage.removeItem('active_session');
        }
      });

    // Token Verification - needs to be updated to handle both company and user tokens
    builder
      .addCase(verifyToken.pending, (state) => {
        if (state.activeSession === 'company') {
          state.companyLoading = true;
        } else if (state.activeSession === 'user') {
          state.userLoading = true;
        }
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        if (state.activeSession === 'company') {
          state.companyLoading = false;
          state.isCompanyAuthenticated = action.payload.valid;
          if (action.payload.valid && action.payload.company) {
            state.company = action.payload.company;
          } else if (!action.payload.valid) {
            // Company token invalid
            state.company = null;
            state.companyTokens = null;
            state.isCompanyAuthenticated = false;
            if (typeof window !== 'undefined') {
              localStorage.removeItem('company_access_token');
              localStorage.removeItem('company_refresh_token');
            }
          }
        } else if (state.activeSession === 'user') {
          state.userLoading = false;
          state.isUserAuthenticated = action.payload.valid;
          if (action.payload.valid && action.payload.user) {
            state.user = action.payload.user;
          } else if (!action.payload.valid) {
            // User token invalid
            state.user = null;
            state.userTokens = null;
            state.isUserAuthenticated = false;
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user_access_token');
              localStorage.removeItem('user_refresh_token');
            }
          }
        }
      })
      .addCase(verifyToken.rejected, (state) => {
        if (state.activeSession === 'company') {
          state.companyLoading = false;
          state.isCompanyAuthenticated = false;
          state.company = null;
          state.companyTokens = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('company_access_token');
            localStorage.removeItem('company_refresh_token');
          }
        } else if (state.activeSession === 'user') {
          state.userLoading = false;
          state.isUserAuthenticated = false;
          state.user = null;
          state.userTokens = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user_access_token');
            localStorage.removeItem('user_refresh_token');
          }
        }
      });
  },
});

export const { 
  setError, 
  clearError, 
  logoutCompany,
  logoutUser,
  updateCompanyInfo,
  setActiveSessionCompany,
  setActiveSessionUser,
  setUserData,
  loadTokensFromStorage 
} = authSlice.actions;

export default authSlice.reducer;
