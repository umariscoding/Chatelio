import React from "react";
import type { TypingIndicatorProps } from "@/types/interfaces";

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isVisible,
  className = "",
}) => {
  if (!isVisible) return null;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-zinc-300 text-sm font-medium">Thinking</span>
      <div className="flex space-x-1.5 items-center">
        <div
          className="w-2 h-2 bg-primary-500 rounded-full transform origin-center"
          style={{ animation: "morphing 1.5s ease-in-out infinite" }}
        />
        <div
          className="w-2 h-2 bg-primary-600 rounded-full transform origin-center"
          style={{ animation: "morphing 1.5s ease-in-out infinite 0.3s" }}
        />
        <div
          className="w-2 h-2 bg-primary-700 rounded-full transform origin-center"
          style={{ animation: "morphing 1.5s ease-in-out infinite 0.6s" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
