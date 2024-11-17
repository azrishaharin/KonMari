'use client';

import React from 'react';
import { 
  Users,
  Calendar,
  DollarSign,
  AlertCircle 
} from "lucide-react";
import { mockMetrics } from '@/lib/mock-data';

const metrics = [
  {
    name: "Total Customers",
    value: mockMetrics.totalCustomers.toString(),
    icon: Users,
    change: mockMetrics.customerGrowth,
    changeType: "positive",
  },
  {
    name: "Today's Pickups",
    value: mockMetrics.todayPickups.toString(),
    icon: Calendar,
    change: "Same as usual",
    changeType: "neutral",
  },
  {
    name: "Monthly Revenue",
    value: `RM ${mockMetrics.monthlyRevenue}`,
    icon: DollarSign,
    change: mockMetrics.revenueGrowth,
    changeType: "positive",
  },
  {
    name: "Pending Payments",
    value: mockMetrics.pendingPayments.toString(),
    icon: AlertCircle,
    change: "-2",
    changeType: "negative",
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div className="absolute rounded-md bg-blue-500 p-3">
              <metric.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              {metric.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {metric.value}
            </p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                metric.changeType === "positive"
                  ? "text-green-600"
                  : metric.changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {metric.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
} 