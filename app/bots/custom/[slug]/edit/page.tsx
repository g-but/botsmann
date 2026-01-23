'use client';

/**
 * Edit Custom Bot Page
 *
 * Allow editing an existing custom bot
 */

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/auth';
import { botToasts } from '@/lib/toast';
import type { CustomBot } from '@/types/custom-bot';

const ACCENT_COLORS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
];

export default function EditBotPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, loading: authLoading } = useRequireAuth();

  const [bot, setBot] = useState<CustomBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [accentColor, setAccentColor] = useState('blue');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  // Fetch bot data
  useEffect(() => {
    if (!user) return;

    async function fetchBot() {
      try {
        const response = await fetch(`/api/custom-bots/slug/${slug}`);
        const data = await response.json();

        if (data.success && data.data?.bot) {
          const botData = data.data.bot;
          setBot(botData);
          setTitle(botData.title || '');
          setDescription(botData.description || '');
          setEmoji(botData.emoji || '');
          setAccentColor(botData.accent_color || 'blue');
          setSystemPrompt(botData.system_prompt || '');
          setGreeting(botData.greeting || '');
          setIsPublished(botData.is_published || false);
          setIsPublic(botData.is_public || false);
        } else {
          setError(data.error || 'Bot not found');
        }
      } catch {
        setError('Failed to load bot');
      } finally {
        setLoading(false);
      }
    }

    fetchBot();
  }, [slug, user]);

  const handleSave = async () => {
    if (!bot) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/custom-bots/${bot.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          emoji,
          accent_color: accentColor,
          system_prompt: systemPrompt,
          greeting,
          is_published: isPublished,
          is_public: isPublic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        botToasts.updateSuccess();
        router.push('/bots/mine');
      } else {
        setError(data.error || 'Failed to save');
        botToasts.updateError(data.error);
      }
    } catch {
      setError('Failed to save bot');
      botToasts.updateError();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error && !bot) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/bots/mine" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to My Bots
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Bot</h1>
            <p className="text-gray-600">Update your custom AI assistant</p>
          </div>
          <Link href="/bots/mine" className="text-gray-500 hover:text-gray-700">
            Cancel
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="My Awesome Bot"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="A brief description of what your bot does"
            />
          </div>

          {/* Emoji & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl text-center"
                placeholder="🤖"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setAccentColor(color.value)}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      accentColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="You are a helpful assistant that..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Define your bot&apos;s personality and behavior
            </p>
          </div>

          {/* Greeting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Greeting Message</label>
            <textarea
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Hello! How can I help you today?"
            />
          </div>

          {/* Visibility Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Published (visible at your bot&apos;s URL)
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Public (listed in bot directory)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              href="/bots/mine"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
