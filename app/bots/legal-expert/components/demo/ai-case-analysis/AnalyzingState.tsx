'use client';

import React from 'react';
import { AnalyzingStateProps } from './types';

export const AnalyzingState: React.FC<AnalyzingStateProps> = ({ progress }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-gray-100">
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-6">
          <div className="text-4xl animate-pulse">🤖</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Analyzing Your Case...</h3>
        <p className="text-gray-600">
          Reviewing jurisdiction-specific laws, analyzing case complexity, and preparing your
          personalized report
        </p>
      </div>

      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div className={`transition-opacity ${progress > 30 ? 'opacity-100' : 'opacity-30'}`}>
          ✓ Analyzing jurisdiction
        </div>
        <div className={`transition-opacity ${progress > 60 ? 'opacity-100' : 'opacity-30'}`}>
          ✓ Reviewing case law
        </div>
        <div className={`transition-opacity ${progress > 90 ? 'opacity-100' : 'opacity-30'}`}>
          ✓ Generating report
        </div>
      </div>
    </div>
  </div>
);
