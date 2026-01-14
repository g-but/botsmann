'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/auth';

type ModelProvider = 'groq' | 'openai' | 'ollama';

interface UserSettings {
  preferred_model: ModelProvider;
  groq_api_key: string | null;
  openai_api_key: string | null;
  ollama_url: string | null;
}

const MODEL_OPTIONS: { id: ModelProvider; name: string; description: string; badge?: string }[] = [
  {
    id: 'groq',
    name: 'Groq (Llama 3.1)',
    description: 'Free tier with 14,400 requests/day. Fast inference, no cost.',
    badge: 'Free'
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4)',
    description: 'Premium quality. Bring your own API key.',
    badge: 'BYOK'
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    description: 'Run models on your own hardware. Maximum privacy.',
    badge: 'Local'
  }
];

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useRequireAuth();
  const [settings, setSettings] = useState<UserSettings>({
    preferred_model: 'groq',
    groq_api_key: null,
    openai_api_key: null,
    ollama_url: null
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Botsmann
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">Configure your AI model preferences</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Model Selection */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Model Provider</h2>
            <div className="space-y-3">
              {MODEL_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    settings.preferred_model === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={option.id}
                    checked={settings.preferred_model === option.id}
                    onChange={() => setSettings({ ...settings, preferred_model: option.id })}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{option.name}</span>
                      {option.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          option.badge === 'Free' ? 'bg-green-100 text-green-700' :
                          option.badge === 'BYOK' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>

            {/* Groq API Key */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Groq API Key
                <span className="text-gray-400 font-normal ml-2">(optional - we provide free access)</span>
              </label>
              <input
                type="password"
                value={settings.groq_api_key || ''}
                onChange={(e) => setSettings({ ...settings, groq_api_key: e.target.value || null })}
                placeholder="gsk_..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get a free key at{' '}
                <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  console.groq.com
                </a>
              </p>
            </div>

            {/* OpenAI API Key */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key
                <span className="text-gray-400 font-normal ml-2">(required for OpenAI)</span>
              </label>
              <input
                type="password"
                value={settings.openai_api_key || ''}
                onChange={(e) => setSettings({ ...settings, openai_api_key: e.target.value || null })}
                placeholder="sk-..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ollama URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ollama Server URL
                <span className="text-gray-400 font-normal ml-2">(required for local models)</span>
              </label>
              <input
                type="url"
                value={settings.ollama_url || ''}
                onChange={(e) => setSettings({ ...settings, ollama_url: e.target.value || null })}
                placeholder="http://localhost:11434"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Install Ollama from{' '}
                <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ollama.ai
                </a>
              </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}
          {saved && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg">
              Settings saved successfully!
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
