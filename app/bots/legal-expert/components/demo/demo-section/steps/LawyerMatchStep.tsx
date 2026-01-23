'use client';

import React from 'react';
import { LEGAL_AREAS } from '../../constants';
import LawyerMatcher from '../../LawyerMatcher';
import { LawyerMatchStepProps } from '../types';

export const LawyerMatchStep: React.FC<LawyerMatchStepProps> = ({
  caseContext,
  selectedLawyer,
  onSelectLawyer,
  lawyers,
}) => (
  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-gray-100">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
        📋 Your Case Summary
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-gray-500">Jurisdiction:</span>
          <span className="font-medium text-gray-900">
            {caseContext.jurisdiction || 'Not selected'}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500">Area:</span>
          <span className="font-medium text-gray-900">
            {LEGAL_AREAS.find((a) => a.id === caseContext.legalArea)?.name}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500">Urgency:</span>
          <span className="font-medium text-gray-900 capitalize">{caseContext.urgency}</span>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <span className="text-gray-500 block mb-2">Description:</span>
          <p className="text-gray-900 text-sm">{caseContext.description}</p>
        </div>
        {caseContext.files.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <span className="text-gray-500 block mb-2">Files:</span>
            <span className="text-gray-900">{caseContext.files.length} document(s) attached</span>
          </div>
        )}
      </div>
    </div>

    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-gray-100">
      <LawyerMatcher
        lawyers={lawyers}
        selectedLawyer={selectedLawyer}
        onSelectLawyer={onSelectLawyer}
        legalArea={LEGAL_AREAS.find((a) => a.id === caseContext.legalArea)?.name || ''}
      />
    </div>
  </div>
);
