import { NextResponse } from 'next/server';
import { createErrorResponse } from '../schemas/errors';

const API_KEY = process.env.API_KEY || 'development-key';

export async function validateApiKey(req: Request) {
  // Skip validation during build time
  if (process.env.NODE_ENV === 'production') {
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        createErrorResponse(
          'API key is required',
          'UNAUTHORIZED'
        ),
        { status: 401 }
      );
    }

    if (apiKey !== API_KEY) {
      return NextResponse.json(
        createErrorResponse(
          'Invalid API key',
          'UNAUTHORIZED'
        ),
        { status: 401 }
      );
    }
  }
}
