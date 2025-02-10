import { NextResponse } from 'next/server';
import { createErrorResponse } from '../schemas/errors';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error('API_KEY environment variable is not set');
}

export async function validateApiKey(req: Request) {
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
