'use client';

import React, { useState } from 'react';
import { AgencyData, AgencyTab } from './types';
import { AgencyHeader } from './AgencyHeader';
import { OverviewTab, TransactionsTab, RegulationsTab, TeamTab } from './tabs';

interface AgencyProfileProps {
  agency: AgencyData;
}

const TABS: AgencyTab[] = ['overview', 'transactions', 'regulations', 'team'];

const AgencyProfile: React.FC<AgencyProfileProps> = ({ agency }) => {
  const [activeTab, setActiveTab] = useState<AgencyTab>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <AgencyHeader agency={agency} />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Agency Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab agency={agency} />}
        {activeTab === 'transactions' && <TransactionsTab transactions={agency.transactions} />}
        {activeTab === 'regulations' && <RegulationsTab regulations={agency.regulations} />}
        {activeTab === 'team' && <TeamTab team={agency.team} />}
      </div>
    </div>
  );
};

export default AgencyProfile;
