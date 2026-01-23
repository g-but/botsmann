'use client';

import React from 'react';
import Link from 'next/link';
import { EnhancedTransaction } from '../types';

interface LawsTabProps {
  laws: EnhancedTransaction['enablingLaws'];
}

export const LawsTab: React.FC<LawsTabProps> = ({ laws }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900">Enabling Legislation</h3>
    <p className="mt-1 text-sm text-gray-500">
      These laws authorized and governed the execution of this transaction.
    </p>

    <ul className="mt-4 divide-y divide-gray-200">
      {laws.map((law) => (
        <li key={law.id} className="py-4">
          <div className="flex justify-between">
            <div>
              <h4 className="text-sm font-medium">
                <Link
                  href={{
                    pathname: '/projects/governance/open-law/[id]',
                    query: { id: law.id },
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {law.name}
                </Link>
              </h4>
              <p className="mt-1 text-sm text-gray-500">ID: {law.id}</p>
            </div>
            <div>
              <Link
                href={{
                  pathname: '/projects/governance/open-law/[id]',
                  query: { id: law.id },
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View Law Details
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
