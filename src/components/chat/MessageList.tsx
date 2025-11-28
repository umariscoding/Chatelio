import React, { useEffect, useRef, memo } from "react";
import TypingIndicator from "./TypingIndicator";
import type { MessageListProps, MessageBubbleProps } from "@/types/interfaces";

const MessageBubble: React.FC<MessageBubbleProps> = memo(
  ({ message, isStreaming = false, className = "" }) => {
    const isUser = message.role === "human";

    return (
      <div className={`group max-w-4xl mx-auto px-4 py-3 ${className}`}>
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
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
  },
);

MessageBubble.displayName = "MessageBubble";

const MessageList: React.FC<MessageListProps> = memo(
  ({
    messages,
    streamingMessage = "",
    loading = false,
    className = "",
    chatbotTitle = "",
  }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage]);

    if (loading && messages.length === 0) {
      return (
        <div
          className={`flex-1 flex items-center justify-center p-8 ${className}`}
        >
          <p className="text-lg text-zinc-500">Loading...</p>
        </div>
      );
    }

    return (
      <div ref={containerRef} className={`flex-1 overflow-y-auto ${className}`}>
        {messages.length === 0 && !streamingMessage ? (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex justify-start">
                <div className="text-zinc-300 px-1 py-1">
                  <div className="whitespace-pre-wrap break-words leading-relaxed">
                    <div className="py-2 text-lg">
                      Ask anything about{" "}
                      <span className="text-zinc-400">
                        {chatbotTitle || "us"}
                      </span>
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

            {streamingMessage && (
              <MessageBubble
                message={{
                  id: "streaming",
                  role: "ai",
                  content: streamingMessage,
                  timestamp: Date.now(),
                }}
                isStreaming={true}
              />
            )}

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
  },
);

MessageList.displayName = "MessageList";

export default MessageList;
