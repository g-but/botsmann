import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: 'unhealthy', error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Simple health check - query the database
    const { error } = await supabase
      .from('consultations')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { status: 'healthy', database: 'connected' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: 'Database connection failed' },
      { status: 503 }
    );
  }
}
