'use client';

import React from 'react';
import AIWorkspace from '../../AIWorkspace';
import { WorkspaceStepProps } from '../types';

const FEATURE_CARDS = [
  {
    icon: '🔐',
    title: 'Multi-Level Access',
    description:
      'Control who sees what. Set different permissions for attorney, paralegal, expert witnesses.',
  },
  {
    icon: '💬',
    title: 'Transparent Communication',
    description:
      'All interactions logged. Full transparency between client, attorney, and collaborators.',
  },
  {
    icon: '🤝',
    title: 'Collaborative Workspace',
    description: 'Work together in real-time. Comment, annotate, and collaborate on documents.',
  },
];

export const WorkspaceStep: React.FC<WorkspaceStepProps> = ({
  caseContext,
  selectedLawyerName,
}) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className="text-4xl">🎉</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Private Data Room Created!</h3>
          <p className="text-gray-700">
            Your case has been matched with <strong>{selectedLawyerName}</strong>. All files are
            encrypted and organized by AI.
          </p>
        </div>
      </div>
    </div>

    <AIWorkspace files={caseContext.files} />

    <div className="grid md:grid-cols-3 gap-4">
      {FEATURE_CARDS.map((card) => (
        <div key={card.title} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{card.icon}</span>
            <h4 className="font-semibold text-gray-900">{card.title}</h4>
          </div>
          <p className="text-sm text-gray-600">{card.description}</p>
        </div>
      ))}
    </div>
  </div>
);
