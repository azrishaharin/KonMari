'use client';

import React from 'react';
import { useApp } from '@/contexts/app-context';
import { Users, Calendar, DollarSign, AlertCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Scale,
  CoreScaleOptions,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { customers, dailyPickups } = useApp();

  // Calculate metrics
  const totalRevenue = customers.reduce((acc, customer) => {
    const basePrice = {
      'MONTHLY': 30,
      'QUARTERLY': 80,
      'YEARLY': 250
    }[customer.subscription_type] || 0;
    return acc + basePrice;
  }, 0);

  const cards = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      change: 'Total active customers',
    },
    {
      title: "Today's Pickups",
      value: dailyPickups.length,
      icon: Calendar,
      change: format(new Date(), 'MMM d'),
    },
    {
      title: 'Monthly Revenue',
      value: `RM ${totalRevenue}`,
      icon: DollarSign,
      change: 'Current month',
    },
    {
      title: 'Pending Payments',
      value: customers.filter(c => c.payment_status === 'pending').length,
      icon: AlertCircle,
      change: 'Requires attention',
    },
  ];

  // Static analytics data
  const analyticsData = {
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [12400, 13100, 12800, 14200, 13900, 15100]
    },
    customerDistribution: {
      labels: ['Monthly', 'Quarterly', 'Yearly'],
      data: [
        customers.filter(c => c.subscription_type === 'MONTHLY').length,
        customers.filter(c => c.subscription_type === 'QUARTERLY').length,
        customers.filter(c => c.subscription_type === 'YEARLY').length
      ]
    },
    pickupCompletion: {
      labels: ['Mon', 'Wed', 'Fri'],
      data: [95, 98, 96]
    }
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, value: number) {
            return `${value}%`;
          }
        }
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting data...');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <card.icon className="h-8 w-8 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {card.change}
              </span>
            </div>
            <h2 className="text-xl font-semibold mt-4">{card.value}</h2>
            <p className="text-gray-600 dark:text-gray-400">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <button
            onClick={handleExport}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Monthly Revenue</h3>
            <div className="h-[250px] sm:h-[300px] w-full">
              <Line 
                data={{
                  labels: analyticsData.revenue.labels,
                  datasets: [{
                    label: 'Monthly Revenue (RM)',
                    data: analyticsData.revenue.data,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.4
                  }]
                }} 
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Customer Distribution</h3>
            <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
              <Pie 
                data={{
                  labels: analyticsData.customerDistribution.labels,
                  datasets: [{
                    data: analyticsData.customerDistribution.data,
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(147, 51, 234, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                    ],
                  }]
                }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Pickup Completion Rate</h3>
            <div className="h-[250px] sm:h-[300px] w-full">
              <Bar 
                data={{
                  labels: analyticsData.pickupCompletion.labels,
                  datasets: [{
                    label: 'Completion Rate (%)',
                    data: analyticsData.pickupCompletion.data,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 