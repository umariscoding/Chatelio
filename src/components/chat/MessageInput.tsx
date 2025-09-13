'use client';

import React, { useState, useRef, useCallback } from 'react';

import Button from '@/components/ui/Button';
import { Icons } from '@/components/ui';
import type { MessageInputProps } from '@/interfaces/Chat.interface';
import type { ModelType } from '@/types/chat';

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  loading = false,
  disabled = false,
  placeholder = "Type your message...",
  className = "",
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Always use OpenAI model as default
  const selectedModel: ModelType = 'OpenAI';

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
    const newHeight = Math.min(textarea.scrollHeight, 150);
    textarea.style.height = newHeight + 'px';
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Message Input Container - Floating with black theme */}
        <div className="relative flex items-center bg-zinc-900 rounded-full p-3 border border-zinc-800 focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700 transition-all shadow-lg shadow-black/50">
          <div className="flex-1 flex items-center">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={loading || disabled}
              rows={1}
              className="w-full resize-none bg-transparent border-0 pl-3 focus:outline-none placeholder:text-zinc-500 text-zinc-200 text-sm leading-normal"
              style={{ 
                height: '40px',
                minHeight: '40px',
                maxHeight: '150px',
                paddingTop: '10px',
                overflow: message ? 'auto' : 'hidden'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || loading || disabled}
            className="flex-shrink-0 w-8 h-8 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icons.Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Hint text */}
        <div className="text-xs text-zinc-600 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};

export default MessageInput;