import { loadEnvConfig } from '@next/env';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import nodeFetch, { Request, Response } from 'node-fetch';

// Load environment variables
loadEnvConfig(process.cwd());

// Add missing globals
Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});

Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
});

Object.defineProperty(global, 'Request', {
  value: Request,
});

Object.defineProperty(global, 'Response', {
  value: Response,
});

// Mock fetch
global.fetch = nodeFetch;
