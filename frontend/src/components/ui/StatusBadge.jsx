import React from 'react';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    UNDER_REVIEW: { color: 'bg-warning/20 text-warning border-warning/30' },
    APPROVED: { color: 'bg-success/20 text-success border-success/30' },
    REJECTED: { color: 'bg-critical/20 text-critical border-critical/30' },
    IN_PROGRESS: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    COMPLETED: { color: 'bg-primary/20 text-primary border-primary/30' },
    FAILED: { color: 'bg-critical/20 text-critical border-critical/30' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border \${config.color}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
