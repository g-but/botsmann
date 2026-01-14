/**
 * Supabase Client for Botsmann
 *
 * Free tier includes:
 * - 500MB PostgreSQL database
 * - 1GB file storage
 * - Unlimited API requests
 * - pgvector for embeddings
 *
 * Setup: https://supabase.com/dashboard
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database row types
export interface ConsultationRow {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface UserSettingsRow {
  id: string;
  preferred_model: 'groq' | 'openai' | 'ollama';
  groq_api_key: string | null;
  openai_api_key: string | null;
  ollama_url: string | null;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  user_id: string;
  name: string;
  type: string;
  size_bytes: number | null;
  storage_path: string;
  created_at: string;
}

export interface DocumentChunkRow {
  id: string;
  document_id: string;
  user_id: string;
  content: string;
  embedding: number[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Lazy-loaded Supabase client singleton
let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_supabaseClient) {
    return _supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase environment variables not configured. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  _supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return _supabaseClient;
}

// Convenience export that throws if not configured
// Use isSupabaseConfigured() first if you want to check
export const supabase = {
  from: (table: string) => {
    return getSupabaseClient().from(table);
  },
  auth: {
    get user() {
      return getSupabaseClient().auth.getUser();
    },
    signIn: (credentials: { email: string; password: string }) => {
      return getSupabaseClient().auth.signInWithPassword(credentials);
    },
    signOut: () => {
      return getSupabaseClient().auth.signOut();
    }
  },
  storage: {
    from: (bucket: string) => {
      return getSupabaseClient().storage.from(bucket);
    }
  }
};

// Server-side client with service role (for admin operations)
export function getServiceClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Server-side Supabase requires SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
