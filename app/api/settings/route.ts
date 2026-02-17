/**
 * User Settings API
 *
 * GET /api/settings - Get user settings
 * PUT /api/settings - Update user settings
 */

import { type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServiceClient } from '@/lib/supabase';
import { verifyUser } from '@/lib/api-utils';
import { jsonSuccess, jsonError, jsonUnauthorized, handleError, HTTP_STATUS } from '@/lib/api';
import {
  MODEL_PROVIDERS,
  DEFAULT_USER_SETTINGS,
  DB_ERROR_CODES,
  DOMAIN_ERRORS,
} from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyUser(req);
    if (!user) {
      return jsonUnauthorized();
    }

    const supabase = getServiceClient();

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== DB_ERROR_CODES.NO_ROWS_FOUND) {
      throw error;
    }

    return jsonSuccess({ settings: settings || DEFAULT_USER_SETTINGS }, { cache: 'PRIVATE_SHORT' });
  } catch (error) {
    return handleError(error, DOMAIN_ERRORS.FAILED_GET_SETTINGS);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await verifyUser(req);
    if (!user) {
      return jsonUnauthorized();
    }

    const body = await req.json();
    const { preferred_model, groq_api_key, openrouter_api_key, ollama_url } = body;

    // Validate preferred_model
    if (!MODEL_PROVIDERS.includes(preferred_model)) {
      return jsonError('Invalid model', 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST);
    }

    const supabase = getServiceClient();

    const { error } = await supabase.from('user_settings').upsert({
      id: user.id,
      preferred_model,
      groq_api_key: groq_api_key || null,
      openrouter_api_key: openrouter_api_key || null,
      ollama_url: ollama_url || null,
    });

    if (error) {
      throw error;
    }

    return jsonSuccess({ updated: true }, { cache: 'NONE' });
  } catch (error) {
    return handleError(error, DOMAIN_ERRORS.FAILED_UPDATE_SETTINGS);
  }
}
