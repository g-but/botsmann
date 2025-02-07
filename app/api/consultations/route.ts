import { NextResponse } from 'next/server';
// Temporarily disable any external model import.
// import Consultation from '../../../src/models/Consultation';
import { safeBufferFrom } from '../../../src/utils/safeBuffer';

export async function POST(req: Request) {
  // Return a simple static response without demonstration code that references undefined variables.
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 