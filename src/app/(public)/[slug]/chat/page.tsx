'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import type { Message, ModelType } from '@/types/chat';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { setActiveSessionUser, setUserData, logoutUser } from '@/store/slices/authSlice';

interface CompanyInfo {
  company_id: string;
  name: string;
  slug: string;
  chatbot_title: string;
  chatbot_description: string;
}

interface ChatHistory {
  chat_id: string;
  title: string;
  is_guest: boolean;
  is_deleted: boolean;
  created_at: string;
}

export default function PublicChatPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const slug = params.slug as string;
  
  // Check if user is logged in
  const { isUserAuthenticated, activeSession, user, userTokens } = useAppSelector((state) => state.auth);
  const isUserLoggedIn = isUserAuthenticated && activeSession === 'user';
  
  // Common state for both guest and logged-in users
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Auth state for guests
  const [guestToken, setGuestToken] = useState<string | null>(null);
  
  // Chat history for logged-in users
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });
  const [authLoading, setAuthLoading] = useState(false);

  // Initialize chat on mount
  useEffect(() => {
    initializeChat();
  }, [slug, isUserLoggedIn]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Fetch company info
      const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/public/chatbot/${slug}`);
      if (!companyResponse.ok) throw new Error('Chatbot not found');
      
      const companyData = await companyResponse.json();
      setCompanyInfo(companyData);

      // If user is logged in, fetch chat history
      if (isUserLoggedIn && userTokens?.access_token) {
        await fetchChatHistory();
      }
      
      // If guest, create guest token
      if (!isUserLoggedIn) {
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/guest/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: companyData.company_id,
            ip_address: 'frontend-client',
            user_agent: navigator.userAgent,
          }),
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          setGuestToken(tokenData.tokens.access_token);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    if (!userTokens?.access_token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/list`, {
        headers: { 'Authorization': `Bearer ${userTokens.access_token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.chats || []);
      }
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };

  const handleSendMessage = async (message: string, model: ModelType) => {
    if (!companyInfo) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'human',
      content: message,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setError(null);
    setIsStreaming(true);

    try {
      // Prepare request
      const token = isUserLoggedIn ? userTokens?.access_token : guestToken;
      const payload: any = {
        message,
        model,
        ...(currentChatId && { chat_id: currentChatId }),
        ...(!currentChatId && !isUserLoggedIn && { chat_title: 'Guest Chat Session' }),
        ...(!currentChatId && isUserLoggedIn && { chat_title: 'New Conversation' }),
      };

      // Use appropriate endpoint based on user type
      const endpoint = isUserLoggedIn 
        ? '/chat/send' 
        : `/public/chatbot/${slug}/chat`;
      
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if we have a token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let fullMessage = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'start' && data.chat_id) {
                setCurrentChatId(data.chat_id);
                // Add to chat history if logged in
                if (isUserLoggedIn && !chatHistory.find(c => c.chat_id === data.chat_id)) {
                  const newChat: ChatHistory = {
                    chat_id: data.chat_id,
                    title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
                    is_guest: false,
                    is_deleted: false,
                    created_at: new Date().toISOString(),
                  };
                  setChatHistory(prev => [newChat, ...prev]);
                }
              } else if (data.type === 'chunk' && data.content) {
                fullMessage += data.content;
                setStreamingMessage(fullMessage);
              } else if (data.type === 'end') {
                // Add AI message
                const aiMessage: Message = {
                  id: `ai-${Date.now()}`,
                  role: 'ai',
                  content: fullMessage,
                  timestamp: Date.now(),
                };
                setMessages(prev => [...prev, aiMessage]);
                setStreamingMessage('');
                setIsStreaming(false);
                return;
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setIsStreaming(false);
      setStreamingMessage('');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/users/login' : '/users/register';
      const payload = authMode === 'login' 
        ? { 
            email: authData.email, 
            password: authData.password,
            company_id: companyInfo?.company_id 
          }
        : { 
            email: authData.email, 
            password: authData.password, 
            name: authData.name,
            company_id: companyInfo?.company_id
          };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Authentication failed');

      const data = await response.json();
      
      // For both signup and login, the response contains user data and tokens
      // Use direct action to set user data without making another API call
      dispatch(setUserData({ user: data.user, tokens: data.tokens }));
      dispatch(setActiveSessionUser());
      
      // Clear guest state and modal
      setShowAuthModal(false);
      setGuestToken(null);
      setMessages([]);
      setCurrentChatId(null);
      setStreamingMessage('');
      setError(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setStreamingMessage('');
    setError(null);
  };

  const selectChat = async (chatId: string) => {
    if (!userTokens?.access_token) return;
    
    try {
      setCurrentChatId(chatId);
      setMessages([]);
      setStreamingMessage('');
      setError(null);
      
      // Load chat history
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/history/${chatId}`, {
        headers: { 'Authorization': `Bearer ${userTokens.access_token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Convert backend message format to frontend format
        const convertedMessages: Message[] = data.messages.map((msg: any, index: number) => ({
          id: `${msg.role}-${index}`,
          role: msg.role === 'human' ? 'human' : 'ai',
          content: msg.content,
          timestamp: msg.timestamp * 1000, // Convert to milliseconds if needed
        }));
        setMessages(convertedMessages);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Failed to load chat history');
    }
  };

  const handleLogout = async () => {
    try {
      // Dispatch logout action to clear user data
      dispatch(logoutUser());
      
      // Clear all chat states
      setMessages([]);
      setChatHistory([]);
      setCurrentChatId(null);
      setStreamingMessage('');
      setError(null);
      
      // Create new guest session for continued chatting
      if (companyInfo) {
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/guest/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: companyInfo.company_id,
            ip_address: 'frontend-client',
            user_agent: navigator.userAgent,
          }),
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          setGuestToken(tokenData.tokens.access_token);
        }
      }
    } catch (err) {
      console.error('Failed to create guest session after logout:', err);
      setError('Failed to create guest session');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error && !companyInfo) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chatbot Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Chat History Sidebar - Only for logged-in users */}
      {isUserLoggedIn && (
        <div className="w-80 bg-gray-900 text-white flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-200">Chat History</h2>
              <button 
                onClick={startNewChat}
                className="bg-white text-gray-900 hover:bg-gray-100 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              >
                New Chat
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No chat history yet
              </div>
            ) : (
              <div className="p-2">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.chat_id}
                    onClick={() => selectChat(chat.chat_id)}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                      currentChatId === chat.chat_id 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium truncate">{chat.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {companyInfo?.chatbot_title || 'Chat'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isUserLoggedIn ? (
                  <span>
                    <span className="font-medium">{user?.name}</span> chatting with{' '}
                    <span className="font-medium">{companyInfo?.name}</span>
                  </span>
                ) : (
                  companyInfo?.chatbot_description || 'Welcome to our chatbot'
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isUserLoggedIn && (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  className="text-sm"
                >
                  Login
                </Button>
              )}
              
              {isUserLoggedIn && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-sm"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            streamingMessage={streamingMessage}
          />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isStreaming}
          />
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <Modal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title={authMode === 'login' ? 'Login' : 'Sign Up'}
        >
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <Input
                label="Name"
                type="text"
                value={authData.name}
                onChange={(e) => setAuthData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            )}
            <Input
              label="Email"
              type="email"
              value={authData.email}
              onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              label="Password"
              type="password"
              value={authData.password}
              onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {authMode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
              </button>
              
              <Button type="submit" disabled={authLoading}>
                {authLoading ? 'Loading...' : (authMode === 'login' ? 'Login' : 'Sign Up')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}