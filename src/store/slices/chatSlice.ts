import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Chat, Message, StreamingState } from "@/types/chat";

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
    streamingMessage: "",
  },
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
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
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (
      state,
      action: PayloadAction<{ id: string; content: string }>,
    ) => {
      const message = state.messages.find((m) => m.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
      }
    },
    startStreaming: (state, action: PayloadAction<{ chatId?: string }>) => {
      state.streaming.isStreaming = true;
      state.streaming.currentChatId = action.payload.chatId;
      state.streaming.streamingMessage = "";
    },
    appendStreamingContent: (state, action: PayloadAction<string>) => {
      state.streaming.streamingMessage += action.payload;
    },
    stopStreaming: (state) => {
      if (state.streaming.streamingMessage) {
        state.messages.push({
          id: `msg-${Date.now()}`,
          role: "ai",
          content: state.streaming.streamingMessage,
          timestamp: Date.now(),
        });
      }
      state.streaming.isStreaming = false;
      state.streaming.currentChatId = undefined;
      state.streaming.streamingMessage = "";
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addOrUpdateChat: (state, action: PayloadAction<Chat>) => {
      const existingIndex = state.chats.findIndex(
        (chat) => chat.chat_id === action.payload.chat_id,
      );
      if (existingIndex >= 0) {
        state.chats[existingIndex] = action.payload;
      } else {
        state.chats.unshift(action.payload);
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.chat_id !== action.payload);
      if (state.currentChat?.chat_id === action.payload) {
        state.currentChat = null;
        state.messages = [];
      }
    },
    resetChat: (state) => {
      state.chats = [];
      state.currentChat = null;
      state.messages = [];
      state.streaming = {
        isStreaming: false,
        currentChatId: undefined,
        streamingMessage: "",
      };
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCurrentChat,
  setMessages,
  setChats,
  addMessage,
  updateMessage,
  startStreaming,
  appendStreamingContent,
  stopStreaming,
  clearMessages,
  addOrUpdateChat,
  removeChat,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
