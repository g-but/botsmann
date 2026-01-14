import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper to get user from Authorization header
async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper to get supabase client with service role
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase not configured');
  }

  return createClient(supabaseUrl, serviceKey);
}

// GET /api/settings - Get user settings
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceClient();

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error;
    }

    // Return default settings if none exist
    return NextResponse.json({
      settings: settings || {
        preferred_model: 'groq',
        groq_api_key: null,
        openai_api_key: null,
        ollama_url: null
      }
    });
  } catch (error) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

// PUT /api/settings - Update user settings
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { preferred_model, groq_api_key, openai_api_key, ollama_url } = body;

    // Validate preferred_model
    if (!['groq', 'openai', 'ollama'].includes(preferred_model)) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Upsert settings
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        id: user.id,
        preferred_model,
        groq_api_key: groq_api_key || null,
        openai_api_key: openai_api_key || null,
        ollama_url: ollama_url || null
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
