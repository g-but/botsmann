import { TextEncoder, TextDecoder } from 'util';

// Fix TypeScript type issues with global declarations
declare global {
  interface Global {
    TextEncoder: typeof TextEncoder;
    TextDecoder: typeof TextDecoder;
  }
}

// Set up test environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as any;
}

// Mock environment variables for tests
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.API_KEY = 'test-api-key';
