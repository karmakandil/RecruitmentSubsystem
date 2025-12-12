'use client';

interface StatusBadgeProps {
  status: 'draft' | 'approved' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = {
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const statusText = {
    draft: 'Draft',
    approved: 'Approved',
    rejected: 'Rejected'
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${styles[status]} ${sizeClasses[size]}`}>
      {statusText[status]}
    </span>
  );
}