export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  className?: string;
  loading?: boolean;
}

