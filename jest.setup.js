import '@testing-library/jest-dom';

// Add fetch and Request polyfills for Node.js test environment
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

if (typeof global.Request === 'undefined') {
  global.Request = require('node-fetch').Request;
}

// Add Next.js specific polyfills
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, init) => ({
      status: init?.status || 200,
      json: async () => data
    })
  }
}));
