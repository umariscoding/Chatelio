"use client";

import React from "react";
import type { InputProps } from "@/interfaces/Input.interface";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      description,
      type = "text",
      theme = "light",
      ...props
    },
    ref,
  ) => {
    const themeClasses = {
      light: {
        input:
          "border-border-light bg-bg-primary text-text-primary placeholder:text-text-placeholder focus-visible:ring-primary-600 hover:border-border-medium",
        label: "text-text-primary",
        description: "text-text-secondary",
      },
      dark: {
        input:
          "border-neutral-700 bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-primary-600",
        label: "text-neutral-300",
        description: "text-neutral-500",
      },
    };

    const currentTheme = themeClasses[theme];

    const baseClasses = `flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-bg-primary file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${currentTheme.input}`;
    const errorClasses = error
      ? "border-error-500 focus-visible:ring-error-500"
      : "";
    const classes = `${baseClasses} ${errorClasses} ${className || ""}`;

    return (
      <div className="w-full">
        {label && (
          <label
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block ${currentTheme.label}`}
          >
            {label}
          </label>
        )}
        {/* Use the dark-theme class from globals.css for autofill styling */}
        <div className={theme === "dark" ? "dark-theme" : ""}>
          <input type={type} className={classes} ref={ref} {...props} />
        </div>
        {error && <p className="text-sm text-error-500 mt-1">{error}</p>}
        {description && !error && (
          <p className={`text-sm mt-1 ${currentTheme.description}`}>
            {description}
          </p>
        )}
        {helperText && !error && !description && (
          <p className={`text-sm mt-1 ${currentTheme.description}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
