// API constants and endpoints
// NEVER hardcode these endpoints in components - always import from here

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    COMPANY_REGISTER: '/auth/company/register',
    COMPANY_LOGIN: '/auth/company/login',
    USER_REGISTER: '/users/register',
    USER_LOGIN: '/users/login',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  
  // Chat endpoints
  CHAT: {
    SEND: '/chat/send',
    HISTORY: '/chat/history',
    LIST: '/chat/list',
    UPDATE_TITLE: '/chat/title',
    DELETE: '/chat',
    DOCUMENTS: '/chat/documents',
    UPLOAD_TEXT: '/chat/upload-text',
    UPLOAD_DOCUMENT: '/chat/upload-document',
  },
  
  // Company endpoints
  COMPANY: {
    UPDATE_SLUG: '/auth/company/slug',
    PUBLISH_CHATBOT: '/auth/company/publish-chatbot',
  },
  
  // Public endpoints
  PUBLIC: {
    CHATBOT_INFO: '/public/chatbot',
    GUEST_CREATE: '/users/guest/create',
    CHAT: '/public/chatbot',
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_TYPE: 'user_type',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;
