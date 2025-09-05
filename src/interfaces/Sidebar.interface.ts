import type { UserType } from '@/types/auth';

export interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  badge?: string | number;
  allowedUserTypes: UserType[];
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}
