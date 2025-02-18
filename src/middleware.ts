import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = ['https://www.botsmann.com', 'https://botsmann.com', 'http://localhost:3000'];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Accept',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true'
      },
    });
  }

  // Handle actual requests
  const response = NextResponse.next();
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
}
