import type { User, Company } from '@/types/auth';

export interface UserChatLayoutProps {
  children: React.ReactNode;
  user: User | null;
  company: Company | null;
}
