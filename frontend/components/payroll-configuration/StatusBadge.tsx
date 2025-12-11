import React from 'react';

export type ConfigStatus = 'draft' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: ConfigStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 border-red-300',
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
};

