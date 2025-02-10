import { NextRequest } from 'next/server';
import { POST as consultationsHandler } from '../../../app/api/consultations/route';
import { createErrorResponse } from '../../../src/lib/schemas/errors';

export default async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
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
