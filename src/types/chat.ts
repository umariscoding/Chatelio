// Chat related types
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

export interface SendMessageRequest {
  message: string;
  chat_id?: string;
  chat_title?: string;
  model: ModelType;
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

export type ModelType =
  | "Llama-instant"
  | "Llama-large"
  | "OpenAI"
  | "Claude"
  | "Cohere"
  | "Groq";

export interface ModelOption {
  value: ModelType;
  label: string;
  description: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    value: "Llama-instant",
    label: "Llama Instant",
    description: "Fast Llama 3.1 8B (via Groq)"
  },
  {
    value: "Llama-large",
    label: "Llama Large",
    description: "Powerful Llama 3.3 70B (via Groq)"
  },
  {
    value: "OpenAI",
    label: "OpenAI",
    description: "OpenAI GPT-4 models"
  },
  {
    value: "Claude",
    label: "Claude",
    description: "Anthropic Claude models"
  },
  {
    value: "Cohere",
    label: "Cohere",
    description: "Cohere Command models"
  },
  {
    value: "Groq",
    label: "Groq (Legacy)",
    description: "Legacy, defaults to Llama-instant"
  }
];
