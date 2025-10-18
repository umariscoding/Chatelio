export interface MessagesTimePoint {
  date: string;
  totalMessages: number;
}

export interface ChatsTimePoint {
  date: string;
  newChats: number;
}

// Component Props Interfaces
export interface DashboardAnalyticsProps {
  className?: string;
}
