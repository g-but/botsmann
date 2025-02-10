import { NextRequest } from 'next/server';
import { POST as consultationsHandler } from '../../../app/api/consultations/route';
import { createErrorResponse } from '../../../src/lib/schemas/errors';

export default async function handler(req: Request | NextRequest) {
  const getPath = (req: Request | NextRequest): string => {
    if ('nextUrl' in req) {
      return req.nextUrl.pathname;
    }
    try {
      return new URL(req.url).pathname;
    } catch {
      // If URL parsing fails, try to extract path from url string
      const urlPath = req.url.split('?')[0];
      return urlPath.startsWith('http') ? new URL(urlPath).pathname : urlPath;
    }
  };

  const path = getPath(req);
  
  // Health check endpoint
  if (path === '/api/health') {
    return new Response(JSON.stringify({ 
      status: 'healthy',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Handle consultation form submissions
  if (path === '/api/consultations' && req.method === 'POST') {
    return consultationsHandler(req);
  }
  
  return new Response(
    JSON.stringify(createErrorResponse('Not Found', 'NOT_FOUND')),
    { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
