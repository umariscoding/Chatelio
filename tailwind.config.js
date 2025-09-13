/** @type {import('tailwindcss').Config} */
// Force rebuild for dark greyish/blackish theme with blue accents
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Blue accents for selections and highlights
        primary: {
          50: '#eff6ff',   // very light blue
          100: '#dbeafe',  // light blue
          200: '#bfdbfe',  // lighter blue
          300: '#93c5fd',  // medium light blue
          400: '#60a5fa',  // medium blue
          500: '#3b82f6',  // standard blue
          600: '#2563eb',  // darker blue
          700: '#1d4ed8',  // dark blue
          800: '#1e40af',  // very dark blue
          900: '#1e3a8a',  // darkest blue
        },
        
        // Secondary colors - Greyish/blackish palette
        secondary: {
          50: '#f9fafb',   // very light grey
          100: '#f3f4f6',  // light grey
          200: '#e5e7eb',  // lighter grey
          300: '#d1d5db',  // medium light grey
          400: '#9ca3af',  // medium grey
          500: '#6b7280',  // standard grey
          600: '#4b5563',  // darker grey
          700: '#374151',  // dark grey
          800: '#1f2937',  // very dark grey
          900: '#111827',  // darkest grey
          950: '#030712',  // deepest black
        },
        
        // Success colors - Green for success states
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
        
        // Warning colors - Amber for warnings
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
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
        
        // Auth-specific colors - Dark zinc-like palette matching public chat
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
        
        // Special background for main page content - Deep dark grey/black
        'page-bg': '#030712', // deep dark grey/black for depth
      },
    },
  },
  plugins: [],
}
