'use client';

/**
 * Step 4: Review & Publish
 * - Summary of all settings
 * - Publish button
 */

import type { BotAccentColor } from '@/types/bot';
import type { KnowledgeChunkDraft } from '@/lib/hooks/useBotBuilder';
import { COLOR_CLASSES, ACCENT_COLOR_OPTIONS } from '@/lib/config/colors';

interface StepReviewProps {
  title: string;
  slug: string;
  description: string;
  emoji: string;
  accentColor: BotAccentColor;
  systemPrompt: string;
  knowledgeChunks: KnowledgeChunkDraft[];
  isSubmitting: boolean;
  error: string | null;
  onSubmit: () => void;
  onGoToStep: (step: number) => void;
}

/** Get color label from centralized config */
function getColorLabel(color: BotAccentColor): string {
  return ACCENT_COLOR_OPTIONS.find((c) => c.value === color)?.label ?? color;
}

export function StepReview({
  title,
  slug,
  description,
  emoji,
  accentColor,
  systemPrompt,
  knowledgeChunks,
  isSubmitting,
  error,
  onSubmit,
  onGoToStep,
}: StepReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Review & Create</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review your bot settings before creating. You can edit these later.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Preview Card */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className={`${COLOR_CLASSES[accentColor].bg} p-4 text-white`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            <div>
              <h3 className="text-xl font-semibold">{title || 'Untitled Bot'}</h3>
              <p className="text-sm opacity-90">/bots/{slug || 'your-bot'}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white">
          <p className="text-gray-600 text-sm">{description || 'No description provided.'}</p>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Basic Information</h4>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{title || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">URL Slug</dt>
              <dd className="font-medium text-gray-900">{slug || '—'}</dd>
            </div>
          </dl>
        </div>

        {/* Personality */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Personality</h4>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-4">
              <div>
                <dt className="text-gray-500">Icon</dt>
                <dd className="text-2xl">{emoji}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Color</dt>
                <dd className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${COLOR_CLASSES[accentColor].bg}`} />
                  <span className="font-medium text-gray-900">{getColorLabel(accentColor)}</span>
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-gray-500 mb-1">System Prompt</dt>
              <dd className="font-mono text-xs bg-gray-50 p-2 rounded max-h-32 overflow-y-auto text-gray-700">
                {systemPrompt.substring(0, 500)}
                {systemPrompt.length > 500 && '...'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Knowledge */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Knowledge Base</h4>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {knowledgeChunks.length > 0 ? (
              <>
                <span className="font-medium text-gray-900">{knowledgeChunks.length}</span>{' '}
                knowledge chunk{knowledgeChunks.length !== 1 ? 's' : ''} added
              </>
            ) : (
              'No knowledge added (optional)'
            )}
          </p>
        </div>
      </div>

      {/* Create Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !title || !slug || !systemPrompt}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Bot...
            </>
          ) : (
            <>
              Create Bot
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Your bot will be created as a draft. You can publish it later.
        </p>
      </div>
    </div>
  );
}
