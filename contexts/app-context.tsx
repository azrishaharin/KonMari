'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, subscribeToTable } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { toast } from 'react-toastify';

type Customer = Database['public']['Tables']['customers']['Row'];
type CompletedPickup = Database['public']['Tables']['completed_pickups']['Row'];
type DailyPickup = Database['public']['Views']['daily_pickups']['Row'];
type Settings = Database['public']['Tables']['settings']['Row'];

interface AppContextType {
  customers: Customer[];
  dailyPickups: DailyPickup[];
  completedPickups: CompletedPickup[];
  settings: Settings | null;
  isLoading: boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer | null>;
  deleteCustomer: (id: string) => Promise<void>;
  markPickupComplete: (customerId: string, notes?: string) => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dailyPickups, setDailyPickups] = useState<DailyPickup[]>([]);
  const [completedPickups, setCompletedPickups] = useState<CompletedPickup[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: customersData },
          { data: dailyPickupsData },
          { data: completedPickupsData },
          { data: settingsData }
        ] = await Promise.all([
          supabase.from('customers').select('*'),
          supabase.from('daily_pickups').select('*'),
          supabase.from('completed_pickups').select('*'),
          supabase.from('settings').select('*').single()
        ]);

        if (customersData) setCustomers(customersData);
        if (dailyPickupsData) setDailyPickups(dailyPickupsData);
        if (completedPickupsData) setCompletedPickups(completedPickupsData);
        if (settingsData) setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const unsubCustomers = subscribeToTable('customers', (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        setCustomers(prev => [...prev, payload.new as Customer]);
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        setCustomers(prev => prev.map(customer => 
          customer.id === payload.new?.id ? payload.new as Customer : customer
        ));
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setCustomers(prev => prev.filter(customer => customer.id !== payload.old?.id));
      }
    });

    const unsubCompletedPickups = subscribeToTable('completed_pickups', (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        setCompletedPickups(prev => [...prev, payload.new as CompletedPickup]);
        // Update daily pickups status
        setDailyPickups(prev => prev.map(pickup => 
          pickup.customer_id === payload.new?.customer_id 
            ? { ...pickup, is_completed: true }
            : pickup
        ));
      }
    });

    return () => {
      unsubCustomers();
      unsubCompletedPickups();
    };
  }, []);

  const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCustomers(prev => [...prev, data]);
        toast.success('Customer added successfully');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCustomers(prev => prev.map(customer => 
          customer.id === id ? data : customer
        ));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  };

  const markPickupComplete = async (customerId: string, notes?: string) => {
    try {
      const { error } = await supabase
        .rpc('mark_pickup_completed', {
          p_customer_id: customerId,
          p_notes: notes
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking pickup complete:', error);
      throw error;
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const { error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', settings?.id || '');

      if (error) throw error;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        customers, 
        dailyPickups,
        completedPickups,
        settings,
        isLoading,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        markPickupComplete,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 