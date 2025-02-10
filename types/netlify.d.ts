import { NextRequest, NextResponse } from 'next/server';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      API_KEY: string;
    }
  }
}

export interface NetlifyFunction {
  handler: (req: NextRequest) => Promise<NextResponse>;
}
