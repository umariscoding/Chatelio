import React from "react";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import MinimalButton from "@/components/ui/MinimalButton";
import MinimalInput from "@/components/ui/MinimalInput";
import Modal from "@/components/ui/Modal";
import ChatOptionsMenu from "@/components/chat/ChatOptionsMenu";
import { Icons } from "@/components/ui/Icons";
import type { Message, ModelType } from "@/types/chat";

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

interface UserAuth {
  isAuthenticated: boolean;
  user: { name?: string; email?: string } | null;
  tokens: { access_token?: string; refresh_token?: string } | null;
}

interface ChatPageViewProps {
  companyInfo: CompanyInfo | null;
  messages: Message[];
  streamingMessage: string;
  isStreaming: boolean;
  isThinking: boolean;
  error: string | null;
  isUserLoggedIn: boolean;
  userAuth: UserAuth;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  showAuthModal: boolean;
  authMode: "login" | "signup";
  authData: { email: string; password: string; name: string };
  authLoading: boolean;
  onSendMessage: (message: string, model: ModelType) => void;
  onStartNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => Promise<void>;
  onDeleteChat: (chatId: string) => Promise<void>;
  onLogout: () => void;
  onShowAuthModal: (show: boolean) => void;
  onSetAuthMode: (mode: "login" | "signup") => void;
  onSetAuthData: React.Dispatch<
    React.SetStateAction<{ email: string; password: string; name: string }>
  >;
  onAuth: (e: React.FormEvent) => void;
}

const ChatPageView: React.FC<ChatPageViewProps> = ({
  companyInfo,
  messages,
  streamingMessage,
  isStreaming,
  isThinking,
  error,
  isUserLoggedIn,
  userAuth,
  chatHistory,
  currentChatId,
  showAuthModal,
  authMode,
  authData,
  authLoading,
  onSendMessage,
  onStartNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onLogout,
  onShowAuthModal,
  onSetAuthMode,
  onSetAuthData,
  onAuth,
}) => {
  return (
    <div className="h-screen flex bg-black overflow-hidden">
      {/* Chat History Sidebar - Only for logged-in users */}
      {isUserLoggedIn && (
        <div className="w-64 bg-zinc-950 text-white flex flex-col border-r border-zinc-800">
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              <h2 className="text-lg font-medium text-zinc-100">
                Hello, {userAuth.user?.name?.split(" ")[0] || "User"}
              </h2>
              <button
                onClick={onStartNewChat}
                className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/90 py-2 px-3 text-sm rounded-xl transition-colors flex items-center gap-2 w-full"
              >
                <Icons.MessageSquarePlus className="w-4 h-4" />
                <span>New conversation</span>
              </button>
            </div>
          </div>

          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Chats
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {chatHistory.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-1 opacity-60"
                >
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
                        ? "text-zinc-100 bg-zinc-800/90"
                        : "text-zinc-400 hover:bg-zinc-800/50"
                    }`}
                    onClick={() => onSelectChat(chat.chat_id)}
                  >
                    {currentChatId === chat.chat_id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/6 bg-blue-500 rounded-full" />
                    )}
                    <div className="flex-1 text-left overflow-hidden pr-2">
                      <div className="truncate text-sm font-medium">
                        {chat.title}
                      </div>
                    </div>
                    <div
                      className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChatOptionsMenu
                        chatId={chat.chat_id}
                        currentTitle={chat.title}
                        onRename={onRenameChat}
                        onDelete={onDeleteChat}
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
                {companyInfo?.chatbot_title || "Chat"}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {!isUserLoggedIn && (
                <MinimalButton
                  onClick={() => onShowAuthModal(true)}
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
                >
                  <Icons.LogIn className="w-4 h-4 mr-1.5" /> Login
                </MinimalButton>
              )}

              {isUserLoggedIn && (
                <MinimalButton
                  onClick={onLogout}
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
                >
                  <Icons.LogOut className="w-4 h-4 mr-1.5" /> Logout
                </MinimalButton>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-zinc-900 border-l-4 border-zinc-700 p-4 mx-6 mt-4">
            <p className="text-zinc-300">
              {typeof error === "string" ? error : "An error occurred."}
            </p>
          </div>
        )}

        {/* Messages Container - Full height with padding for header */}
        <div className="flex-1 overflow-y-auto pt-16">
          <div className="min-h-full">
            <MessageList
              messages={messages}
              streamingMessage={streamingMessage}
              loading={isThinking}
              chatbotTitle={
                companyInfo?.chatbot_title || companyInfo?.name || ""
              }
              className="h-full pb-40 pt-4"
            />
            <div className="h-20"></div>
          </div>
        </div>

        {/* Message Input - Floating above everything */}
        <div className="absolute bottom-8 inset-x-0 px-4 w-full max-w-4xl mx-auto z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <MessageInput
              onSendMessage={onSendMessage}
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
          onClose={() => onShowAuthModal(false)}
          title=""
          theme="auth"
          maxWidth="custom"
          customWidth="max-w-md sm:max-w-lg"
        >
          <div className="px-2 py-4">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-50 mb-2">
                {authMode === "login" ? "Welcome back" : "Get started"}
              </h2>
              <p className="text-slate-300 text-sm">
                {authMode === "login"
                  ? "Sign in to continue to your account"
                  : "Create your account to get started"}
              </p>
            </div>

            <form onSubmit={onAuth} className="space-y-5">
              {error && (
                <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4">
                  <p className="text-error-400 text-sm font-medium">
                    {typeof error === "string" ? error : "An error occurred."}
                  </p>
                </div>
              )}

              {authMode === "signup" && (
                <MinimalInput
                  label="Full Name"
                  type="text"
                  value={authData.name}
                  onChange={(e) =>
                    onSetAuthData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  variant="floating"
                  theme="auth"
                />
              )}

              <MinimalInput
                label="Email Address"
                type="email"
                value={authData.email}
                onChange={(e) =>
                  onSetAuthData((prev) => ({
                    ...prev,
                    email: e.target.value.toLowerCase(),
                  }))
                }
                required
                variant="floating"
                theme="auth"
              />

              <MinimalInput
                label="Password"
                type="password"
                value={authData.password}
                onChange={(e) =>
                  onSetAuthData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
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
                  {authMode === "login" ? "Sign In" : "Create Account"}
                </MinimalButton>
              </div>
            </form>

            {/* Switch Mode */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() =>
                  onSetAuthMode(authMode === "login" ? "signup" : "login")
                }
                className="text-slate-50 hover:text-auth-600 text-sm transition-colors duration-200"
              >
                {authMode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChatPageView;
