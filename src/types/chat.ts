export interface Message {
  id?: string;
  role: "human" | "ai";
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

export interface StreamingState {
  isStreaming: boolean;
  currentChatId?: string;
  streamingMessage: string;
}

export type ModelType = "OpenAI" | "Claude";
