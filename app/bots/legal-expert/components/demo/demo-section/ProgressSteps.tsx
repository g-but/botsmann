'use client';

import React from 'react';
import { ProgressStepsProps, DEMO_STEPS, STEP_ORDER } from './types';

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {DEMO_STEPS.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                  currentStep === s.id
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white scale-110 shadow-lg'
                    : idx < currentIndex
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {idx < currentIndex ? '✓' : s.icon}
              </div>
              <span className="text-xs font-medium text-gray-600 mt-2">{s.label}</span>
            </div>
            {idx < 3 && (
              <div
                className={`flex-1 h-1 mx-4 rounded ${
                  idx < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
