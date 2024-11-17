'use client';

import React from 'react';

interface SubscriptionFiltersProps {
  onFilterChange: (filters: {
    status: string;
    plan: string;
  }) => void;
}

export function SubscriptionFilters({ onFilterChange }: SubscriptionFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <select
        className="rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
        onChange={(e) => onFilterChange({ status: e.target.value, plan: '' })}
        defaultValue=""
      >
        <option value="">All Statuses</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
      </select>

      <select
        className="rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
        onChange={(e) => onFilterChange({ status: '', plan: e.target.value })}
        defaultValue=""
      >
        <option value="">All Plans</option>
        <option value="MONTHLY">Monthly</option>
        <option value="QUARTERLY">Quarterly</option>
        <option value="YEARLY">Yearly</option>
      </select>
    </div>
  );
} 