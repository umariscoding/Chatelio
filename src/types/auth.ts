export interface User {
  user_id: string;
  company_id: string;
  email: string;
  name: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type UserType = "user" | "guest";
