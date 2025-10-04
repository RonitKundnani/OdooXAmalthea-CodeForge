import React from 'react';

type Status = 'pending' | 'approved' | 'rejected' | 'draft' | 'processing';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  pending: {
    text: 'Pending',
    bg: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    dot: 'bg-yellow-400',
  },
  approved: {
    text: 'Approved',
    bg: 'bg-teal-50',
    textColor: 'text-teal-800',
    dot: 'bg-teal-400',
  },
  rejected: {
    text: 'Rejected',
    bg: 'bg-pink-50',
    textColor: 'text-pink-800',
    dot: 'bg-pink-400',
  },
  draft: {
    text: 'Draft',
    bg: 'bg-gray-100',
    textColor: 'text-gray-800',
    dot: 'bg-gray-400',
  },
  processing: {
    text: 'Processing',
    bg: 'bg-blue-50',
    textColor: 'text-blue-800',
    dot: 'bg-blue-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.textColor} ${
        sizeClasses[size]
      } ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} mr-2`}></span>
      {config.text}
    </span>
  );
};

// Example usage:
// <StatusBadge status="approved" size="md" className="ml-2" />
