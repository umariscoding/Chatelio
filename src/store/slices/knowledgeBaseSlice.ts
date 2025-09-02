// Knowledge Base slice - will be implemented in Day 4
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Document } from '@/types/knowledgeBase';

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
    // Will add more reducers in Day 4
  },
});

export const { setLoading, setError } = knowledgeBaseSlice.actions;
export default knowledgeBaseSlice.reducer;
