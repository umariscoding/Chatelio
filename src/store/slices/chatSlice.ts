// Chat slice - will be implemented in Day 5
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message } from '@/types/chat';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isTyping: boolean;
  streamingMessage: string;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  isTyping: false,
  streamingMessage: '',
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Will add more reducers in Day 5
  },
});

export const { setLoading, setError } = chatSlice.actions;
export default chatSlice.reducer;
