import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface MinimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: "default" | "floating";
  theme?: "light" | "dark" | "auth";
}

const MinimalInput = React.forwardRef<HTMLInputElement, MinimalInputProps>(
  (
    {
      label,
      error,
      variant = "floating",
      theme = "dark",
      className = "",
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      Boolean(props.value || props.defaultValue),
    );
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const themeStyles = {
      light: {
        input:
          "border-neutral-300 text-neutral-900 focus:border-primary-600 focus:ring-primary-600/30 hover:border-neutral-400",
        label: {
          default: "text-neutral-600",
          focused: "text-primary-600",
          error: "text-red-600",
        },
        error: "text-red-600",
        passwordToggle: "text-neutral-500 hover:text-neutral-700",
      },
      dark: {
        input:
          "border-neutral-700 text-neutral-50 focus:border-primary-600 focus:ring-primary-600/30",
        label: {
          default: "text-neutral-500",
          focused: "text-neutral-50",
          error: "text-red-400",
        },
        error: "text-red-400",
        passwordToggle: "text-neutral-400 hover:text-neutral-300",
      },
      auth: {
        input:
          "border-slate-700 text-slate-50 focus:border-primary-500 focus:ring-primary-600/30",
        label: {
          default: "text-slate-300",
          focused: "text-primary-400",
          error: "text-red-400",
        },
        error: "text-red-400",
        passwordToggle: "text-slate-400 hover:text-slate-200",
      },
    };

    const currentTheme = themeStyles[theme];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    if (variant === "floating") {
      return (
        <div className="relative mb-1">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            autoComplete="off"
            className={`
              peer w-full px-4 pt-6 pb-3 bg-transparent border rounded-lg
              ${currentTheme.input} placeholder-transparent
              focus:ring-1 focus:outline-none
              transition-all duration-150
              ${error ? "border-red-500" : ""}
              ${isPassword ? "pr-10" : ""}
              ${className}
            `}
            placeholder={label}
          />
          <label
            className={`
              absolute left-4 transition-all duration-150 pointer-events-none
              ${
                focused || hasValue
                  ? `top-2 text-xs font-medium ${focused ? currentTheme.label.focused : currentTheme.label.default}`
                  : `top-1/2 -translate-y-1/2 text-sm ${currentTheme.label.default}`
              }
              ${error ? currentTheme.label.error : ""}
            `}
          >
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none ${currentTheme.passwordToggle}`}
              tabIndex={-1}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}

          {error && (
            <p className={`mt-1 text-sm font-medium ${currentTheme.error}`}>
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2 mb-1">
        <label
          className={`block text-sm font-medium ${currentTheme.label.default}`}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            autoComplete="off"
            className={`
              w-full px-4 py-3 ${theme === "light" ? "bg-white" : "bg-transparent"} border rounded-lg
              ${currentTheme.input} ${theme === "light" ? "placeholder-neutral-400" : "placeholder-neutral-500"}
              focus:ring-1 focus:outline-none
              transition-all duration-150
              ${error ? "border-red-500" : ""}
              ${isPassword ? "pr-10" : ""}
              ${className}
            `}
          />

          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none ${currentTheme.passwordToggle}`}
              tabIndex={-1}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className={`text-sm font-medium ${currentTheme.error}`}>{error}</p>
        )}
      </div>
    );
  },
);

MinimalInput.displayName = "MinimalInput";

export default MinimalInput;
