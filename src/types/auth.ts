// Authentication related types
export type UserType = 'company' | 'user' | 'guest';

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

