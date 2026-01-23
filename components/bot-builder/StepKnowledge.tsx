'use client';

/**
 * Step 3: Knowledge Base
 * - Add knowledge chunks
 * - Edit/remove chunks
 * - Optional step
 */

import { useState } from 'react';
import type { KnowledgeChunkDraft } from '@/lib/hooks/useBotBuilder';

interface StepKnowledgeProps {
  chunks: KnowledgeChunkDraft[];
  onAdd: (chunk: Omit<KnowledgeChunkDraft, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<Omit<KnowledgeChunkDraft, 'id'>>) => void;
}

interface ChunkFormData {
  topic: string;
  content: string;
  keywords: string;
}

const EMPTY_FORM: ChunkFormData = { topic: '', content: '', keywords: '' };

export function StepKnowledge({ chunks, onAdd, onRemove, onUpdate }: StepKnowledgeProps) {
  const [formData, setFormData] = useState<ChunkFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = () => {
    if (!formData.content.trim()) return;

    const chunk = {
      topic: formData.topic.trim(),
      content: formData.content.trim(),
      keywords: formData.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    };

    if (editingId) {
      onUpdate(editingId, chunk);
      setEditingId(null);
    } else {
      onAdd(chunk);
    }

    setFormData(EMPTY_FORM);
    setIsAdding(false);
  };

  const handleEdit = (chunk: KnowledgeChunkDraft) => {
    setFormData({
      topic: chunk.topic,
      content: chunk.content,
      keywords: chunk.keywords.join(', '),
    });
    setEditingId(chunk.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add information your bot should know. This is optional but helps your bot give more
          accurate, domain-specific answers.
        </p>
      </div>

      {/* Add/Edit Form */}
      {isAdding ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Compensation Policy, Interview Process"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter the knowledge content. This could be a policy, procedure, FAQ answer, or any information your bot should know..."
              rows={6}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              maxLength={10000}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.content.length}/10,000 characters
            </p>
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="compensation, salary, bonus (comma-separated)"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Comma-separated keywords for better search</p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.content.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? 'Update' : 'Add'} Knowledge
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Knowledge Chunk
        </button>
      )}

      {/* Knowledge List */}
      {chunks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Knowledge Chunks ({chunks.length})</h3>
          <div className="space-y-2">
            {chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {chunk.topic && (
                      <h4 className="text-sm font-medium text-gray-900 truncate">{chunk.topic}</h4>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{chunk.content}</p>
                    {chunk.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {chunk.keywords.slice(0, 5).map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                          >
                            {keyword}
                          </span>
                        ))}
                        {chunk.keywords.length > 5 && (
                          <span className="text-xs text-gray-400">
                            +{chunk.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(chunk)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(chunk.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {chunks.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm">No knowledge added yet</p>
          <p className="text-xs text-gray-400">
            This step is optional. You can add knowledge later.
          </p>
        </div>
      )}
    </div>
  );
}
