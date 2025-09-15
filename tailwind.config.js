/** @type {import('tailwindcss').Config} */
// Force rebuild for dark greyish/blackish theme with blue accents
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Better blue that complements white backgrounds
        primary: {
          50: '#e6f3ff',   // very light blue
          100: '#cce7ff',  // light blue
          200: '#99d0ff',  // lighter blue
          300: '#66b2ff',  // medium light blue (light variant)
          400: '#3399ff',  // medium blue
          500: '#007bff',  // standard blue (main color)
          600: '#0066cc',  // darker blue (main button color)
          700: '#0056b3',  // dark blue (dark variant)
          800: '#004499',  // very dark blue
          900: '#003366',  // darkest blue
        },
        
        // Neutral colors - Improved greys that complement the blue
        neutral: {
          50: '#ffffff',   // pure white
          100: '#f8f9fa',  // very light grey (recommended background)
          200: '#e9ecef',  // light grey
          300: '#dee2e6',  // lighter grey
          400: '#ced4da',  // medium light grey
          500: '#adb5bd',  // medium grey
          600: '#6c757d',  // darker grey (recommended for borders/secondary text)
          700: '#495057',  // dark grey
          800: '#343a40',  // very dark grey (recommended dark variant)
          900: '#212529',  // darkest grey
          950: '#171717',  // near black
        },
        
        // Text colors - Improved hierarchy with better greys
        text: {
          primary: '#000000',    // pure black for main text
          secondary: '#6c757d',  // recommended medium grey for secondary text
          tertiary: '#adb5bd',   // lighter grey for tertiary text
          placeholder: '#ced4da', // light grey for placeholders
          white: '#ffffff',      // white text for dark backgrounds
        },
        
        // Background colors - Improved backgrounds
        bg: {
          primary: '#ffffff',    // pure white primary background
          secondary: '#f8f9fa',  // recommended light background
          tertiary: '#e9ecef',   // light grey tertiary background
          dark: '#343a40',       // recommended dark background
        },
        
        // Border colors - Improved greys that complement blue
        border: {
          light: '#dee2e6',     // light border
          medium: '#ced4da',    // medium border
          dark: '#6c757d',      // dark border (recommended)
        },
        
        // Success colors - Green variants (kept green for success states)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        // Warning colors - Orange/amber for warnings
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        
        // Error colors - Red for errors
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Auth colors - Dark zinc-like palette for authentication modals
        auth: {
          50: '#fafafa',   // very light zinc
          100: '#f4f4f5',  // light zinc
          200: '#e4e4e7',  // lighter zinc
          300: '#d4d4d8',  // medium light zinc
          400: '#a1a1aa',  // medium zinc
          500: '#71717a',  // standard zinc
          600: '#52525b',  // darker zinc
          700: '#3f3f46',  // dark zinc
          800: '#27272a',  // very dark zinc
          900: '#18181b',  // darkest zinc (like zinc-900)
          950: '#09090b',  // deepest zinc (like zinc-950)
        },
      },
    },
  },
  plugins: [],
}
