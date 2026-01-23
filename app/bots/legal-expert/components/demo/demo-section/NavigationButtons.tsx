'use client';

import React from 'react';
import { NavigationButtonsProps } from './types';

const BUTTON_LABELS: Record<string, string> = {
  input: '🔍 Find Lawyers',
  'lawyer-match': '🚀 Create Workspace',
  workspace: '🚀 Open Workspace Dashboard',
};

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  step,
  canProceed,
  onBack,
  onProceed,
  onReset,
}) => (
  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
    <div>
      {step !== 'input' && (
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          ← Back
        </button>
      )}
    </div>

    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <button
        onClick={onReset}
        className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors text-center"
      >
        🔄 Reset Demo
      </button>

      {step !== 'dataroom' && (
        <button
          onClick={onProceed}
          disabled={!canProceed}
          className="px-6 py-4 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
        >
          {BUTTON_LABELS[step] || 'Continue'} →
        </button>
      )}
    </div>
  </div>
);
