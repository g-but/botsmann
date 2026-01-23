'use client';

import React from 'react';

const API_ROUTES = `// API Routes Structure
POST /api/auth/register     // Create new user account
POST /api/auth/login        // Authenticate user & issue tokens
POST /api/auth/refresh      // Refresh access token
POST /api/auth/logout       // Invalidate tokens
POST /api/auth/verify-email // Verify user email
POST /api/auth/forgot-password // Request password reset
POST /api/auth/reset-password  // Set new password with token`;

const USER_SCHEMA = `// User Schema
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "password": "hashed_password",  // bcrypt with salt
  "firstName": "John",
  "lastName": "Doe",
  "emailVerified": true,
  "createdAt": "2023-04-12T23:20:50.52Z",
  "updatedAt": "2023-04-12T23:20:50.52Z",
  "lastLogin": "2023-04-12T23:20:50.52Z",
  "roles": ["user", "admin"],
  "permissions": ["read:profile", "write:profile"],
  "settings": {
    "notifications": true,
    "twoFactorEnabled": false
  },
  "oauthProviders": [
    {
      "provider": "google",
      "providerId": "google-id-123",
      "linkedAt": "2023-04-12T23:20:50.52Z"
    }
  ]
}`;

const CONSIDERATIONS = [
  {
    title: 'Security Best Practices',
    items: [
      'Hash passwords with bcrypt (cost factor 12+)',
      'Implement rate limiting on auth endpoints',
      'Use short-lived JWTs (15 min) with refresh tokens',
      'Store tokens securely (HTTP-only cookies preferred)',
      'Implement CSRF protection for cookie-based auth',
    ],
  },
  {
    title: 'Performance Considerations',
    items: [
      'Cache user permissions after authentication',
      'Use database indexes on frequently queried fields',
      'Implement connection pooling for database efficiency',
      'Consider Redis for session store and rate limiting',
    ],
  },
  {
    title: 'Testing Strategy',
    items: [
      'Unit tests for validation and business logic',
      'Integration tests for API endpoints',
      'Security testing (penetration testing, OWASP checks)',
      'Load testing for authentication endpoints',
      'E2E tests for critical auth flows (login, registration)',
    ],
  },
];

export const ImplementationGuideTab: React.FC = () => (
  <div className="animate-fadeIn">
    <h3 className="text-xl font-semibold mb-4">Implementation Guide</h3>

    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="font-medium text-gray-900 mb-2">Authentication API Design</h4>
      <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto code-scrollbar">
        <pre>{API_ROUTES}</pre>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="font-medium text-gray-900 mb-2">User Model Design</h4>
      <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto code-scrollbar">
        <pre>{USER_SCHEMA}</pre>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">Implementation Considerations</h4>
      <div className="space-y-3">
        {CONSIDERATIONS.map((section) => (
          <div key={section.title} className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium text-gray-900 mb-1">{section.title}</div>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);
