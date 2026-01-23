'use client';

import React from 'react';
import DataRoomDemo from '../../DataRoomDemo';
import { DataRoomStepProps } from '../types';

const INFO_CARDS = [
  {
    icon: '🤖',
    title: 'AI Assistant',
    description: 'Instant answers, document analysis, and case research 24/7',
  },
  {
    icon: '👨‍⚖️',
    title: 'Human Lawyer',
    description: 'Expert review, strategy, and representation when needed',
  },
  {
    icon: '🔒',
    title: 'Full Transparency',
    description: 'Every action logged. Share access with family, advisors, or team',
  },
];

const HOW_IT_WORKS = [
  {
    text: 'Real-time collaboration:',
    detail: 'Chat with AI and lawyers instantly, no appointments needed',
  },
  { text: 'Smart file management:', detail: 'AI auto-categorizes and analyzes all documents' },
  {
    text: 'Multi-level access:',
    detail: 'Grant different permissions to attorneys, paralegals, and advisors',
  },
  {
    text: 'Full audit trail:',
    detail: 'Every message, file upload, and action is logged and encrypted',
  },
];

export const DataRoomStep: React.FC<DataRoomStepProps> = ({
  caseContext,
  selectedLawyerUsername,
  selectedLawyerAvatar,
}) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-500 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="text-3xl sm:text-4xl">🚀</div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            Welcome to Your Private Data Room!
          </h3>
          <p className="text-sm sm:text-base text-gray-700">
            Chat with AI and your lawyer in real-time. All conversations are encrypted and logged
            for transparency.
          </p>
        </div>
      </div>
    </div>

    <DataRoomDemo
      files={caseContext.files}
      lawyerUsername={selectedLawyerUsername}
      lawyerAvatar={selectedLawyerAvatar}
    />

    <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
      {INFO_CARDS.map((card) => (
        <div key={card.title} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{card.icon}</span>
            <h4 className="font-semibold text-gray-900 text-sm">{card.title}</h4>
          </div>
          <p className="text-xs text-gray-600">{card.description}</p>
        </div>
      ))}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
        💡 How the Data Room Works
      </h4>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
        {HOW_IT_WORKS.map((item) => (
          <li key={item.text} className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>
              <strong>{item.text}</strong> {item.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
