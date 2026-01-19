'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/auth';
import { UpdateProfileSchema, DISPLAY_NAME_MAX_LENGTH } from '@/lib/schemas/auth';
import { UserAvatar } from '@/components/shared/UserAvatar';

interface UserSettings {
  preferred_model: string;
  groq_api_key: string | null;
  openai_api_key: string | null;
  ollama_url: string | null;
}

export default function SettingsPage() {
  const {
    user,
    loading: authLoading,
    signOut,
    displayName,
    avatarUrl,
    updateProfile,
  } = useRequireAuth();
  const [settings, setSettings] = useState<UserSettings>({
    preferred_model: 'groq',
    groq_api_key: null,
    openai_api_key: null,
    ollama_url: null,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState('');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Initialize profile form when user data loads
  useEffect(() => {
    if (displayName) setProfileDisplayName(displayName);
    if (avatarUrl) setProfileAvatarUrl(avatarUrl);
  }, [displayName, avatarUrl]);

  // Load user settings
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
            // Show advanced if user has custom keys
            if (
              data.settings.groq_api_key ||
              data.settings.openai_api_key ||
              data.settings.ollama_url
            ) {
              setShowAdvanced(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };

    loadSettings();
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSaved(false);

    // Validate with Zod
    const result = UpdateProfileSchema.safeParse({
      display_name: profileDisplayName || undefined,
      avatar_url: profileAvatarUrl || null,
    });

    if (!result.success) {
      setProfileError(result.error.errors[0].message);
      return;
    }

    setProfileSaving(true);

    const { error } = await updateProfile({
      display_name: profileDisplayName || undefined,
      avatar_url: profileAvatarUrl || null,
    });

    if (error) {
      setProfileError(error.message);
    } else {
      setProfileSaved(true);
      setIsEditingProfile(false);
      setTimeout(() => setProfileSaved(false), 3000);
    }

    setProfileSaving(false);
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileDisplayName(displayName || '');
    setProfileAvatarUrl(avatarUrl || '');
    setProfileError('');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {profileSaved && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
              Profile updated successfully!
            </div>
          )}

          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {profileError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{profileError}</div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {profileAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileAvatarUrl}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <UserAvatar email={user.email} initial={profileDisplayName?.[0]} size="lg" />
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={profileDisplayName}
                      onChange={(e) => setProfileDisplayName(e.target.value)}
                      maxLength={DISPLAY_NAME_MAX_LENGTH}
                      placeholder="Your name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {profileDisplayName.length}/{DISPLAY_NAME_MAX_LENGTH} characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="avatarUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Avatar URL
                    </label>
                    <input
                      id="avatarUrl"
                      type="url"
                      value={profileAvatarUrl}
                      onChange={(e) => setProfileAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a URL to an image (PNG, JPG, or GIF)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelProfileEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <UserAvatar
                email={user.email}
                initial={displayName?.[0]}
                avatarUrl={avatarUrl}
                size="lg"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {displayName || <span className="text-gray-400 italic">No display name set</span>}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* AI Status Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h2>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">AI is ready to use</p>
              <p className="text-sm text-gray-600 mt-1">
                Your documents are analyzed using AI. Upload documents and start chatting to get
                insights.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/documents"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Go to My Documents
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Advanced Section (Collapsed) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Advanced Settings</h2>
              <p className="text-sm text-gray-500">
                For developers who want to use their own AI provider
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showAdvanced && (
            <form onSubmit={handleSubmit} className="px-6 pb-6 border-t border-gray-100">
              <div className="py-4 mb-4 bg-amber-50 -mx-6 px-6 border-b border-amber-100">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> These settings are optional. Botsmann works out of the box
                  without any configuration.
                </p>
              </div>

              {/* Groq API Key */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Groq API Key</label>
                <p className="text-xs text-gray-500 mb-2">
                  Leave empty to use Botsmann&apos;s free AI service
                </p>
                <input
                  type="password"
                  value={settings.groq_api_key || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, groq_api_key: e.target.value || null })
                  }
                  placeholder="gsk_..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* OpenAI API Key */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAI API Key
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  For GPT-4 access (requires OpenAI account with billing)
                </p>
                <input
                  type="password"
                  value={settings.openai_api_key || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, openai_api_key: e.target.value || null })
                  }
                  placeholder="sk-..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Ollama URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local AI Server (Ollama)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Run AI on your own computer for maximum privacy
                </p>
                <input
                  type="url"
                  value={settings.ollama_url || ''}
                  onChange={(e) => setSettings({ ...settings, ollama_url: e.target.value || null })}
                  placeholder="http://localhost:11434"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error/Success Messages */}
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}
              {saved && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">
                  Settings saved!
                </div>
              )}

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Advanced Settings'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
