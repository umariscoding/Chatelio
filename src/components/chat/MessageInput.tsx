'use client';

import React, { useState, useRef, useCallback } from 'react';

import Button from '@/components/ui/Button';
import type { MessageInputProps } from '@/interfaces/Chat.interface';
import type { ModelType } from '@/types/chat';

// Icons
const SendIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  loading = false,
  disabled = false,
  placeholder = "Type your message...",
  className = "",
}) => {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType>('OpenAI');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading && !disabled) {
      onSendMessage(message.trim(), selectedModel);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [message, selectedModel, onSendMessage, loading, disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }, []);

  return (
    <div className={`bg-white ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Model Selector - Compact */}
        <div className="flex items-center justify-center">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as ModelType)}
            disabled={loading || disabled}
            className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
          >
            <option value="OpenAI">GPT</option>
            <option value="Claude">Claude</option>
          </select>
        </div>

        {/* Message Input Container */}
        <div className="relative flex items-end space-x-3 bg-gray-50 rounded-2xl p-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={loading || disabled}
              rows={1}
              className="w-full resize-none bg-transparent border-0 px-0 py-1 focus:outline-none placeholder-gray-500 text-gray-900 text-sm leading-relaxed"
              style={{ minHeight: '24px', maxHeight: '150px' }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || loading || disabled}
            className="flex-shrink-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Hint text */}
        <div className="text-xs text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
