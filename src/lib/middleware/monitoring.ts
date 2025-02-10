import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RequestMetrics {
  path: string;
  method: string;
  startTime: number;
  duration?: number;
  status?: number;
}

const metrics: RequestMetrics[] = [];

export async function monitorRequest(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  const startTime = performance.now();
  const path = req.nextUrl.pathname;
  const method = req.method;
  
  try {
    const response = await handler(req);
    const duration = performance.now() - startTime;
    
    // Store metrics
    metrics.push({
      path,
      method,
      startTime,
      duration,
      status: response.status
    });

    // Log performance metrics
    console.info(`API ${method} ${path} completed in ${duration.toFixed(2)}ms with status ${response.status}`);
    
    return response;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Store error metrics
    metrics.push({
      path,
      method,
      startTime,
      duration,
      status: 500
    });

    console.error(`API ${method} ${path} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
}

// Utility to get recent metrics
export function getRecentMetrics(minutes: number = 5): RequestMetrics[] {
  const cutoff = Date.now() - (minutes * 60 * 1000);
  return metrics.filter(m => m.startTime > cutoff);
}
