'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = false,
  animate = true,
}) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = animate ? 'animate-pulse' : '';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={`${baseClasses} ${animationClasses} ${roundedClasses} ${className}`}
      style={style}
    />
  );
};

// Predefined skeleton components for common use cases

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton 
        key={i} 
        height="1rem" 
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton width={40} height={40} rounded />
      <div className="flex-1">
        <Skeleton height="1rem" width="60%" />
        <Skeleton height="0.75rem" width="40%" className="mt-1" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonButton: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const heights = {
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
  };
  
  return (
    <Skeleton 
      height={heights[size]} 
      width="100px" 
      className={`rounded-md ${className}`} 
    />
  );
};

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className = '' 
}) => (
  <Skeleton 
    width={size} 
    height={size} 
    rounded 
    className={className} 
  />
);

export const SkeletonTable: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string 
}> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton key={`header-${i}`} height="1rem" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="0.875rem" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number; 
  showAvatar?: boolean; 
  className?: string 
}> = ({ 
  items = 5, 
  showAvatar = true, 
  className = '' 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="flex items-center space-x-3">
        {showAvatar && <SkeletonAvatar size={32} />}
        <div className="flex-1">
          <Skeleton height="1rem" width="70%" />
          <Skeleton height="0.75rem" width="50%" className="mt-1" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonForm: React.FC<{ fields?: number; className?: string }> = ({ 
  fields = 4, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: fields }, (_, i) => (
      <div key={i}>
        <Skeleton height="1rem" width="30%" className="mb-2" />
        <Skeleton height="2.5rem" />
      </div>
    ))}
    <div className="pt-4">
      <SkeletonButton size="lg" />
    </div>
  </div>
);

// Chat-specific skeletons
export const SkeletonMessage: React.FC<{ isUser?: boolean; className?: string }> = ({ 
  isUser = false, 
  className = '' 
}) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
    <div className={`max-w-xs lg:max-w-md ${isUser ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-3`}>
      <SkeletonText lines={2} />
    </div>
  </div>
);

export const SkeletonChatList: React.FC<{ items?: number; className?: string }> = ({ 
  items = 5, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: items }, (_, i) => (
      <div key={i} className="p-3 rounded-lg border">
        <Skeleton height="1rem" width="80%" />
        <Skeleton height="0.75rem" width="60%" className="mt-2" />
        <Skeleton height="0.75rem" width="40%" className="mt-1" />
      </div>
    ))}
  </div>
);

// Dashboard-specific skeletons
export const SkeletonStatsCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-lg border ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton height="0.875rem" width="60%" />
        <Skeleton height="2rem" width="40%" className="mt-2" />
      </div>
      <Skeleton width={48} height={48} rounded />
    </div>
  </div>
);

export const SkeletonDashboard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }, (_, i) => (
        <SkeletonStatsCard key={i} />
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export default Skeleton;
