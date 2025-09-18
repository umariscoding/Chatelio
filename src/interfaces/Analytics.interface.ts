export interface ChangeIndicator {
  value: string; // e.g., "+15%" or "-5%"
  type: 'increase' | 'decrease' | 'neutral';
}

export interface OverviewCard {
  count: number;
  change: ChangeIndicator;
}

export interface MessagesTimePoint {
  date: string;
  totalMessages: number;
}

export interface ChatsTimePoint {
  date: string;
  newChats: number;
}

export interface OverviewStats {
  totalMessages: OverviewCard;
  users: OverviewCard;
  totalChats: OverviewCard;
  knowledgeBases: OverviewCard;
  guestSessions: OverviewCard;
}

export interface TimeSeries {
  messagesOverTime: MessagesTimePoint[];
  chatsOverTime: ChatsTimePoint[];
}

export interface AnalyticsMetadata {
  lastUpdated: string;
  queryExecutionTime: number;
  companyId: string;
}

export interface AnalyticsDashboard {
  overview: OverviewStats;
  timeSeries: TimeSeries;
  metadata: AnalyticsMetadata;
}

// Component Props Interfaces
export interface DashboardAnalyticsProps {
  className?: string;
}

export interface MessagesChartProps {
  data: MessagesTimePoint[];
  loading?: boolean;
  className?: string;
}

export interface ChatsChartProps {
  data: ChatsTimePoint[];
  loading?: boolean;
  className?: string;
}
