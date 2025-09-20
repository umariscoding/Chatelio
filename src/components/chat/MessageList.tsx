'use client';

import React, { useEffect, useRef, memo, useMemo } from 'react';

import TypingIndicator from './TypingIndicator';
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


const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, isStreaming = false, className = "" }) => {
  const isUser = message.role === 'human';
  
  return (
    <div className={`group max-w-4xl mx-auto px-4 py-3 ${className}`}>
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        {/* Message Content */}
        <div className={`max-w-[80%]`}>
          {isUser ? (
            <div className="bg-zinc-800 text-zinc-200 rounded-full px-4 py-2">
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </div>
            </div>
          ) : (
            <div className="text-zinc-300 px-1 py-1">
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
                {isStreaming && (
                  <span className="inline-block w-2 h-5 bg-zinc-600 ml-1 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          )}
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
        <p className="text-lg text-gray-600">Loading...</p>
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
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex justify-start">
              <div className="text-zinc-300 px-1 py-1">
                <div className="whitespace-pre-wrap break-words leading-relaxed">
                  <div className="py-2 animated-text text-lg">
                    <span className="char1">A</span>
                    <span className="char2">s</span>
                    <span className="char3">k</span>
                    <span className="char4"> </span>
                    <span className="char5">a</span>
                    <span className="char6">n</span>
                    <span className="char7">y</span>
                    <span className="char8">t</span>
                    <span className="char9">h</span>
                    <span className="char10">i</span>
                    <span className="char11">n</span>
                    <span className="char12">g</span>
                    <span className="char13"> </span>
                    <span className="char14">a</span>
                    <span className="char15">b</span>
                    <span className="char16">o</span>
                    <span className="char17">u</span>
                    <span className="char18">t</span>
                    <span className="char19"> </span>
                    <span className="char20 text-zinc-400">{window.location.pathname.split('/')[1]}</span>
                    <div className="cursor"></div>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex justify-start">
                <TypingIndicator isVisible={true} />
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
