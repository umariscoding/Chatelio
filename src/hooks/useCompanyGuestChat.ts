import { useState, useCallback } from 'react';
import type { Message, ModelType } from '@/types/chat';
import { useAppSelector } from './useAuth';
import { getApiUrl } from '@/constants/api';

export const useCompanyGuestChat = () => {
  const { company } = useAppSelector((state) => state.companyAuth);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [guestSessionInitialized, setGuestSessionInitialized] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Initialize guest session for company testing
  const initializeGuestSession = useCallback(async () => {
    if (!company?.company_id || guestSessionInitialized) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(getApiUrl('/users/guest/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: company.company_id,
          ip_address: '127.0.0.1', // Company testing from dashboard
          user_agent: navigator.userAgent || 'Company Dashboard Test',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create guest session');
      }

      const data = await response.json();
      setGuestToken(data.tokens.access_token);
      setGuestSessionInitialized(true);
    } catch (error: any) {
      console.error('Guest session error:', error);
      setError('Failed to initialize chat session');
    } finally {
      setLoading(false);
    }
  }, [company?.company_id, guestSessionInitialized]);

  // Send message as guest
  const sendMessage = useCallback(async (messageContent: string, model: ModelType = 'OpenAI') => {
    if (!company?.slug || !guestToken) {
      setError('Chat session not initialized');
      return;
    }

    try {
      setError(null);
      setIsStreaming(true);

      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'human',
        content: messageContent,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to public endpoint (company testing their own chatbot)
      const response = await fetch(getApiUrl(`/public/chatbot/${company.slug}/chat`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${guestToken}`,
        },
        body: JSON.stringify({
          message: messageContent,
          model,
          ...(currentChatId && { chat_id: currentChatId }),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get chat ID from headers (for new chats or continuing existing ones)
      const chatId = response.headers.get('X-Chat-ID');
      if (chatId && !currentChatId) {
        setCurrentChatId(chatId);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        let fullMessage = '';

        while (!done) {
          try {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    
                    if (data.type === 'chunk' && data.content) {
                      fullMessage += data.content;
                      setStreamingMessage(fullMessage);
                    } else if (data.type === 'end') {
                      // Add the completed message
                      const aiMessage: Message = {
                        id: `ai-${Date.now()}`,
                        role: 'ai',
                        content: fullMessage,
                        timestamp: Date.now(),
                      };
                      setMessages(prev => [...prev, aiMessage]);
                      setStreamingMessage('');
                      setIsStreaming(false);
                      done = true;
                      break;
                    }
                  } catch (parseError) {
                    console.warn('Failed to parse streaming data:', parseError);
                  }
                }
              }
            }
          } catch (streamError) {
            console.error('Streaming error:', streamError);
            setIsStreaming(false);
            break;
          }
        }
      }
    } catch (error: any) {
      console.error('Send message error:', error);
      setError('Failed to send message. Please try again.');
      setIsStreaming(false);
      setStreamingMessage('');
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'ai',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [company?.slug, guestToken]);

  // Clear chat (start fresh)
  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingMessage('');
    setError(null);
    setCurrentChatId(null); // Reset chat ID for new conversation
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    messages,
    streamingMessage,
    isStreaming,
    loading,
    error,
    guestSessionInitialized,
    currentChatId,
    
    // Actions
    initializeGuestSession,
    sendMessage,
    clearChat,
    clearError,
  };
};

export default useCompanyGuestChat;
