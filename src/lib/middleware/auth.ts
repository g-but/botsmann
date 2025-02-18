import { NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY || 'development-key';

export async function validateApiKey(req: Request | { headers: { [key: string]: string | string[] | undefined } }) {
  // Skip validation during build time or static generation
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-static-generation') {
    return;
  }

  const apiKey = req instanceof Request ? req.headers.get('x-api-key') : 
    Array.isArray(req.headers['x-api-key']) ? req.headers['x-api-key'][0] : req.headers['x-api-key'];
  
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      message: 'API key is required',
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString()
    }, {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (apiKey !== API_KEY) {
    return NextResponse.json({
      success: false,
      message: 'Invalid API key',
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString()
    }, {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
