'use client';

import React from 'react';
import Link from "next/link";
import { 
  UserPlus, 
  Truck, 
  CreditCard, 
  FileText 
} from "lucide-react";

const actions = [
  {
    name: "Add Customer",
    href: "/dashboard/customers/new",
    icon: UserPlus,
    description: "Register a new customer",
  },
  {
    name: "Today's Pickups",
    href: "/dashboard/pickups",
    icon: Truck,
    description: "View and manage today's schedule",
  },
  {
    name: "Pending Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    description: "Review outstanding payments",
  },
  {
    name: "Generate Report",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Create activity reports",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="relative rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center space-x-3">
              <action.icon className="h-6 w-6 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {action.name}
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 