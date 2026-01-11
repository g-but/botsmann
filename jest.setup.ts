import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for MongoDB/Mongoose
// @ts-expect-error - Node.js TextEncoder is compatible with global TextEncoder
global.TextEncoder = TextEncoder;
// @ts-expect-error - Node.js TextDecoder is compatible with global TextDecoder
global.TextDecoder = TextDecoder;

// Mock fetch globally
const mockFetch = jest.fn().mockImplementation(
  (): Promise<Partial<Response>> =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
);

// @ts-ignore - fetch mock
global.fetch = mockFetch;

// Store original env and test env vars
const testEnvVars = {
  OPENAI_API_KEY: 'test_openai_key',
  AMAZON_API_KEY: 'test_amazon_key',
  AMAZON_SECRET_KEY: 'test_amazon_secret',
  RICARDO_API_KEY: 'test_ricardo_key'
};

// Set initial test environment variables
Object.assign(process.env, testEnvVars);

// Reset mocks and env vars between tests
beforeEach(() => {
  jest.clearAllMocks();
  // Restore test env vars that may have been modified by tests
  Object.assign(process.env, testEnvVars);
});
