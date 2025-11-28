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
        bg-zinc-700 hover:bg-zinc-600 text-white
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1
        shadow-lg shadow-zinc-900/50 hover:shadow-xl hover:shadow-zinc-900/60
      `,
      secondary: `
        bg-zinc-800 hover:bg-zinc-700 text-zinc-100
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1
        border border-zinc-700 hover:border-zinc-600
      `,
      ghost: `
        bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1
      `,
      outline: `
        bg-transparent border border-zinc-700 hover:border-zinc-500
        text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800
        focus:ring-2 focus:ring-zinc-500/40 focus:ring-offset-1
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
