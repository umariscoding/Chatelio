import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "@/utils/api";
import { setChats, setMessages, setLoading, setError, addOrUpdateChat, removeChat } from "../slices/chatSlice";
import type { Chat, Message } from "@/types/chat";

export const fetchChatListThunk = createAsyncThunk(
  "chat/fetchList",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.get("/chat/list");
      const chats: Chat[] = response.data.chats || [];
      dispatch(setChats(chats));
      return chats;
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to fetch chat list";
      dispatch(setError(errorMsg));
      return rejectWithValue(errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchChatHistoryThunk = createAsyncThunk(
  "chat/fetchHistory",
  async (chatId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.get(`/chat/history/${chatId}`);
      const messages: Message[] = response.data.messages || [];
      dispatch(setMessages(messages));
      return messages;
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to fetch chat history";
      dispatch(setError(errorMsg));
      return rejectWithValue(errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const renameChatThunk = createAsyncThunk(
  "chat/rename",
  async ({ chatId, title }: { chatId: string; title: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await userApi.put(`/chat/title/${chatId}`, { title });
      const updatedChat: Chat = response.data.chat;
      dispatch(addOrUpdateChat(updatedChat));
      return updatedChat;
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to rename chat";
      dispatch(setError(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteChatThunk = createAsyncThunk(
  "chat/delete",
  async (chatId: string, { dispatch, rejectWithValue }) => {
    try {
      await userApi.delete(`/chat/${chatId}`);
      dispatch(removeChat(chatId));
      return chatId;
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to delete chat";
      dispatch(setError(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
