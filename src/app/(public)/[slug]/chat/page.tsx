'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalButton from '@/components/ui/MinimalButton';
import ChatOptionsMenu from '@/components/chat/ChatOptionsMenu';
import { MessageSquarePlus, LogOut, LogIn } from 'lucide-react';
import type { Message, ModelType } from '@/types/chat';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuth';
import { setUserData, logout as logoutUser, verifyUserTokenGraceful } from '@/store/slices/userAuthSlice';
import { generateChatTitle, FALLBACK_TITLES } from '@/utils/chatUtils';

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
  
  // Check if user is logged in - now using simplified auth
  const userAuth = useAppSelector((state) => state.userAuth);
  const isUserLoggedIn = userAuth.isAuthenticated;
  
  // Common state for both guest and logged-in users
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
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
    // Start with no default chat
    setMessages([]);
    setCurrentChatId(null);
  }, [slug]);

  // Note: User token verification is now handled by AuthProvider
  // No need for additional verification here since complete user data
  // is stored from login and loaded immediately by AuthProvider

  // Handle user authentication state changes - fetch chat history when user logs in
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isUserLoggedIn && userAuth.tokens?.access_token && companyInfo) {
        await fetchChatHistory();
      }
    };
    
    loadChatHistory();
  }, [isUserLoggedIn, userAuth.tokens?.access_token, companyInfo]);

  // Create guest token when not logged in and company info is available
  useEffect(() => {
    const createGuestToken = async () => {
      if (!isUserLoggedIn && !guestToken && companyInfo) {
        try {
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
        } catch (err) {
          console.error('Failed to create guest token:', err);
        }
      }
    };
    
    createGuestToken();
  }, [isUserLoggedIn, guestToken, companyInfo]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Fetch company info
      const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/public/chatbot/${slug}`);
      if (!companyResponse.ok) throw new Error('Chatbot not found');
      
      const companyData = await companyResponse.json();
      setCompanyInfo(companyData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    if (!userAuth.tokens?.access_token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/list`, {
        headers: { 'Authorization': `Bearer ${userAuth.tokens.access_token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Sort chats in reverse chronological order (newest first)
        const sortedChats = (data.chats || []).sort((a: ChatHistory, b: ChatHistory) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setChatHistory(sortedChats);
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
    setIsThinking(true);
    setIsStreaming(false);

    try {
      // Prepare request
      const token = isUserLoggedIn ? userAuth.tokens?.access_token : guestToken;
      const payload: any = {
        message,
        model,
        ...(currentChatId && { chat_id: currentChatId }),
        ...(!currentChatId && !isUserLoggedIn && { chat_title: generateChatTitle(message) }),
        ...(!currentChatId && isUserLoggedIn && { chat_title: generateChatTitle(message) }),
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

      // If user token is invalid, gracefully fall back to guest mode
      if (!response.ok && response.status === 401 && isUserLoggedIn) {
        console.warn('User token invalid, falling back to guest mode');
        // Create guest session and retry
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
            
            // Retry with guest token
            const retryPayload = {
              message,
              model,
              chat_title: generateChatTitle(message)
            };
            
            const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/public/chatbot/${slug}/chat`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.tokens.access_token}`,
              },
              body: JSON.stringify(retryPayload),
            });
            
            if (retryResponse.ok) {
              // Use the retry response instead
              const reader = retryResponse.body?.getReader();
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
                        setIsThinking(false);
                        setIsStreaming(true);
                      } else if (data.type === 'chunk' && data.content) {
                        fullMessage += data.content;
                        setStreamingMessage(fullMessage);
                        setIsThinking(false);
                        setIsStreaming(true);
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
                        setIsThinking(false);
                        return;
                      }
                    } catch (parseError) {
                      console.warn('Failed to parse streaming data:', parseError);
                    }
                  }
                }
              }
              return;
            }
          }
        }
        throw new Error('Authentication failed and could not create guest session');
      }

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
                setIsThinking(false);
                setIsStreaming(true);
                // Add to chat history if logged in
                if (isUserLoggedIn && !chatHistory.find(c => c.chat_id === data.chat_id)) {
                  const newChat: ChatHistory = {
                    chat_id: data.chat_id,
                    title: generateChatTitle(message),
                    is_guest: false,
                    is_deleted: false,
                    created_at: new Date().toISOString(),
                  };
                  setChatHistory(prev => [newChat, ...prev]);
                }
              } else if (data.type === 'chunk' && data.content) {
                fullMessage += data.content;
                setStreamingMessage(fullMessage);
                setIsThinking(false);
                setIsStreaming(true);
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
                setIsThinking(false);
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
      setIsThinking(false);
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
            email: authData.email.toLowerCase(), 
            password: authData.password,
            company_id: companyInfo?.company_id 
          }
        : { 
            email: authData.email.toLowerCase(), 
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
      
      // Clear guest state and modal
      setShowAuthModal(false);
      setGuestToken(null);
      setMessages([]);
      setCurrentChatId(null);
      setStreamingMessage('');
      setIsThinking(false);
      setIsStreaming(false);
      setError(null);
      
      // Reset auth form
      setAuthData({ email: '', password: '', name: '' });
      
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
    setIsThinking(false);
    setIsStreaming(false);
    setError(null);
  };

  const selectChat = async (chatId: string) => {
    if (!userAuth.tokens?.access_token) return;
    
    try {
      setCurrentChatId(chatId);
      setMessages([]);
      setStreamingMessage('');
      setIsThinking(false);
      setIsStreaming(false);
      setError(null);
      
      // Load chat history
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/history/${chatId}`, {
        headers: { 'Authorization': `Bearer ${userAuth.tokens.access_token}` }
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

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    if (!userAuth.tokens?.access_token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/title/${chatId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${userAuth.tokens.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to rename chat');
      }
      
      // Update chat history with new title
      setChatHistory(prev => prev.map(chat => 
        chat.chat_id === chatId ? { ...chat, title: newTitle } : chat
      ));
    } catch (err) {
      console.error('Failed to rename chat:', err);
      throw err;
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!userAuth.tokens?.access_token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userAuth.tokens.access_token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete chat');
      }
      
      // Remove chat from history
      setChatHistory(prev => prev.filter(chat => chat.chat_id !== chatId));
      
      // If the deleted chat was the current one, start a new chat
      if (currentChatId === chatId) {
        startNewChat();
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
      throw err;
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
      setIsThinking(false);
      setIsStreaming(false);
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
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error && !companyInfo) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chatbot Not Found</h1>
          <p className="text-gray-600">{typeof error === 'string' ? error : 'An error occurred while loading the chatbot.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-black overflow-hidden">
      {/* Chat History Sidebar - Only for logged-in users */}
      {isUserLoggedIn && (
        <div className="w-64 bg-zinc-950 text-white flex flex-col border-r border-zinc-800">
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              <h2 className="text-lg font-medium text-zinc-100">
                Hello, {userAuth.user?.name?.split(' ')[0] || 'User'}
              </h2>
              <button 
                onClick={startNewChat}
                className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/90 py-2 px-3 text-sm rounded-xl transition-colors flex items-center gap-2 w-full"
              >
                <MessageSquarePlus size={16} />
                <span>New conversation</span>
              </button>
            </div>
          </div>
          
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Chats</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {chatHistory.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1 opacity-60">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>No chat history yet</span>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.chat_id}
                    className={`group flex items-center justify-between px-3 py-2.5 mb-1 relative transition-colors rounded-xl cursor-pointer ${
                      currentChatId === chat.chat_id 
                        ? 'text-zinc-100 bg-zinc-800/90' 
                        : 'text-zinc-400 hover:bg-zinc-800/50'
                    }`}
                    onClick={() => selectChat(chat.chat_id)}
                  >
                    {currentChatId === chat.chat_id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/6 bg-blue-500 rounded-full" />
                    )}
                    <div className="flex-1 text-left overflow-hidden pr-2">
                      <div className="truncate text-sm font-medium">{chat.title}</div>
                    </div>
                    <div 
                      className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChatOptionsMenu 
                        chatId={chat.chat_id}
                        currentTitle={chat.title}
                        onRename={handleRenameChat}
                        onDelete={handleDeleteChat}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950 relative">
        {/* Transparent Header - No Separator */}
        <div className="px-6 py-3 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-zinc-950 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg text-zinc-200">
                {companyInfo?.chatbot_title || 'Chat'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isUserLoggedIn && (
                <MinimalButton
                  onClick={() => setShowAuthModal(true)}
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
                >
                  <LogIn size={16} className="mr-1.5" /> Login
                </MinimalButton>
              )}
              
              {isUserLoggedIn && (
                <MinimalButton
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
                >
                  <LogOut size={16} className="mr-1.5" /> Logout
                </MinimalButton>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-zinc-900 border-l-4 border-zinc-700 p-4 mx-6 mt-4">
            <p className="text-zinc-300">{typeof error === 'string' ? error : 'An error occurred.'}</p>
          </div>
        )}

        {/* Messages Container - Full height with padding for header */}
        <div className="flex-1 overflow-y-auto pt-16">
          <div className="min-h-full">
            <MessageList
              messages={messages}
              streamingMessage={streamingMessage}
              loading={isThinking}
              className="h-full pb-40 pt-4" /* Extra padding to make room for floating input and top header */
            />
            {/* Extra spacer at bottom to ensure visibility of last message */}
            <div className="h-20"></div>
          </div>
        </div>
          
        {/* Message Input - Floating above everything */}
        <div className="absolute bottom-8 inset-x-0 px-4 w-full max-w-4xl mx-auto z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isStreaming || isThinking}
              className="w-full shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <Modal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title=""
          theme="auth"
          maxWidth="custom"
          customWidth="max-w-md sm:max-w-lg"
        >
          <div className="px-2 py-4">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-auth-100 mb-2">
                {authMode === 'login' ? 'Welcome back' : 'Get started'}
              </h2>
              <p className="text-auth-400 text-sm">
                {authMode === 'login' 
                  ? 'Sign in to continue to your account' 
                  : 'Create your account to get started'
                }
              </p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-5">
              {error && (
                <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4">
                  <p className="text-error-400 text-sm font-medium">{typeof error === 'string' ? error : 'An error occurred.'}</p>
                </div>
              )}
              
              {authMode === 'signup' && (
                <MinimalInput
                  label="Full Name"
                  type="text"
                  value={authData.name}
                  onChange={(e) => setAuthData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  variant="floating"
                  theme="auth"
                />
              )}
              
              <MinimalInput
                label="Email Address"
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value.toLowerCase() }))}
                required
                variant="floating"
                theme="auth"
              />
              
              <MinimalInput
                label="Password"
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                required
                variant="floating"
                theme="auth"
              />
              
              <div className="pt-2">
                <MinimalButton 
                  type="submit" 
                  loading={authLoading}
                  fullWidth
                  size="lg"
                  variant="primary"
                  theme="auth"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </MinimalButton>
              </div>
            </form>
            
            {/* Switch Mode */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-auth-400 hover:text-auth-600 text-sm transition-colors duration-200"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}