import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Supabase Admin Client (service role key - for backend operations)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Supabase Anon Client (for user operations - respects RLS policies)
export const supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Helper to execute raw SQL queries (admin only)
export async function executeSql(sql: string, params?: any[]) {
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    query: sql,
    params: params || [],
  });

  if (error) {
    throw new Error(`SQL Error: ${error.message}`);
  }

  return data;
}
