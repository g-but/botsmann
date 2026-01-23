import { getServiceClient } from '@/lib/supabase';

// Lazy-loaded admin client for server-side operations
let _adminClient: ReturnType<typeof getServiceClient> | null = null;
function getSupabaseAdmin() {
  if (!_adminClient) {
    _adminClient = getServiceClient();
  }
  return _adminClient;
}

export interface WaitlistEntry {
  id?: string;
  email: string;
  preferences: {
    events: boolean;
    newsletters: boolean;
    blog: boolean;
    videos: boolean;
  };
  created_at?: string;
}

export class WaitlistModel {
  static async create(data: Omit<WaitlistEntry, 'id' | 'created_at'>): Promise<WaitlistEntry> {
    const { data: entry, error } = await getSupabaseAdmin()
      .from('waitlist')
      .insert([{
        email: data.email,
        preferences: data.preferences,
      }])
      .select()
      .single();

    if (error) throw error;
    return entry;
  }

  static async findByEmail(email: string): Promise<WaitlistEntry | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return data;
  }

  static async findById(id: string): Promise<WaitlistEntry | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('waitlist')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async deleteMany(_filter: Record<string, unknown> = {}): Promise<void> {
    const { error } = await getSupabaseAdmin()
      .from('waitlist')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
  }
}
