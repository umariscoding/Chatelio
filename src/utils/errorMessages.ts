// Centralized error messages and validation utilities

export const ERROR_MESSAGES = {
  // Auth errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
    TOKEN_INVALID: 'Your authentication token is invalid. Please log in again.',
    TOKEN_EXPIRED: 'Your authentication token has expired. Please log in again.',
    LOGOUT_FAILED: 'Failed to log out. Please try again.',
  },

  // Network errors
  NETWORK: {
    CONNECTION_FAILED: 'Unable to connect to the server. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'A server error occurred. Please try again later.',
    SERVICE_UNAVAILABLE: 'The service is temporarily unavailable. Please try again later.',
    RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
    PASSWORD_WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
    INVALID_URL: 'Please enter a valid URL.',
    INVALID_SLUG: 'Slug can only contain lowercase letters, numbers, and hyphens.',
    SLUG_TOO_SHORT: 'Slug must be at least 3 characters long.',
    SLUG_TOO_LONG: 'Slug cannot be longer than 50 characters.',
    FILE_TOO_LARGE: 'File size must be less than 10MB.',
    INVALID_FILE_TYPE: 'Invalid file type. Only text files are supported.',
  },

  // Chat errors
  CHAT: {
    MESSAGE_EMPTY: 'Please enter a message.',
    MESSAGE_TOO_LONG: 'Message is too long. Please keep it under 2000 characters.',
    CHAT_NOT_FOUND: 'Chat not found or you do not have access to it.',
    SEND_FAILED: 'Failed to send message. Please try again.',
    HISTORY_LOAD_FAILED: 'Failed to load chat history.',
    DELETE_FAILED: 'Failed to delete chat.',
    TITLE_UPDATE_FAILED: 'Failed to update chat title.',
    CONNECTION_LOST: 'Connection lost. Trying to reconnect...',
    STREAM_ERROR: 'Error in message stream. Please try again.',
  },

  // Knowledge Base errors
  KNOWLEDGE_BASE: {
    UPLOAD_FAILED: 'Failed to upload document. Please try again.',
    DELETE_FAILED: 'Failed to delete document.',
    LIST_FAILED: 'Failed to load documents.',
    PROCESSING_FAILED: 'Document processing failed. Please try uploading again.',
    DOCUMENT_NOT_FOUND: 'Document not found.',
    UNSUPPORTED_FORMAT: 'Unsupported file format. Please upload a text file.',
    CONTENT_TOO_LARGE: 'Content is too large. Please reduce the size and try again.',
  },

  // Company errors
  COMPANY: {
    REGISTRATION_FAILED: 'Company registration failed. Please try again.',
    UPDATE_FAILED: 'Failed to update company information.',
    SLUG_TAKEN: 'This slug is already taken. Please choose a different one.',
    SLUG_INVALID: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.',
    PUBLISH_FAILED: 'Failed to publish chatbot. Please try again.',
    UNPUBLISH_FAILED: 'Failed to unpublish chatbot. Please try again.',
    NOT_FOUND: 'Company not found.',
    ACCESS_DENIED: 'You do not have access to this company.',
  },

  // User errors
  USER: {
    REGISTRATION_FAILED: 'User registration failed. Please try again.',
    LOGIN_FAILED: 'Login failed. Please check your credentials and try again.',
    UPDATE_FAILED: 'Failed to update user profile.',
    EMAIL_TAKEN: 'This email address is already in use.',
    USER_NOT_FOUND: 'User not found.',
    PROFILE_LOAD_FAILED: 'Failed to load user profile.',
  },

  // Public chatbot errors
  PUBLIC: {
    CHATBOT_NOT_FOUND: 'Chatbot not found or not published.',
    GUEST_SESSION_FAILED: 'Failed to create guest session. Please try again.',
    COMPANY_NOT_PUBLISHED: 'This company has not published their chatbot.',
    INVALID_COMPANY_SLUG: 'Invalid company URL.',
  },

  // Generic errors
  GENERIC: {
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    LOAD_FAILED: 'Failed to load data. Please try again.',
    SAVE_FAILED: 'Failed to save changes. Please try again.',
    DELETE_FAILED: 'Failed to delete item. Please try again.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    BAD_REQUEST: 'Invalid request. Please check your input and try again.',
  },
} as const;

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { isValid: false, message: ERROR_MESSAGES.VALIDATION.PASSWORD_WEAK };
  }
  
  return { isValid: true };
};

export const validateSlug = (slug: string): { isValid: boolean; message?: string } => {
  if (!slug) {
    return { isValid: false, message: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD };
  }
  
  if (slug.length < 3) {
    return { isValid: false, message: ERROR_MESSAGES.VALIDATION.SLUG_TOO_SHORT };
  }
  
  if (slug.length > 50) {
    return { isValid: false, message: ERROR_MESSAGES.VALIDATION.SLUG_TOO_LONG };
  }
  
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return { isValid: false, message: ERROR_MESSAGES.VALIDATION.INVALID_SLUG };
  }
  
  return { isValid: true };
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateFileType = (file: File, allowedTypes: string[] = ['text/plain']): boolean => {
  return allowedTypes.includes(file.type);
};

// Form validation helper
export const getFieldError = (
  fieldName: string,
  value: any,
  validationRules: Record<string, any>
): string | null => {
  const rules = validationRules[fieldName];
  if (!rules) return null;

  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
  }

  if (rules.email && value && !validateEmail(value)) {
    return ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
  }

  if (rules.password && value) {
    const validation = validatePassword(value);
    if (!validation.isValid) {
      return validation.message || ERROR_MESSAGES.VALIDATION.PASSWORD_WEAK;
    }
  }

  if (rules.slug && value) {
    const validation = validateSlug(value);
    if (!validation.isValid) {
      return validation.message || ERROR_MESSAGES.VALIDATION.INVALID_SLUG;
    }
  }

  if (rules.minLength && value && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters long.`;
  }

  if (rules.maxLength && value && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters long.`;
  }

  return null;
};

// HTTP status code to error message mapping
export const getErrorMessageFromStatus = (status: number): string => {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.GENERIC.BAD_REQUEST;
    case 401:
      return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.AUTH.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.GENERIC.NOT_FOUND;
    case 429:
      return ERROR_MESSAGES.NETWORK.RATE_LIMITED;
    case 500:
      return ERROR_MESSAGES.NETWORK.SERVER_ERROR;
    case 503:
      return ERROR_MESSAGES.NETWORK.SERVICE_UNAVAILABLE;
    default:
      return ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR;
  }
};

export default ERROR_MESSAGES;
