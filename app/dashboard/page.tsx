'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRequireAuth } from '@/lib/auth';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { PageLoading, InlineLoading } from '@/components/shared/LoadingSpinner';
import { OnboardingChecklist } from '@/components/onboarding';
import { DashboardEmptyState } from '@/components/dashboard';
import type { Document } from '@/types/document';
import type { UsageStats } from '@/types/conversation';

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

interface DashboardStats {
  documentsTotal: number;
  documentsReady: number;
  documentsPending: number;
  botsTotal: number;
  botsPublished: number;
  conversationsTotal: number;
  messagesTotal: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading, displayName, avatarUrl } = useRequireAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [bots, setBots] = useState<CustomBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    documentsTotal: 0,
    documentsReady: 0,
    documentsPending: 0,
    botsTotal: 0,
    botsPublished: 0,
    conversationsTotal: 0,
    messagesTotal: 0,
  });

  // Load dashboard data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [docsResponse, botsResponse, statsResponse] = await Promise.all([
          fetch('/api/documents'),
          fetch('/api/custom-bots'),
          fetch('/api/stats'),
        ]);

        const docsData = await docsResponse.json();
        const botsData = await botsResponse.json();
        const statsData = await statsResponse.json();

        if (docsData.success) {
          const docs = docsData.documents || [];
          setDocuments(docs);
          setStats((prev) => ({
            ...prev,
            documentsTotal: docs.length,
            documentsReady: docs.filter((d: Document) => d.status === 'ready').length,
            documentsPending: docs.filter((d: Document) => d.status === 'pending').length,
          }));
        }

        if (botsData.success) {
          const botsList = botsData.data?.bots || botsData.bots || [];
          setBots(botsList);
          setStats((prev) => ({
            ...prev,
            botsTotal: botsList.length,
            botsPublished: botsList.filter((b: CustomBot) => b.is_published).length,
          }));
        }

        if (statsData.success && statsData.data?.stats) {
          const apiStats: UsageStats = statsData.data.stats;
          setStats((prev) => ({
            ...prev,
            conversationsTotal: apiStats.total_conversations,
            messagesTotal: apiStats.total_messages,
          }));
        }
      } catch {
        // Silently handle errors - dashboard will show zeros
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (authLoading || !user) {
    return <PageLoading />;
  }

  const recentDocuments = documents.slice(0, 3);
  const recentBots = bots.slice(0, 3);

  // Check if user is in "empty" state (no meaningful data yet)
  const isEmptyState =
    !loading &&
    stats.documentsTotal === 0 &&
    stats.conversationsTotal === 0 &&
    stats.botsTotal === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <UserAvatar
              email={user.email}
              initial={displayName?.[0]}
              avatarUrl={avatarUrl}
              size="lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEmptyState
                  ? `Welcome${displayName ? `, ${displayName}` : ''}!`
                  : `Welcome back${displayName ? `, ${displayName}` : ''}`}
              </h1>
              <p className="text-gray-600">
                {isEmptyState
                  ? 'Your AI workspace is ready. Let\u2019s get started!'
                  : 'Here\u2019s what\u2019s happening with your AI workspace'}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State - shown when user has no data */}
        {isEmptyState ? (
          <DashboardEmptyState displayName={displayName} />
        ) : (
          <>
            {/* Onboarding Checklist - only shown when user has started but not finished */}
            <div className="mb-8">
              <OnboardingChecklist
                documentsCount={stats.documentsTotal}
                readyDocumentsCount={stats.documentsReady}
                conversationsCount={stats.conversationsTotal}
                botsCount={stats.botsTotal}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Documents"
                value={stats.documentsTotal}
                subtext={`${stats.documentsReady} ready`}
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
                color="blue"
                loading={loading}
              />
              <StatCard
                label="Conversations"
                value={stats.conversationsTotal}
                subtext={`${stats.messagesTotal} messages`}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                }
                color="green"
                loading={loading}
              />
              <StatCard
                label="Custom Bots"
                value={stats.botsTotal}
                subtext={`${stats.botsPublished} published`}
                icon={<span className="text-lg">🤖</span>}
                color="purple"
                loading={loading}
              />
              <StatCard
                label="Pending"
                value={stats.documentsPending}
                subtext="need processing"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                color="yellow"
                loading={loading}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <QuickActionCard
                  href="/documents"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                  label="Upload Document"
                  color="blue"
                />
                <QuickActionCard
                  href="/bots/create"
                  icon={<span className="text-2xl">🤖</span>}
                  label="Create Bot"
                  color="purple"
                />
                <QuickActionCard
                  href="/documents"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  }
                  label="Chat with Docs"
                  color="green"
                />
                <QuickActionCard
                  href="/bots/mine"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  }
                  label="My Bots"
                  color="indigo"
                />
                <QuickActionCard
                  href="/infrastructure"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  color="orange"
                />
              </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Documents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
                  <Link
                    href="/documents"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>

                {loading ? (
                  <InlineLoading />
                ) : recentDocuments.length === 0 ? (
                  <EmptyState
                    icon={
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    }
                    message="No documents yet"
                    action={
                      <Link
                        href="/documents"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Upload your first document
                      </Link>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {recentDocuments.map((doc) => (
                      <DocumentRow key={doc.id} document={doc} />
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Bots */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Your Custom Bots</h2>
                  <Link
                    href="/bots/mine"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Manage bots
                  </Link>
                </div>

                {loading ? (
                  <InlineLoading />
                ) : recentBots.length === 0 ? (
                  <EmptyState
                    icon={<span className="text-5xl">🤖</span>}
                    message="No custom bots yet"
                    action={
                      <Link
                        href="/bots/create"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Create your first bot
                      </Link>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {recentBots.map((bot) => (
                      <BotRow key={bot.id} bot={bot} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Sub-components

interface StatCardProps {
  label: string;
  value: number;
  subtext: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'indigo';
  loading?: boolean;
}

function StatCard({ label, value, subtext, icon, color, loading }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {loading ? (
            <div className="h-7 w-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
          <p className="text-xs text-gray-400">{subtext}</p>
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  href: Route;
  icon: React.ReactNode;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
}

function QuickActionCard({ href, icon, label, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'hover:bg-blue-50 hover:border-blue-200',
    green: 'hover:bg-green-50 hover:border-green-200',
    purple: 'hover:bg-purple-50 hover:border-purple-200',
    orange: 'hover:bg-orange-50 hover:border-orange-200',
    indigo: 'hover:bg-indigo-50 hover:border-indigo-200',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
  };

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl transition-colors ${colorClasses[color]}`}
    >
      <div className={iconColorClasses[color]}>{icon}</div>
      <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
    </Link>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto mb-4">{icon}</div>
      <p className="text-gray-500">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

function DocumentRow({ document }: { document: Document }) {
  const statusBadge = {
    pending: (
      <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
        Pending
      </span>
    ),
    processing: (
      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Processing</span>
    ),
    ready: (
      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Ready</span>
    ),
    error: <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">Error</span>,
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{document.name}</p>
          <p className="text-xs text-gray-400">{formatSize(document.size_bytes || 0)}</p>
        </div>
      </div>
      {statusBadge[document.status]}
    </div>
  );
}

function BotRow({ bot }: { bot: CustomBot }) {
  return (
    <Link
      href={`/bots/custom/${bot.slug}`}
      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl flex-shrink-0">{bot.emoji}</span>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{bot.title}</p>
          <p className="text-xs text-gray-400">{bot.knowledge_count} knowledge chunks</p>
        </div>
      </div>
      {bot.is_published ? (
        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
          Published
        </span>
      ) : (
        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">Draft</span>
      )}
    </Link>
  );
}
