import type { Chat, Message, ModelType } from '@/types/chat';

export interface ChatSidebarProps {
  className?: string;
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  selectedChatId?: string;
}

export interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (chatId: string) => void;
  onTitleEdit: (chatId: string, title: string) => void;
  className?: string;
}

export interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
  loading?: boolean;
  className?: string;
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

export interface ChatInterfaceProps {
  chatId?: string;
  className?: string;
}

export interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  disabled?: boolean;
  className?: string;
}

export interface TypingIndicatorProps {
  isVisible: boolean;
  className?: string;
}
