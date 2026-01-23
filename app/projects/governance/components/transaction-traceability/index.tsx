'use client';

import React, { useState } from 'react';
import { EnhancedTransaction, TransactionTab } from './types';
import { TransactionHeader } from './TransactionHeader';
import { TransactionSummary } from './TransactionSummary';
import { TransactionFooter } from './TransactionFooter';
import { DetailsTab, LawsTab, DocumentsTab, TimelineTab } from './tabs';

interface TransactionWithTraceabilityProps {
  transaction: EnhancedTransaction;
}

const TABS: { id: TransactionTab; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'laws', label: 'Enabling Laws' },
  { id: 'documents', label: 'Documents' },
  { id: 'timeline', label: 'Timeline' },
];

export const TransactionWithTraceability: React.FC<TransactionWithTraceabilityProps> = ({
  transaction,
}) => {
  const [activeTab, setActiveTab] = useState<TransactionTab>('details');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <TransactionHeader transaction={transaction} />
      <TransactionSummary transaction={transaction} />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-5 sm:p-6">
        {activeTab === 'details' && <DetailsTab transaction={transaction} />}
        {activeTab === 'laws' && <LawsTab laws={transaction.enablingLaws} />}
        {activeTab === 'documents' && <DocumentsTab documents={transaction.documents} />}
        {activeTab === 'timeline' && <TimelineTab timeline={transaction.timeline} />}
      </div>

      <TransactionFooter expanded={expanded} onToggleExpanded={() => setExpanded(!expanded)} />
    </div>
  );
};

export default TransactionWithTraceability;
