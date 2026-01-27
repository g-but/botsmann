'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/auth';
import { botToasts } from '@/lib/toast';
import { PageLoading, InlineLoading } from '@/components/shared/LoadingSpinner';
import type { CustomBotWithStats } from '@/types/custom-bot';

export default function MyBotsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [bots, setBots] = useState<CustomBotWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  // Load bots
  useEffect(() => {
    if (!user) return;

    const loadBots = async () => {
      try {
        const response = await fetch('/api/custom-bots');
        const data = await response.json();

        if (data.success) {
          setBots(data.data?.bots || []);
        }
      } catch {
        // Failed to load bots - showing empty state
      } finally {
        setLoading(false);
      }
    };

    loadBots();
  }, [user]);

  const handleDelete = async (botId: string) => {
    if (!confirm('Are you sure you want to delete this bot? This action cannot be undone.')) return;

    setDeleting(botId);
    try {
      const response = await fetch(`/api/custom-bots/${botId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBots((prev) => prev.filter((b) => b.id !== botId));
        botToasts.deleteSuccess();
      } else {
        const data = await response.json();
        botToasts.deleteError(data.error);
      }
    } catch {
      botToasts.deleteError();
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (bot: CustomBotWithStats) => {
    setToggling(bot.id);
    try {
      const response = await fetch(`/api/custom-bots/${bot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_published: !bot.is_published,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBots((prev) => prev.map((b) => (b.id === bot.id ? { ...b, ...data.data?.bot } : b)));
        if (!bot.is_published) {
          botToasts.publishSuccess();
        } else {
          botToasts.unpublishSuccess();
        }
      } else {
        const data = await response.json();
        botToasts.updateError(data.error);
      }
    } catch {
      botToasts.updateError();
    } finally {
      setToggling(null);
    }
  };

  if (authLoading || !user) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bots</h1>
            <p className="text-gray-600">Manage your custom AI assistants</p>
          </div>
          <Link
            href="/bots/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Bot
          </Link>
        </div>

        {/* Bots List */}
        {loading ? (
          <InlineLoading className="py-12" />
        ) : bots.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-4 block">🤖</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bots yet</h2>
            <p className="text-gray-500 mb-6">
              Create your first custom AI assistant to get started.
            </p>
            <Link
              href="/bots/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create your first bot
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                onDelete={() => handleDelete(bot.id)}
                onTogglePublish={() => handleTogglePublish(bot)}
                isDeleting={deleting === bot.id}
                isToggling={toggling === bot.id}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {bots.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{bots.length}</p>
                <p className="text-sm text-gray-500">Total Bots</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {bots.filter((b) => b.is_published).length}
                </p>
                <p className="text-sm text-gray-500">Published</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {bots.reduce((sum, b) => sum + (b.knowledge_count || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Knowledge Chunks</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BotCardProps {
  bot: CustomBotWithStats;
  onDelete: () => void;
  onTogglePublish: () => void;
  isDeleting: boolean;
  isToggling: boolean;
}

function BotCard({ bot, onDelete, onTogglePublish, isDeleting, isToggling }: BotCardProps) {
  const accentColors = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    indigo: 'border-l-indigo-500',
    red: 'border-l-red-500',
    amber: 'border-l-amber-500',
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${
        accentColors[bot.accent_color as keyof typeof accentColors] || 'border-l-blue-500'
      } p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{bot.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{bot.title}</h3>
              {bot.is_published ? (
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  Published
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  Draft
                </span>
              )}
              {bot.is_public && (
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                  Public
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">{bot.description || 'No description'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span>{bot.knowledge_count || 0} knowledge chunks</span>
              <span>•</span>
              <span>/{bot.slug}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View */}
          <Link
            href={`/bots/custom/${bot.slug}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View bot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Link>

          {/* Edit */}
          <Link
            href={`/bots/custom/${bot.slug}/edit`}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit bot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>

          {/* Toggle Publish */}
          <button
            onClick={onTogglePublish}
            disabled={isToggling}
            className={`p-2 rounded-lg transition-colors ${
              bot.is_published
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            } disabled:opacity-50`}
            title={bot.is_published ? 'Unpublish' : 'Publish'}
          >
            {isToggling ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete bot"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
