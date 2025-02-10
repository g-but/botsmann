import { TextEncoder, TextDecoder } from 'util';
import fetch, { Request, Response, Headers } from 'node-fetch';

// Set up test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.fetch = fetch as unknown as typeof global.fetch;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;
global.Headers = Headers as unknown as typeof global.Headers;

// Mock environment variables for tests
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.API_KEY = 'test-api-key';

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse,
      json: (data: any, init?: ResponseInit) => originalModule.NextResponse.json(data, {
        ...init,
        headers: {
          ...init?.headers,
          'Content-Type': 'application/json'
        }
      })
    }
  };
});
