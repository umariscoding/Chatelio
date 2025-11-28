import React, { useState, useRef, useCallback } from "react";
import { Icons } from "@/components/ui/Icons";
import type { MessageInputProps } from "@/types/interfaces";
import type { ModelType } from "@/types/chat";

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  loading = false,
  disabled = false,
  placeholder = "Type your message...",
  className = "",
}) => {
  const [message, setMessage] = useState("");
  const [isMultiline, setIsMultiline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedModel: ModelType = "OpenAI";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim() && !loading && !disabled) {
        onSendMessage(message.trim(), selectedModel);
        setMessage("");
        setIsMultiline(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    },
    [message, selectedModel, onSendMessage, loading, disabled],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);

      const textarea = e.target;
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = newHeight + "px";

      const minSingleLineHeight = 40;
      setIsMultiline(newHeight > minSingleLineHeight);
    },
    [],
  );

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div
          className={`relative flex items-center bg-zinc-900/40 backdrop-blur-xl p-3 border border-zinc-600/50 focus-within:border-zinc-500/80 focus-within:bg-zinc-800/50 focus-within:shadow-lg focus-within:shadow-zinc-500/20 transition-all shadow-2xl shadow-zinc-700/30 ring-1 ring-zinc-600/20 ${
            isMultiline ? "rounded-3xl" : "rounded-full"
          }`}
        >
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
                height: "40px",
                minHeight: "40px",
                maxHeight: "150px",
                paddingTop: "10px",
                overflow: message ? "auto" : "hidden",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || loading || disabled}
            className="flex-shrink-0 w-8 h-8 bg-zinc-700/60 backdrop-blur-sm hover:bg-zinc-600/70 hover:shadow-md hover:shadow-zinc-400/20 disabled:bg-zinc-900/30 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all border border-zinc-500/30 hover:border-zinc-400/50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icons.Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        <div className="text-xs text-zinc-600 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
