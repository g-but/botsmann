'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRequireAuth } from '@/lib/auth';
import { UserAvatar } from '@/components/shared/UserAvatar';

interface CustomBot {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  emoji: string;
  accent_color: string;
  is_public: boolean;
  is_published: boolean;
  knowledge_count: number;
  created_at: string;
  updated_at: string;
}

interface ProfileStats {
  documentsCount: number;
  botsCount: number;
  publishedBotsCount: number;
}

export default function ProfilePage() {
  const { user, loading: authLoading, displayName, avatarUrl } = useRequireAuth();
  const [bots, setBots] = useState<CustomBot[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    documentsCount: 0,
    botsCount: 0,
    publishedBotsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load profile data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [docsResponse, botsResponse] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/custom-bots'),
        ]);

        const docsData = await docsResponse.json();
        const botsData = await botsResponse.json();

        if (docsData.success) {
          setStats((prev) => ({
            ...prev,
            documentsCount: docsData.documents?.length || 0,
          }));
        }

        if (botsData.success) {
          const botsList: CustomBot[] = botsData.bots || [];
          setBots(botsList);
          setStats((prev) => ({
            ...prev,
            botsCount: botsList.length,
            publishedBotsCount: botsList.filter((b) => b.is_published).length,
          }));
        }
      } catch (err) {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const publishedBots = bots.filter((b) => b.is_published);
  const draftBots = bots.filter((b) => !b.is_published);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <UserAvatar
              email={user.email}
              initial={displayName?.[0]}
              avatarUrl={avatarUrl}
              size="xl"
            />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {displayName || 'Anonymous User'}
              </h1>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-400 mt-1">
                Member since {formatDate(user.created_at)}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.documentsCount}</p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.botsCount}</p>
                  <p className="text-xs text-gray-500">Bots</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.publishedBotsCount}</p>
                  <p className="text-xs text-gray-500">Published</p>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Published Bots */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Published Bots</h2>
            <Link
              href="/bots/create"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Create new
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : publishedBots.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-5xl">🤖</span>
              <p className="text-gray-500 mt-4">No published bots yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create and publish bots to share them with others
              </p>
              <Link
                href="/bots/create"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Create Your First Bot
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {publishedBots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))}
            </div>
          )}
        </div>

        {/* Draft Bots */}
        {draftBots.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Drafts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {draftBots.map((bot) => (
                <BotCard key={bot.id} bot={bot} isDraft />
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickLink
              href="/dashboard"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              }
              label="Dashboard"
            />
            <QuickLink
              href="/documents"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              label="Documents"
            />
            <QuickLink
              href="/infrastructure"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              label="AI Settings"
            />
            <QuickLink
              href="/settings"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
              label="Settings"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BotCard({ bot, isDraft }: { bot: CustomBot; isDraft?: boolean }) {
  const accentColors: Record<string, string> = {
    blue: 'border-blue-200 hover:border-blue-300',
    green: 'border-green-200 hover:border-green-300',
    purple: 'border-purple-200 hover:border-purple-300',
    orange: 'border-orange-200 hover:border-orange-300',
    red: 'border-red-200 hover:border-red-300',
    yellow: 'border-yellow-200 hover:border-yellow-300',
  };

  const borderColor = accentColors[bot.accent_color] || accentColors.blue;

  return (
    <Link
      href={`/bots/custom/${bot.slug}`}
      className={`block p-4 border-2 rounded-xl transition-all hover:shadow-md ${borderColor}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">{bot.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{bot.title}</h3>
            {isDraft && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                Draft
              </span>
            )}
          </div>
          {bot.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{bot.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">{bot.knowledge_count} knowledge chunks</p>
        </div>
      </div>
    </Link>
  );
}

function QuickLink({ href, icon, label }: { href: Route; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <div className="text-gray-600">{icon}</div>
      <p className="text-sm font-medium text-gray-700 mt-2">{label}</p>
    </Link>
  );
}
