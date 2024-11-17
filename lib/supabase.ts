import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];

export function subscribeToTable<T extends TableName>(
  table: T,
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: Row<T> | null;
    old: Row<T> | null;
  }) => void
) {
  const channel = supabase.channel(`public:${table}`);

  channel
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table
      },
      (payload: RealtimePostgresChangesPayload<Row<T>>) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as Row<T> | null,
          old: payload.old as Row<T> | null
        });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
} 