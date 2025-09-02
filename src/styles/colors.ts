// Centralized color definitions
// NEVER hardcode colors in components - always import from here

export const COLORS = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fefce8',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Pure colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Semantic color mappings for easier usage
export const SEMANTIC_COLORS = {
  background: COLORS.white,
  foreground: COLORS.gray[900],
  primary: COLORS.primary[600],
  primaryForeground: COLORS.white,
  secondary: COLORS.gray[100],
  secondaryForeground: COLORS.gray[900],
  muted: COLORS.gray[100],
  mutedForeground: COLORS.gray[500],
  accent: COLORS.gray[100],
  accentForeground: COLORS.gray[900],
  destructive: COLORS.error[500],
  destructiveForeground: COLORS.white,
  border: COLORS.gray[200],
  input: COLORS.gray[200],
  ring: COLORS.primary[600],
} as const;

// Dark theme colors
export const DARK_COLORS = {
  background: COLORS.gray[950] || '#020617',
  foreground: COLORS.gray[50],
  primary: COLORS.primary[500],
  primaryForeground: COLORS.gray[900],
  secondary: COLORS.gray[800],
  secondaryForeground: COLORS.gray[50],
  muted: COLORS.gray[800],
  mutedForeground: COLORS.gray[400],
  accent: COLORS.gray[800],
  accentForeground: COLORS.gray[50],
  destructive: COLORS.error[600],
  destructiveForeground: COLORS.gray[50],
  border: COLORS.gray[800],
  input: COLORS.gray[800],
  ring: COLORS.primary[400],
} as const;
