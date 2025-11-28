import React from "react";
import IOSLoader from "./IOSLoader";

interface MinimalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  theme?: "default" | "auth";
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      theme = "default",
      ...props
    },
    ref,
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center rounded-lg font-medium
      transition-all duration-200 focus:outline-none
      disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-100
      ${fullWidth ? "w-full" : ""}
    `;

    const defaultVariants = {
      primary: `
        bg-primary-600 hover:bg-primary-700 text-white
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1
        shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30
      `,
      secondary: `
        bg-neutral-200 hover:bg-neutral-300 text-neutral-900
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1
        border border-neutral-300 hover:border-neutral-400
      `,
      ghost: `
        bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1
      `,
      outline: `
        bg-transparent border border-neutral-300 hover:border-primary-600
        text-neutral-700 hover:text-primary-600 hover:bg-primary-50
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1
      `,
    };

    const authVariants = {
      primary: `
        bg-slate-700 hover:bg-slate-600 text-slate-50
        focus:ring-2 focus:ring-slate-600/40 focus:ring-offset-1
        shadow-lg shadow-slate-700/30 hover:shadow-xl hover:shadow-slate-700/40
      `,
      secondary: `
        bg-slate-700 hover:bg-slate-600 text-slate-50
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1
        border border-slate-600 hover:border-slate-500
      `,
      ghost: `
        bg-transparent hover:bg-slate-800 text-slate-300 hover:text-slate-100
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1
      `,
      outline: `
        bg-transparent border border-slate-700 hover:border-primary-600
        text-slate-300 hover:text-slate-100 hover:bg-slate-800
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1
      `,
    };

    const variants = theme === "auth" ? authVariants : defaultVariants;

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-base",
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <IOSLoader size="sm" color="white" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

MinimalButton.displayName = "MinimalButton";

export default MinimalButton;
