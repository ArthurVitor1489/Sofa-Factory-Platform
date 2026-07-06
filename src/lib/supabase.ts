import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback message for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are not fully configured. Using mock connection settings for local development.'
  );
}

// Create a single supabase client for interaction from frontend or server components
export const supabase = createClient(
  supabaseUrl || 'https://mockproject.supabase.co',
  supabaseAnonKey || 'mock-anon-key'
);

// Service role client (Server-only for admin level operations bypass RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseAdmin = typeof window === 'undefined'
  ? createClient(supabaseUrl || 'https://mockproject.supabase.co', supabaseServiceKey || 'mock-service-key')
  : null;
