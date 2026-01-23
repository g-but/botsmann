'use client';

import React, { useState } from 'react';
import { Tab } from './types';
import {
  ProjectPlanTab,
  TechnicalStrategyTab,
  SprintPlanningTab,
  ImplementationGuideTab,
} from './tabs';

const TABS: Tab[] = [
  { name: 'Project Plan', id: 'plan' },
  { name: 'Technical Strategy', id: 'strategy' },
  { name: 'Sprint Planning', id: 'sprint' },
  { name: 'Implementation Guide', id: 'implementation' },
];

const TAB_COMPONENTS = [
  ProjectPlanTab,
  TechnicalStrategyTab,
  SprintPlanningTab,
  ImplementationGuideTab,
];

const ExampleSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  return (
    <section id="examples" className="scroll-mt-24 my-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          See Trident in Action
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore how Trident creates comprehensive project plans and technical
          guidance for Cursor development, helping you build better software
          faster.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === index
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <ActiveTabComponent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExampleSection;
