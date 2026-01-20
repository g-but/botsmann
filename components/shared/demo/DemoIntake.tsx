'use client';

import { useState, type FC, type FormEvent } from 'react';
import type { IntakeQuestion, IntakeResponses } from '@/lib/demo/types';
import type { BotAccentColor } from '@/types/bot';

interface DemoIntakeProps {
  questions: IntakeQuestion[];
  responses: IntakeResponses;
  onUpdate: (questionId: string, value: string | string[]) => void;
  onStart: () => void;
  accentColor: BotAccentColor;
  icon: string;
  botName: string;
}

const accentColorClasses: Record<
  BotAccentColor,
  { button: string; focus: string; checkbox: string }
> = {
  blue: {
    button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    focus: 'focus:border-blue-500 focus:ring-blue-500',
    checkbox: 'text-blue-600 focus:ring-blue-500',
  },
  green: {
    button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    focus: 'focus:border-green-500 focus:ring-green-500',
    checkbox: 'text-green-600 focus:ring-green-500',
  },
  indigo: {
    button: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    focus: 'focus:border-indigo-500 focus:ring-indigo-500',
    checkbox: 'text-indigo-600 focus:ring-indigo-500',
  },
  red: {
    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    focus: 'focus:border-red-500 focus:ring-red-500',
    checkbox: 'text-red-600 focus:ring-red-500',
  },
  amber: {
    button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    focus: 'focus:border-amber-500 focus:ring-amber-500',
    checkbox: 'text-amber-600 focus:ring-amber-500',
  },
};

export const DemoIntake: FC<DemoIntakeProps> = ({
  questions,
  responses,
  onUpdate,
  onStart,
  accentColor,
  icon,
  botName,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const colors = accentColorClasses[accentColor];

  const essentialQuestions = questions.filter((q) => q.phase === 'essential');
  const advancedQuestions = questions.filter((q) => q.phase === 'advanced');

  // Check if all required questions are answered
  const requiredQuestions = questions.filter((q) => q.required);
  const allRequiredAnswered = requiredQuestions.every((q) => {
    const value = responses[q.id];
    if (Array.isArray(value)) return value.length > 0;
    return value && value.trim() !== '';
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (allRequiredAnswered) {
      onStart();
    }
  };

  const renderQuestion = (question: IntakeQuestion) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            id={question.id}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onUpdate(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 ${colors.focus} focus:outline-none focus:ring-1`}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={question.id}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onUpdate(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 ${colors.focus} focus:outline-none focus:ring-1 resize-none`}
          />
        );

      case 'select':
        return (
          <select
            id={question.id}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onUpdate(question.id, e.target.value)}
            className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 ${colors.focus} focus:outline-none focus:ring-1 bg-white`}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const selectedValues = Array.isArray(value) ? value : [];
              const isChecked = selectedValues.includes(option);

              return (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onUpdate(question.id, [...selectedValues, option]);
                      } else {
                        onUpdate(
                          question.id,
                          selectedValues.filter((v) => v !== option),
                        );
                      }
                    }}
                    className={`h-4 w-4 rounded border-gray-300 ${colors.checkbox}`}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 text-5xl">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Let&apos;s get started with {botName}
        </h3>
        <p className="text-gray-600">
          Answer a few questions so I can better understand your needs
        </p>
      </div>

      {/* Essential Questions */}
      <div className="space-y-6">
        {essentialQuestions.map((question) => (
          <div key={question.id}>
            <label htmlFor={question.id} className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderQuestion(question)}
          </div>
        ))}
      </div>

      {/* Advanced Questions Toggle */}
      {advancedQuestions.length > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {showAdvanced ? 'Hide' : 'Show'} additional options ({advancedQuestions.length})
          </button>

          {showAdvanced && (
            <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
              {advancedQuestions.map((question) => (
                <div key={question.id}>
                  <label
                    htmlFor={question.id}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={!allRequiredAnswered}
          className={`w-full rounded-lg px-6 py-3 text-white font-medium transition-colors ${colors.button} disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          Start Conversation
        </button>
        <p className="mt-3 text-center text-xs text-gray-500">
          You can upload documents and continue the conversation in the next step
        </p>
      </div>
    </form>
  );
};
