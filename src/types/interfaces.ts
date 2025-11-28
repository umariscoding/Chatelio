import type { Message, ModelType } from "./chat";

export interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
  loading?: boolean;
  className?: string;
  chatbotTitle?: string;
}

export interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  className?: string;
}

export interface MessageInputProps {
  onSendMessage: (message: string, model: ModelType) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface TypingIndicatorProps {
  isVisible: boolean;
  className?: string;
}
