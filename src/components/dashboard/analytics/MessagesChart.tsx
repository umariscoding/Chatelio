'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Card from '@/components/ui/Card';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { Icons } from '@/components/ui';
import type { MessagesTimePoint } from '@/interfaces/Analytics.interface';

interface MessagesChartProps {
  data: MessagesTimePoint[];
  loading?: boolean;
  className?: string;
}

const MessagesChart: React.FC<MessagesChartProps> = ({ 
  data, 
  loading = false, 
  className = "" 
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="mb-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
          <SkeletonLoader className="h-80" />
        </div>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map(point => {
    // Parse date as local date to avoid timezone issues
    const dateParts = point.date.split('-');
    const localDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    
    return {
      date: localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      'Total Messages': point.totalMessages || 0,
    };
  });

  return (
    <Card className={`bg-white border-border-light hover:border-border-medium transition-colors duration-200 ${className}`}>
      <div className="p-6">
        {/* Simple header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Icons.MessageCircle className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Messages Over Time
              </h3>
              <p className="text-sm text-text-secondary">
                Daily message activity for the last 7 days
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {chartData.reduce((sum, point) => sum + point['Total Messages'], 0).toLocaleString()}
            </div>
            <div className="text-xs text-text-secondary">Total Messages</div>
          </div>
        </div>
        
        {/* Simple chart container */}
        <div className="bg-bg-secondary rounded-lg p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    padding: '12px',
                  }}
                  labelStyle={{ 
                    color: '#374151', 
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  formatter={(value, name) => [
                    <span style={{ color: '#2563eb', fontWeight: '600' }}>
                      {value.toLocaleString()}
                    </span>, 
                    name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="Total Messages" 
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#1d4ed8', strokeWidth: 2, stroke: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MessagesChart;
