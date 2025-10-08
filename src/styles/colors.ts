/**
 * Centralized Color Definitions for Chatelio
 * 
 * This file contains all color definitions used across the application.
 * Colors follow a modern AI-inspired palette with Purple (primary) and Cyan (accent).
 * 
 * Based on modern AI companies like OpenAI, Anthropic, Perplexity, and Midjourney.
 */

export const COLORS = {
  // Primary Brand Color - Purple/Violet (Modern AI aesthetic)
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',  // Main CTA
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Accent Color - Cyan/Teal (Modern, tech-forward)
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',  // Main accent
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Neutral Colors - Deep slate (Professional, modern)
  neutral: {
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
    950: '#020617',
  },

  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    placeholder: '#cbd5e1',
    white: '#ffffff',
    muted: '#475569',
  },

  // Background Colors
  bg: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    dark: '#0f172a',
    darker: '#020617',
  },

  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },

  // Sidebar/Dashboard UI
  sidebar: {
    bg: '#0f172a',
    hover: '#1e293b',
    active: '#334155',
    border: '#1e293b',
    text: '#cbd5e1',
    textHover: '#f1f5f9',
    textActive: '#ffffff',
    textMuted: '#64748b',
  },

  // Chart Colors
  chart: {
    grid: '#e2e8f0',
    axis: '#64748b',
    tooltip: '#ffffff',
    tooltipText: '#0f172a',
    shadow: 'rgba(15, 23, 42, 0.1)',
    primary: '#9333ea',    // Purple
    accent: '#0891b2',     // Cyan
  },
} as const;

/**
 * Color utility functions
 */

/**
 * Get color with opacity
 * @param color - Hex color code
 * @param opacity - Opacity value (0-1)
 */
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Brand gradient utilities
 */
export const GRADIENTS = {
  primary: 'from-primary-600 to-primary-700',
  primaryAccent: 'from-primary-600 to-accent-600',
  accent: 'from-accent-600 to-accent-700',
  hero: 'from-primary-50 via-bg-primary to-accent-50',
} as const;

/**
 * Shadow utilities with brand colors
 */
export const SHADOWS = {
  primary: {
    sm: 'shadow-lg shadow-primary-600/20',
    md: 'shadow-xl shadow-primary-600/30',
    lg: 'shadow-2xl shadow-primary-600/50',
  },
  accent: {
    sm: 'shadow-lg shadow-accent-600/20',
    md: 'shadow-xl shadow-accent-600/30',
  },
} as const;

export default COLORS;

