// Authentication related types
export interface User {
  user_id: string;
  company_id: string;
  email: string;
  name: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface Company {
  company_id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  slug: string | null;
  is_published: boolean;
  chatbot_title?: string;
  chatbot_description?: string;
  created_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  company?: Company;
  tokens: Tokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CompanyRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
  company_id: string;
}

export interface GuestSession {
  session_id: string;
  company_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  expires_at: string;
}
