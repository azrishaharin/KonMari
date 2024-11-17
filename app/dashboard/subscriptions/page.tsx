'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/app-context';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { toast } from 'react-toastify';
import { Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';

type FilterStatus = 'all' | 'active' | 'unpaid';
type ReminderType = 'call' | 'whatsapp';

interface ReminderDialogProps {
  customer: {
    name: string;
    phone: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSendReminder: (type: ReminderType) => void;
}

function ReminderDialog({ customer, isOpen, onClose, onSendReminder }: ReminderDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Send Reminder to {customer.name}</h3>
        <div className="space-y-4">
          <button
            onClick={() => onSendReminder('call')}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Phone className="h-5 w-5" />
            Call Customer
          </button>
          <button
            onClick={() => onSendReminder('whatsapp')}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <MessageSquare className="h-5 w-5" />
            Send WhatsApp Message
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 border border-gray-300 rounded-md text-sm font-medium dark:border-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const { customers, updateCustomer } = useApp();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; phone: string } | null>(null);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  const handleSendReminder = (type: ReminderType) => {
    if (!selectedCustomer) return;

    if (type === 'call') {
      window.location.href = `tel:${selectedCustomer.phone}`;
    } else {
      const formattedPhone = selectedCustomer.phone.replace(/\+/g, '');
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    }
    setIsReminderDialogOpen(false);
  };

  const handleMarkAsPaid = async (customerId: string) => {
    try {
      await updateCustomer(customerId, { payment_status: 'paid' });
      toast.success('Payment status updated');
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const filteredCustomers = customers.filter(customer => {
    switch (filterStatus) {
      case 'active':
        return customer.payment_status === 'paid';
      case 'unpaid':
        return customer.payment_status === 'pending' || customer.payment_status === 'overdue';
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Subscriptions & Payments
        </h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Subscriptions</option>
          <option value="active">Active</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {SUBSCRIPTION_PLANS[customer.subscription_type].name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    RM {SUBSCRIPTION_PLANS[customer.subscription_type].price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : customer.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {customer.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    {customer.payment_status !== 'paid' && (
                      <>
                        <button
                          onClick={() => handleMarkAsPaid(customer.id)}
                          className="inline-flex items-center justify-center p-2 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900"
                          title="Mark as Paid"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer({
                              name: customer.name,
                              phone: customer.phone
                            });
                            setIsReminderDialogOpen(true);
                          }}
                          className="inline-flex items-center justify-center p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                          title="Send Reminder"
                        >
                          <Mail className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <ReminderDialog
          customer={selectedCustomer}
          isOpen={isReminderDialogOpen}
          onClose={() => {
            setIsReminderDialogOpen(false);
            setSelectedCustomer(null);
          }}
          onSendReminder={handleSendReminder}
        />
      )}
    </div>
  );
} 