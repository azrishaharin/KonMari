export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          device_id: string | null
          verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          device_id?: string | null
          verified?: boolean
          last_login?: string | null
        }
        Update: {
          email?: string | null
          phone?: string | null
          device_id?: string | null
          verified?: boolean
          last_login?: string | null
        }
      }
      devices: {
        Row: {
          id: string
          device_id: string
          verified: boolean
          last_login: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          device_id: string
          verified?: boolean
          last_login?: string
        }
        Update: {
          device_id?: string
          verified?: boolean
          last_login?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          subscription_type: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
          payment_status: 'paid' | 'pending' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          subscription_type: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
          payment_status?: 'paid' | 'pending' | 'overdue'
        }
        Update: Partial<Omit<Database['public']['Tables']['customers']['Insert'], 'id'>>
      }
      completed_pickups: {
        Row: {
          id: string
          customer_id: string
          pickup_date: string
          completed_at: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          pickup_date: string
          completed_at?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          pickup_date?: string
          completed_at?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          email_pickup_reminders: boolean
          email_payment_reminders: boolean
          sms_pickup_reminders: boolean
          sms_payment_reminders: boolean
          reminder_frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email_pickup_reminders?: boolean
          email_payment_reminders?: boolean
          sms_pickup_reminders?: boolean
          sms_payment_reminders?: boolean
          reminder_frequency?: string
        }
        Update: Partial<Omit<Database['public']['Tables']['settings']['Insert'], 'id'>>
      }
    }
    Views: {
      daily_pickups: {
        Row: {
          customer_id: string
          name: string
          phone: string
          address: string
          subscription_type: string
          is_completed: boolean
        }
      }
    }
    Functions: {
      mark_pickup_completed: {
        Args: {
          p_customer_id: string
          p_notes?: string
        }
        Returns: Database['public']['Tables']['completed_pickups']['Row']
      }
      get_next_pickup_day: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
} 