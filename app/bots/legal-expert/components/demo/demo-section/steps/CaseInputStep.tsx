'use client';

import React from 'react';
import { LEGAL_AREAS } from '../../constants';
import { JURISDICTIONS } from '../../jurisdictions';
import FileUploader from '../../FileUploader';
import JurisdictionSelector from '../../JurisdictionSelector';
import { CaseInputStepProps } from '../types';

const URGENCY_OPTIONS = [
  { id: 'low', label: 'Low', icon: '🟢', desc: 'No rush' },
  { id: 'medium', label: 'Medium', icon: '🟡', desc: 'Few weeks' },
  { id: 'high', label: 'High', icon: '🟠', desc: 'This week' },
  { id: 'critical', label: 'Critical', icon: '🔴', desc: 'Urgent' },
];

export const CaseInputStep: React.FC<CaseInputStepProps> = ({
  caseContext,
  onCaseContextChange,
  onFilesUploaded,
}) => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border-2 border-gray-100">
    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
      Describe Your Legal Case
    </h3>

    <div className="space-y-6">
      {/* Jurisdiction Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Jurisdiction
          <span className="ml-2 text-xs font-normal text-gray-500">
            (Drill down or skip to select broader region)
          </span>
        </label>
        <JurisdictionSelector
          jurisdictions={JURISDICTIONS}
          selectedCode={caseContext.jurisdiction}
          onSelect={(code) => onCaseContextChange({ jurisdiction: code })}
        />
      </div>

      {/* Legal Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Area of Law
          <span className="ml-2 text-xs font-normal text-gray-500">(🔥 = High demand)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {LEGAL_AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => onCaseContextChange({ legalArea: area.id })}
              className={`p-3 rounded-lg border-2 transition-all text-left relative active:scale-95 ${
                caseContext.legalArea === area.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 active:border-blue-400'
              }`}
            >
              {area.demandLevel === 'high' && (
                <span className="absolute top-1 right-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                  🔥
                </span>
              )}
              <div className="text-xl mb-1">{area.icon}</div>
              <div className="text-sm font-medium text-gray-900">{area.name}</div>
              <div className="text-xs text-gray-600 mt-1">{area.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Case Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Case Description
          <span className="ml-2 text-xs font-normal text-gray-500">
            (Provide context - minimum 20 characters)
          </span>
        </label>
        <textarea
          value={caseContext.description}
          onChange={(e) => onCaseContextChange({ description: e.target.value })}
          placeholder="Describe your legal situation in detail. Include relevant dates, parties involved, and what you're seeking help with..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {caseContext.description.length} / 20 minimum characters
          </span>
          {caseContext.description.length >= 20 && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <span>✓</span> Ready to proceed
            </span>
          )}
        </div>
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Urgency Level</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {URGENCY_OPTIONS.map((u) => (
            <button
              key={u.id}
              onClick={() => onCaseContextChange({ urgency: u.id as 'low' | 'medium' | 'high' | 'critical' })}
              className={`p-3 rounded-lg border-2 transition-all active:scale-95 ${
                caseContext.urgency === u.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 active:border-blue-400'
              }`}
            >
              <div className="text-2xl mb-1">{u.icon}</div>
              <div className="text-sm font-medium text-gray-900">{u.label}</div>
              <div className="text-xs text-gray-600">{u.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Upload Documents (Optional)
        </label>
        <FileUploader onFilesUploaded={onFilesUploaded} />
        {caseContext.files.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            📎 {caseContext.files.length} file(s) uploaded
          </div>
        )}
      </div>
    </div>
  </div>
);
