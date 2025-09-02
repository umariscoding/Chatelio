// Auth slice - will be implemented in Day 1
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Company, Tokens } from '@/types/auth';

interface AuthState {
  user: User | null;
  company: Company | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  userType: 'company' | 'user' | 'guest' | null;
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
    // Will add more reducers in Day 1
  },
});

export const { setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
