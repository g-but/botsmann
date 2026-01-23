'use client';

import React from 'react';
import { EnhancedTransaction } from '../types';

interface DocumentsTabProps {
  documents: EnhancedTransaction['documents'];
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900">Supporting Documentation</h3>
    <p className="mt-1 text-sm text-gray-500">
      Complete documentation for transparency and compliance verification.
    </p>

    <ul className="mt-4 divide-y divide-gray-200">
      {documents.map((doc) => (
        <li key={doc.id} className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-900">{doc.name}</span>
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Document
            </a>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
