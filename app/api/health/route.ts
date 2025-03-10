import { NextResponse } from 'next/server';
import { connectDB } from '../../../src/lib/mongodb';

export async function GET() {
  try {
    const conn = await connectDB();
    const isConnected = conn.connection.readyState === 1;
    
    if (!isConnected) {
      throw new Error('Database not connected');
    }

    return NextResponse.json(
      { status: 'healthy', mongodb: 'connected' },
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
