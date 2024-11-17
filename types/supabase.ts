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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          subscription_type?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
          payment_status?: 'paid' | 'pending' | 'overdue'
          created_at?: string
          updated_at?: string
        }
      }
      pickups: {
        Row: {
          id: string
          customer_id: string
          scheduled_date: string
          scheduled_time: string
          status: 'pending' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          scheduled_date: string
          scheduled_time: string
          status?: 'pending' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          scheduled_date?: string
          scheduled_time?: string
          status?: 'pending' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 