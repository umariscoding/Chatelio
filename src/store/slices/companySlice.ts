// Company slice - will be implemented in Day 6
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '@/types/auth';

interface CompanyState {
  company: Company | null;
  publicChatbot: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  publicChatbot: null,
  loading: false,
  error: null,
};

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
    // Will add more reducers in Day 6
  },
});

export const { setLoading, setError } = companySlice.actions;
export default companySlice.reducer;
