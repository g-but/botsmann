'use client';

import React, { useState, type FC, type ReactNode } from 'react';
import { ProjectPlanTab } from './ProjectPlanTab';
import { TechnicalStrategyTab } from './TechnicalStrategyTab';
import { SprintPlanningTab } from './SprintPlanningTab';
import { ImplementationGuideTab } from './ImplementationGuideTab';

interface Tab {
  name: string;
  id: string;
}

const TABS: Tab[] = [
  { name: 'Project Plan', id: 'plan' },
  { name: 'Technical Strategy', id: 'strategy' },
  { name: 'Sprint Planning', id: 'sprint' },
  { name: 'Implementation Guide', id: 'implementation' },
];

const TAB_CONTENT: ReactNode[] = [
  <ProjectPlanTab key="plan" />,
  <TechnicalStrategyTab key="strategy" />,
  <SprintPlanningTab key="sprint" />,
  <ImplementationGuideTab key="implementation" />,
];

const ExampleSection: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="examples" className="scroll-mt-24 my-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">See Trident in Action</h2>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore how Trident creates comprehensive project plans and technical guidance for Cursor
          development, helping you build better software faster.
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

          <div className="p-6">{TAB_CONTENT[activeTab]}</div>
        </div>
      </div>
    </section>
  );
};

export default ExampleSection;
