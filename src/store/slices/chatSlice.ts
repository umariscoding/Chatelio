import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { 
  Chat, 
  Message, 
  ChatListResponse, 
  ChatHistoryResponse, 
  SendMessageRequest, 
  UpdateChatTitleRequest,
  StreamingState 
} from '@/types/chat';
import { api } from '@/utils/api';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  streaming: StreamingState;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  streaming: {
    isStreaming: false,
    currentChatId: undefined,
    streamingMessage: '',
  },
  loading: false,
  error: null,
};

// List Chats
export const listChats = createAsyncThunk(
  'chat/listChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ChatListResponse>('/chat/list');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to fetch chats'
      );
    }
  }
);

// Get Chat History
export const getChatHistory = createAsyncThunk(
  'chat/getChatHistory',
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ChatHistoryResponse>(`/chat/history/${chatId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to fetch chat history'
      );
    }
  }
);

// Update Chat Title
export const updateChatTitle = createAsyncThunk(
  'chat/updateChatTitle',
  async ({ chatId, title }: { chatId: string; title: string }, { rejectWithValue }) => {
    try {
      await api.put(`/chat/title/${chatId}`, { title });
      return { chatId, title };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to update chat title'
      );
    }
  }
);

// Delete Chat
export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/chat/${chatId}`);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || 'Failed to delete chat'
      );
    }
  }
);

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
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
      if (!action.payload) {
        state.messages = [];
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
      }
    },
    startStreaming: (state, action: PayloadAction<{ chatId?: string }>) => {
      state.streaming.isStreaming = true;
      state.streaming.currentChatId = action.payload.chatId;
      state.streaming.streamingMessage = '';
    },
    appendStreamingContent: (state, action: PayloadAction<string>) => {
      state.streaming.streamingMessage += action.payload;
    },
    stopStreaming: (state) => {
      // Add the completed streaming message to messages
      if (state.streaming.streamingMessage) {
        state.messages.push({
          id: `msg-${Date.now()}`,
          role: 'ai',
          content: state.streaming.streamingMessage,
          timestamp: Date.now(),
        });
      }
      state.streaming.isStreaming = false;
      state.streaming.currentChatId = undefined;
      state.streaming.streamingMessage = '';
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addOrUpdateChat: (state, action: PayloadAction<Chat>) => {
      const existingIndex = state.chats.findIndex(chat => chat.chat_id === action.payload.chat_id);
      if (existingIndex >= 0) {
        state.chats[existingIndex] = action.payload;
      } else {
        state.chats.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // List Chats
    builder
      .addCase(listChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats;
      })
      .addCase(listChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Chat History
    builder
      .addCase(getChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Chat Title
    builder
      .addCase(updateChatTitle.fulfilled, (state, action) => {
        const { chatId, title } = action.payload;
        const chat = state.chats.find(c => c.chat_id === chatId);
        if (chat) {
          chat.title = title;
        }
        if (state.currentChat?.chat_id === chatId) {
          state.currentChat.title = title;
        }
      })
      .addCase(updateChatTitle.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete Chat
    builder
      .addCase(deleteChat.fulfilled, (state, action) => {
        const chatId = action.payload;
        state.chats = state.chats.filter(chat => chat.chat_id !== chatId);
        if (state.currentChat?.chat_id === chatId) {
          state.currentChat = null;
          state.messages = [];
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  setLoading, 
  setError, 
  clearError,
  setCurrentChat,
  addMessage,
  updateMessage,
  startStreaming,
  appendStreamingContent,
  stopStreaming,
  clearMessages,
  addOrUpdateChat,
} = chatSlice.actions;

export default chatSlice.reducer;
