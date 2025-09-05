export interface ActivityItem {
  id: string;
  type: 'chat' | 'document' | 'user' | 'settings';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    email: string;
  };
  metadata?: Record<string, any>;
}

export interface RecentActivityProps {
  activities?: ActivityItem[];
  maxItems?: number;
  className?: string;
  loading?: boolean;
}

export interface ActivityItemProps {
  activity: ActivityItem;
  className?: string;
}
