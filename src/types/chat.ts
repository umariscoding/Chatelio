// Chat related types
export interface Message {
  role: 'human' | 'ai';
  content: string;
  timestamp: number;
}

export interface Chat {
  chat_id: string;
  title: string;
  is_guest: boolean;
  is_deleted: boolean;
  created_at: string;
}

export interface SendMessageRequest {
  message: string;
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
