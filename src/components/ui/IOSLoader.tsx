"use client";

import React from "react";

interface IOSLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "dark";
  className?: string;
}

const IOSLoader: React.FC<IOSLoaderProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-primary-600",
    white: "text-white",
    dark: "text-neutral-700",
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Inline content loader (for sections within pages)
interface IOSContentLoaderProps {
  isLoading: boolean;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const IOSContentLoader: React.FC<IOSContentLoaderProps> = ({
  isLoading,
  message = "Loading...",
  className = "",
  children,
}) => {
  if (!isLoading && children) {
    return <>{children}</>;
  }

  if (!isLoading) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <IOSLoader size="lg" color="primary" className="mb-4" />
      <p className="text-text-secondary font-medium">{message}</p>
    </div>
  );
};

export default IOSLoader;
