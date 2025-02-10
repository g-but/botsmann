import { NextRequest } from 'next/server';
import type { RequestInit } from 'next/dist/server/web/spec-extension/request';

export class MockRequest extends NextRequest {
  constructor(input: URL | RequestInfo, init?: RequestInit) {
    const url = typeof input === 'string' ? new URL(input) : input instanceof URL ? input : new URL(input.url);
    super(url, init);
  }
}
