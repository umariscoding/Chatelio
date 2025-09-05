'use client';

import React, { useEffect, useRef, memo, useMemo } from 'react';

import Loading from '@/components/ui/Loading';
import type { MessageListProps, MessageBubbleProps } from '@/interfaces/Chat.interface';
import type { Message } from '@/types/chat';

// Icons
const UserIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BotIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 text-gray-500">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
    <span className="text-sm">AI is typing...</span>
  </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, isStreaming = false, className = "" }) => {
  const isUser = message.role === 'human';
  
  return (
    <div className={`group max-w-4xl mx-auto px-4 py-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
              : 'bg-gray-100 border border-gray-200 text-gray-600'
          }`}>
            {isUser ? <UserIcon className="w-4 h-4" /> : <BotIcon className="w-4 h-4" />}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm max-w-none">
            <div className={`whitespace-pre-wrap break-words leading-relaxed ${
              isUser ? 'text-gray-900 font-medium' : 'text-gray-800'
            }`}>
              {message.content}
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse rounded-sm" />
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
});

const MessageList: React.FC<MessageListProps> = memo(({ 
  messages, 
  streamingMessage = '', 
  loading = false, 
  className = "" 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  if (loading && messages.length === 0) {
    return (
      <div className={`flex-1 flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-y-auto ${className}`}
    >
      {messages.length === 0 && !streamingMessage ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BotIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              How can I help you today?
            </h3>
            <p className="text-gray-500 leading-relaxed">
              I'm here to help answer questions and provide information. Just start typing your message below.
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-full">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id || `msg-${index}`}
              message={message}
            />
          ))}
          
          {/* Streaming message */}
          {streamingMessage && (
            <MessageBubble
              message={{
                id: 'streaming',
                role: 'ai',
                content: streamingMessage,
                timestamp: Date.now(),
              }}
              isStreaming={true}
            />
          )}
          
          {/* Typing indicator when no streaming message */}
          {loading && !streamingMessage && (
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center">
                    <BotIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-4 py-3 max-w-xs">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
});

// Add display name for better debugging
MessageList.displayName = 'MessageList';

export default MessageList;
