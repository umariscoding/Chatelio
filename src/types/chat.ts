// Chat related types
export interface Message {
  id?: string;
  role: 'human' | 'ai';
  content: string;
  timestamp: number;
  loading?: boolean;
}

export interface Chat {
  chat_id: string;
  title: string;
  is_guest: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
  message_count?: number;
}

export interface SendMessageRequest {
  message: string;
  chat_id?: string;
  chat_title?: string;
  model: 'OpenAI' | 'Claude';
}

export interface ChatStreamResponse {
  chat_id?: string;
  type: 'start' | 'chunk' | 'end';
  content?: string;
}

export interface ChatHistoryResponse {
  messages: Message[];
}

export interface ChatListResponse {
  chats: Chat[];
}

export interface UpdateChatTitleRequest {
  title: string;
}

export interface StreamingState {
  isStreaming: boolean;
  currentChatId?: string;
  streamingMessage: string;
}

export type ModelType = 'OpenAI' | 'Claude';
