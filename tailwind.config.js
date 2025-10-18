/** @type {import('tailwindcss').Config} */
// Modern AI-inspired color palette for Chatelio
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand color - Purple/Violet (Modern AI aesthetic)
        primary: {
          50: "#faf5ff", // very light purple
          100: "#f3e8ff", // light purple
          200: "#e9d5ff", // lighter purple
          300: "#d8b4fe", // soft purple
          400: "#c084fc", // medium purple
          500: "#a855f7", // standard purple (main color)
          600: "#9333ea", // vibrant purple (main CTA)
          700: "#7e22ce", // deep purple
          800: "#6b21a8", // darker purple
          900: "#581c87", // darkest purple
        },

        // Accent color - Cyan/Teal (Modern, tech-forward)
        accent: {
          50: "#ecfeff", // very light cyan
          100: "#cffafe", // light cyan
          200: "#a5f3fc", // lighter cyan
          300: "#67e8f9", // soft cyan
          400: "#22d3ee", // medium cyan
          500: "#06b6d4", // standard cyan
          600: "#0891b2", // vibrant cyan
          700: "#0e7490", // deep cyan
          800: "#155e75", // darker cyan
          900: "#164e63", // darkest cyan
        },

        // Neutral colors - Deep slate (Professional, modern)
        neutral: {
          50: "#f8fafc", // almost white
          100: "#f1f5f9", // very light slate
          200: "#e2e8f0", // light slate
          300: "#cbd5e1", // medium light slate
          400: "#94a3b8", // medium slate
          500: "#64748b", // standard slate
          600: "#475569", // darker slate
          700: "#334155", // deep slate
          800: "#1e293b", // very dark slate
          900: "#0f172a", // darkest slate
          950: "#020617", // near black
        },

        // Text colors - Simplified hierarchy
        text: {
          primary: "#0f172a", // dark slate for main text
          secondary: "#64748b", // medium slate for secondary
          tertiary: "#94a3b8", // light slate for tertiary
          placeholder: "#cbd5e1", // very light slate for placeholders
          white: "#ffffff", // white text
          muted: "#475569", // muted text
        },

        // Background colors - Clean, minimal
        bg: {
          primary: "#ffffff", // pure white
          secondary: "#f8fafc", // almost white
          tertiary: "#f1f5f9", // very light slate
          dark: "#0f172a", // dark slate
          darker: "#020617", // near black
        },

        // Border colors - Subtle borders
        border: {
          light: "#e2e8f0", // light slate
          medium: "#cbd5e1", // medium slate
          dark: "#94a3b8", // darker slate
        },

        // Success color - Simplified green
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e", // main success
          600: "#16a34a", // success CTA
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },

        // Warning color - Amber for attention
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // main warning
          600: "#d97706", // warning CTA
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },

        // Error color - Modern red
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // main error
          600: "#dc2626", // error CTA
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },

        // Sidebar/Dashboard UI - Deep slate background
        sidebar: {
          bg: "#0f172a", // dark slate
          hover: "#1e293b", // very dark slate
          active: "#334155", // deep slate
          border: "#1e293b", // very dark slate
          text: "#cbd5e1", // light slate text
          "text-hover": "#f1f5f9", // very light slate hover
          "text-active": "#ffffff", // white active
          "text-muted": "#64748b", // muted text
        },

        // Chart colors - Coordinated with brand
        chart: {
          grid: "#e2e8f0", // light slate
          axis: "#64748b", // medium slate
          tooltip: "#ffffff", // white
          tooltipText: "#0f172a", // dark slate
          shadow: "rgba(15, 23, 42, 0.1)", // subtle shadow
          primary: "#9333ea", // primary purple
          accent: "#0891b2", // accent cyan
        },
      },
    },
  },
  plugins: [],
};
