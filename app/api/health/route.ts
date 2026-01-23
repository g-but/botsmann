import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { jsonSuccess, jsonServiceUnavailable } from '@/lib/api';

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return jsonServiceUnavailable('Database not configured');
    }

    const { error } = await supabase.from('consultations').select('id').limit(1);

    if (error) {
      throw error;
    }

    return jsonSuccess({ status: 'healthy', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    return jsonServiceUnavailable('Database connection failed');
  }
}
