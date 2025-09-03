// Application constants
// NEVER hardcode these values in components - always import from here

export const APP_CONFIG = {
  NAME: 'Chatelio',
  DESCRIPTION: 'Multi-tenant chatbot platform for businesses',
  VERSION: '1.0.0',
  AUTHOR: 'Chatelio Team',
} as const;

export const ROUTES = {
  HOME: '/',
  
  // Auth routes (matching folder structure)
  COMPANY_LOGIN: '/company/login',
  COMPANY_REGISTER: '/company/register', 
  USER_LOGIN: '/user/login',
  USER_REGISTER: '/user/register',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Chat routes
  CHAT: '/chat',
  CHAT_DETAIL: '/chat/[chatId]',
  
  // Knowledge Base routes
  KNOWLEDGE_BASE: '/knowledge-base',
  KNOWLEDGE_BASE_UPLOAD: '/knowledge-base/upload',
  
  // Public routes
  PUBLIC_CHATBOT: '/[slug]',
  PUBLIC_CHAT: '/[slug]/chat',
} as const;

export const FORM_VALIDATION = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
    MAX_LENGTH: 255,
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 8,
    WEAK: 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers',
  },
  NAME: {
    REQUIRED: 'Name is required',
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  COMPANY_NAME: {
    REQUIRED: 'Company name is required',
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
} as const;

export const UI_CONSTANTS = {
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['.txt', '.pdf', '.doc', '.docx', '.md'],
  CHAT_MESSAGE_LIMIT: 1000,
  PAGINATION_LIMIT: 20,
} as const;

export const USER_ROLES = {
  COMPANY_ADMIN: 'company',
  USER: 'user', 
  GUEST: 'guest',
} as const;

export const CHAT_MODELS = {
  OPENAI: 'OpenAI',
  CLAUDE: 'Claude',
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;
