/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: "var(--color-white)",
      black: "var(--color-black)",
      // Primary brand colors (Purple)
      primary: {
        50: "var(--color-primary-50)",
        100: "var(--color-primary-100)",
        200: "var(--color-primary-200)",
        300: "var(--color-primary-300)",
        400: "var(--color-primary-400)",
        500: "var(--color-primary-500)",
        600: "var(--color-primary-600)",
        700: "var(--color-primary-700)",
        800: "var(--color-primary-800)",
        900: "var(--color-primary-900)",
      },
      // Accent colors (Cyan/Blue)
      accent: {
        50: "var(--color-accent-50)",
        100: "var(--color-accent-100)",
        200: "var(--color-accent-200)",
        300: "var(--color-accent-300)",
        400: "var(--color-accent-400)",
        500: "var(--color-accent-500)",
        600: "var(--color-accent-600)",
        700: "var(--color-accent-700)",
        800: "var(--color-accent-800)",
        900: "var(--color-accent-900)",
      },
      // Neutral/Gray scale
      neutral: {
        50: "var(--color-neutral-50)",
        100: "var(--color-neutral-100)",
        200: "var(--color-neutral-200)",
        300: "var(--color-neutral-300)",
        400: "var(--color-neutral-400)",
        500: "var(--color-neutral-500)",
        600: "var(--color-neutral-600)",
        700: "var(--color-neutral-700)",
        800: "var(--color-neutral-800)",
        900: "var(--color-neutral-900)",
        950: "var(--color-neutral-950)",
      },
      // Zinc scale (for dark UI)
      zinc: {
        50: "var(--color-zinc-50)",
        100: "var(--color-zinc-100)",
        200: "var(--color-zinc-200)",
        300: "var(--color-zinc-300)",
        400: "var(--color-zinc-400)",
        500: "var(--color-zinc-500)",
        600: "var(--color-zinc-600)",
        700: "var(--color-zinc-700)",
        800: "var(--color-zinc-800)",
        900: "var(--color-zinc-900)",
        950: "var(--color-zinc-950)",
      },
      // Slate scale (for auth UI)
      slate: {
        50: "var(--color-slate-50)",
        100: "var(--color-slate-100)",
        200: "var(--color-slate-200)",
        300: "var(--color-slate-300)",
        400: "var(--color-slate-400)",
        500: "var(--color-slate-500)",
        600: "var(--color-slate-600)",
        700: "var(--color-slate-700)",
        800: "var(--color-slate-800)",
        900: "var(--color-slate-900)",
      },
      // Error/danger colors
      error: {
        50: "var(--color-error-50)",
        100: "var(--color-error-100)",
        200: "var(--color-error-200)",
        300: "var(--color-error-300)",
        400: "var(--color-error-400)",
        500: "var(--color-error-500)",
        600: "var(--color-error-600)",
        700: "var(--color-error-700)",
        800: "var(--color-error-800)",
        900: "var(--color-error-900)",
      },
      // Semantic color aliases for convenience
      blue: {
        500: "var(--color-blue-500)", // Used for selection indicators
      },
      red: {
        400: "var(--color-error-400)",
        500: "var(--color-error-500)",
        600: "var(--color-error-600)",
        700: "var(--color-error-700)",
      },
      gray: {
        500: "var(--color-zinc-500)",
      },
    },
  },
  plugins: [],
};
