import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatPageView from "./ChatPageView";
import type { Message, ModelType } from "@/types/chat";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setUserData,
  logout as logoutUser,
} from "@/store/slices/userAuthSlice";
import { generateChatTitle } from "@/utils/chatUtils";
import { parseSubdomain } from "@/utils/subdomainParser";
import { getApiUrl } from "@/constants/api";

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

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  // Try to get slug from URL params first, then from subdomain
  const slug =
    params.slug || parseSubdomain(window.location.hostname) || "default";

  const userAuth = useAppSelector((state) => state.userAuth);
  const isUserLoggedIn = userAuth.isAuthenticated;

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    initializeChat();
    setMessages([]);
    setCurrentChatId(null);
  }, [slug]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (isUserLoggedIn && userAuth.tokens?.access_token && companyInfo) {
        await fetchChatHistory();
      }
    };
    loadChatHistory();
  }, [isUserLoggedIn, userAuth.tokens?.access_token, companyInfo]);

  useEffect(() => {
    const createGuestToken = async () => {
      if (!isUserLoggedIn && !guestToken && companyInfo) {
        try {
          const tokenResponse = await fetch(getApiUrl("/users/guest/create"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_id: companyInfo.company_id,
              ip_address: "frontend-client",
              user_agent: navigator.userAgent,
            }),
          });
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            setGuestToken(tokenData.tokens.access_token);
          }
        } catch (err) {
          console.error("Failed to create guest token:", err);
        }
      }
    };
    createGuestToken();
  }, [isUserLoggedIn, guestToken, companyInfo]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      const companyResponse = await fetch(getApiUrl(`/public/chatbot/${slug}`));
      if (!companyResponse.ok) throw new Error("Chatbot not found");
      const companyData = await companyResponse.json();
      setCompanyInfo(companyData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize chat",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    if (!userAuth.tokens?.access_token) return;
    try {
      const response = await fetch(getApiUrl("/chat/list"), {
        headers: { Authorization: `Bearer ${userAuth.tokens.access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedChats = (data.chats || []).sort(
          (a: ChatHistory, b: ChatHistory) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setChatHistory(sortedChats);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  const handleSendMessage = async (message: string, model: ModelType) => {
    if (!companyInfo) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "human",
      content: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setError(null);
    setIsThinking(true);
    setIsStreaming(false);

    try {
      const token = isUserLoggedIn ? userAuth.tokens?.access_token : guestToken;
      const payload: any = {
        message,
        model,
        ...(currentChatId && { chat_id: currentChatId }),
        ...(!currentChatId && { chat_title: generateChatTitle(message) }),
      };
      const endpoint = isUserLoggedIn
        ? "/chat/send"
        : `/public/chatbot/${slug}/chat`;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      let fullMessage = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "start" && data.chat_id) {
                setCurrentChatId(data.chat_id);
                setIsThinking(false);
                setIsStreaming(true);
                if (
                  isUserLoggedIn &&
                  !chatHistory.find((c) => c.chat_id === data.chat_id)
                ) {
                  const newChat: ChatHistory = {
                    chat_id: data.chat_id,
                    title: generateChatTitle(message),
                    is_guest: false,
                    is_deleted: false,
                    created_at: new Date().toISOString(),
                  };
                  setChatHistory((prev) => [newChat, ...prev]);
                }
              } else if (data.type === "chunk" && data.content) {
                fullMessage += data.content;
                setStreamingMessage(fullMessage);
                setIsThinking(false);
                setIsStreaming(true);
              } else if (data.type === "end") {
                const aiMessage: Message = {
                  id: `ai-${Date.now()}`,
                  role: "ai",
                  content: fullMessage,
                  timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setStreamingMessage("");
                setIsStreaming(false);
                setIsThinking(false);
                return;
              }
            } catch (parseError) {
              console.warn("Failed to parse streaming data:", parseError);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setIsStreaming(false);
      setIsThinking(false);
      setStreamingMessage("");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const endpoint =
        authMode === "login" ? "/users/login" : "/users/register";
      const payload =
        authMode === "login"
          ? {
              email: authData.email.toLowerCase(),
              password: authData.password,
              company_id: companyInfo?.company_id,
            }
          : {
              email: authData.email.toLowerCase(),
              password: authData.password,
              name: authData.name,
              company_id: companyInfo?.company_id,
            };
      const response = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Authentication failed");
      const data = await response.json();
      dispatch(setUserData({ user: data.user, tokens: data.tokens }));
      setShowAuthModal(false);
      setGuestToken(null);
      setMessages([]);
      setCurrentChatId(null);
      setStreamingMessage("");
      setIsThinking(false);
      setIsStreaming(false);
      setError(null);
      setAuthData({ email: "", password: "", name: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setStreamingMessage("");
    setIsThinking(false);
    setIsStreaming(false);
    setError(null);
  };

  const selectChat = async (chatId: string) => {
    if (!userAuth.tokens?.access_token) return;
    try {
      setCurrentChatId(chatId);
      setMessages([]);
      setStreamingMessage("");
      setIsThinking(false);
      setIsStreaming(false);
      setError(null);
      const response = await fetch(getApiUrl(`/chat/history/${chatId}`), {
        headers: { Authorization: `Bearer ${userAuth.tokens.access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const convertedMessages: Message[] = data.messages.map(
          (msg: any, index: number) => ({
            id: `${msg.role}-${index}`,
            role: msg.role === "human" ? "human" : "ai",
            content: msg.content,
            timestamp: msg.timestamp * 1000,
          }),
        );
        setMessages(convertedMessages);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setError("Failed to load chat history");
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    if (!userAuth.tokens?.access_token) return;
    try {
      const response = await fetch(getApiUrl(`/chat/title/${chatId}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userAuth.tokens.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to rename chat");
      }
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.chat_id === chatId ? { ...chat, title: newTitle } : chat,
        ),
      );
    } catch (err) {
      console.error("Failed to rename chat:", err);
      throw err;
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!userAuth.tokens?.access_token) return;
    try {
      const response = await fetch(getApiUrl(`/chat/${chatId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userAuth.tokens.access_token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete chat");
      }
      setChatHistory((prev) => prev.filter((chat) => chat.chat_id !== chatId));
      if (currentChatId === chatId) startNewChat();
    } catch (err) {
      console.error("Failed to delete chat:", err);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      setMessages([]);
      setChatHistory([]);
      setCurrentChatId(null);
      setStreamingMessage("");
      setIsThinking(false);
      setIsStreaming(false);
      setError(null);
      if (companyInfo) {
        const tokenResponse = await fetch(getApiUrl("/users/guest/create"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: companyInfo.company_id,
            ip_address: "frontend-client",
            user_agent: navigator.userAgent,
          }),
        });
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          setGuestToken(tokenData.tokens.access_token);
        }
      }
    } catch (err) {
      console.error("Failed to create guest session after logout:", err);
      setError("Failed to create guest session");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-lg text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (error && !companyInfo) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Chatbot Not Found
          </h1>
          <p className="text-zinc-400">
            {typeof error === "string"
              ? error
              : "An error occurred while loading the chatbot."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChatPageView
      companyInfo={companyInfo}
      messages={messages}
      streamingMessage={streamingMessage}
      isStreaming={isStreaming}
      isThinking={isThinking}
      error={error}
      isUserLoggedIn={isUserLoggedIn}
      userAuth={userAuth}
      chatHistory={chatHistory}
      currentChatId={currentChatId}
      showAuthModal={showAuthModal}
      authMode={authMode}
      authData={authData}
      authLoading={authLoading}
      onSendMessage={handleSendMessage}
      onStartNewChat={startNewChat}
      onSelectChat={selectChat}
      onRenameChat={handleRenameChat}
      onDeleteChat={handleDeleteChat}
      onLogout={handleLogout}
      onShowAuthModal={setShowAuthModal}
      onSetAuthMode={setAuthMode}
      onSetAuthData={setAuthData}
      onAuth={handleAuth}
    />
  );
};

export default ChatPage;
