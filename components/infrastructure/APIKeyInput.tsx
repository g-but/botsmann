'use client';

import { type FC, useState, useCallback } from 'react';
import {
  type AIProvider,
  type ConnectionStatus,
  getProviderColorClasses,
} from '@/lib/infrastructure';

interface APIKeyInputProps {
  provider: AIProvider;
  value: string;
  onChange: (value: string) => void;
  onValidate?: () => Promise<boolean>;
  status?: ConnectionStatus;
  errorMessage?: string;
}

/**
 * API key input component with validation
 * Used for provider configuration
 */
export const APIKeyInput: FC<APIKeyInputProps> = ({
  provider,
  value,
  onChange,
  onValidate,
  status,
  errorMessage,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const colors = getProviderColorClasses(provider.color);

  const isOllama = provider.id === 'ollama';
  const inputType = isOllama ? 'url' : showKey ? 'text' : 'password';
  const inputLabel = isOllama ? 'Ollama Server URL' : `${provider.name} API Key`;

  const handleValidate = useCallback(async () => {
    if (!onValidate || !value) return;
    setIsValidating(true);
    try {
      await onValidate();
    } finally {
      setIsValidating(false);
    }
  }, [onValidate, value]);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'validating':
        return (
          <svg className="w-5 h-5 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{inputLabel}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={provider.keyPlaceholder}
          className={`w-full px-4 py-3 pr-24 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
            status === 'error'
              ? 'border-red-300 focus:ring-red-500'
              : status === 'connected'
                ? 'border-green-300 focus:ring-green-500'
                : `border-gray-200 focus:${colors.ring}`
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Status indicator */}
          {status && getStatusIcon()}

          {/* Show/hide toggle for API keys (not for URLs) */}
          {!isOllama && value && (
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {status === 'error' && errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {/* Help text and validate button */}
      <div className="flex items-center justify-between">
        <a
          href={provider.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm ${colors.text} hover:underline`}
        >
          Get {isOllama ? 'Ollama' : 'API key'} →
        </a>

        {onValidate && value && status !== 'connected' && (
          <button
            type="button"
            onClick={handleValidate}
            disabled={isValidating}
            className={`text-sm font-medium ${colors.text} hover:underline disabled:opacity-50`}
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </button>
        )}
      </div>
    </div>
  );
};
