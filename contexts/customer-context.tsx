'use client';

import React, { createContext, useContext, useState } from 'react';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_type: keyof typeof SUBSCRIPTION_PLANS;
  payment_status: 'paid' | 'pending' | 'overdue';
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'payment_status'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+60123456789',
      address: 'Block A-1-1, Taman Sri Rampai, 53300 Kuala Lumpur',
      subscription_type: 'MONTHLY',
      payment_status: 'paid',
    },
  ]);

  const addCustomer = (newCustomer: Omit<Customer, 'id' | 'payment_status'>) => {
    console.log('Adding new customer:', newCustomer);
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
      payment_status: 'pending',
    };
    setCustomers(prev => [...prev, customer]);
    console.log('Updated customers:', customers);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
} 