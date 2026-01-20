'use client';

import { type FC, useState } from 'react';
import { type BotTemplate } from '@/lib/bot-templates';

interface NameStepProps {
  template: BotTemplate;
  onSubmit: (name: string, additionalContext?: string) => void;
  onBack: () => void;
}

export const NameStep: FC<NameStepProps> = ({ template, onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [additionalContext, setAdditionalContext] = useState('');
  const [relationship, setRelationship] = useState('');

  const needsRelationship = template.requiredFields.includes('relationship');
  const canSubmit =
    name.trim().length > 0 && (!needsRelationship || relationship.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    let context = additionalContext;
    if (relationship) {
      context = `Relationship: ${relationship}. ${context}`.trim();
    }

    onSubmit(name.trim(), context.trim() || undefined);
  };

  const getPlaceholder = () => {
    if (template.category === 'memorial') {
      if (
        template.id.includes('dog') ||
        template.id.includes('cat') ||
        template.id.includes('pet')
      ) {
        return 'What was their name?';
      }
      return 'What should I call them?';
    }
    if (template.category === 'helpers') {
      return 'Give them a name (e.g., Alfred, Jeeves)';
    }
    return template.name;
  };

  const getContextPlaceholder = () => {
    if (template.category === 'memorial') {
      return 'Share a memory, their personality, things they used to say, or anything that made them special...';
    }
    return 'Add any specific traits, knowledge, or context you want them to have...';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Selected Template Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-100 mb-6">
          <span className="text-5xl">{template.emoji}</span>
          <div className="text-left">
            <div className="text-sm text-gray-500">Creating a</div>
            <div className="text-xl font-semibold text-gray-900">{template.name}</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {template.category === 'memorial' ? 'Who are you remembering?' : 'Give them a name'}
        </h1>
        <p className="text-gray-600">{template.description}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-lg transition-colors"
            autoFocus
          />
        </div>

        {/* Relationship (if required) */}
        {needsRelationship && (
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-2">
              Relationship <span className="text-red-500">*</span>
            </label>
            <input
              id="relationship"
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., my brother, my best friend, my mentor"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-lg transition-colors"
            />
          </div>
        )}

        {/* Optional Context Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showOptional ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showOptional ? 'Hide' : 'Add'} memories or details (optional)
          </button>

          {showOptional && (
            <div className="mt-4">
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder={getContextPlaceholder()}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-lg transition-colors resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                The more details you add, the more personalized the experience.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Choose Different
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
              canSubmit
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Create & Chat</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Starter Questions Preview */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Example conversations you can have:
        </h3>
        <div className="flex flex-wrap gap-2">
          {template.starterQuestions.map((question, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm"
            >
              "{question}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
