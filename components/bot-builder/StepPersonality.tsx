'use client';

/**
 * Step 2: Personality & Behavior
 * - Emoji selection
 * - Accent color
 * - System prompt
 */

import type { BotAccentColor } from '@/types/bot';

interface StepPersonalityProps {
  emoji: string;
  accentColor: BotAccentColor;
  systemPrompt: string;
  onChange: (data: { emoji?: string; accentColor?: BotAccentColor; systemPrompt?: string }) => void;
  errors: string[];
}

const EMOJI_OPTIONS = ['🤖', '👔', '⚖️', '🏥', '📊', '💼', '🎯', '🧠', '📚', '🔬', '💡', '🛡️'];

const COLOR_OPTIONS: { value: BotAccentColor; label: string; classes: string }[] = [
  { value: 'blue', label: 'Blue', classes: 'bg-blue-500' },
  { value: 'green', label: 'Green', classes: 'bg-green-500' },
  { value: 'indigo', label: 'Indigo', classes: 'bg-indigo-500' },
  { value: 'red', label: 'Red', classes: 'bg-red-500' },
  { value: 'amber', label: 'Amber', classes: 'bg-amber-500' },
];

const PROMPT_TEMPLATES = [
  {
    label: 'HR Executive',
    prompt: `You are a senior HR executive with 20+ years of experience in human resources leadership. Your expertise includes:

- Executive compensation and equity planning
- Organizational design and restructuring
- Talent acquisition strategy for senior roles
- Performance management frameworks
- Employment law compliance (multi-jurisdiction)
- Employee relations and conflict resolution
- HR technology and HRIS implementation
- Diversity, equity, and inclusion initiatives

Guidelines:
- Provide strategic, executive-level advice
- Consider legal implications in your recommendations
- Balance business needs with employee wellbeing
- Reference industry best practices when relevant
- Ask clarifying questions before making recommendations`,
  },
  {
    label: 'Legal Advisor',
    prompt: `You are an experienced legal advisor specializing in corporate and business law. Your areas of expertise include:

- Contract drafting and review
- Corporate governance
- Intellectual property basics
- Employment law fundamentals
- Regulatory compliance
- Risk assessment

Guidelines:
- Always clarify that you provide general legal information, not specific legal advice
- Recommend consulting a licensed attorney for specific situations
- Explain legal concepts in accessible language
- Consider jurisdiction-specific variations
- Highlight potential risks and mitigation strategies`,
  },
  {
    label: 'Technical Expert',
    prompt: `You are a senior technical expert with deep knowledge in software engineering and architecture. Your expertise covers:

- System design and architecture patterns
- Code review and best practices
- Performance optimization
- Security considerations
- DevOps and CI/CD pipelines
- Database design and optimization
- API design principles

Guidelines:
- Provide practical, actionable technical advice
- Consider trade-offs in your recommendations
- Reference industry standards and best practices
- Ask about constraints before suggesting solutions
- Explain the reasoning behind recommendations`,
  },
];

export function StepPersonality({
  emoji,
  accentColor,
  systemPrompt,
  onChange,
  errors,
}: StepPersonalityProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Personality & Behavior</h2>
        <p className="mt-1 text-sm text-gray-500">
          Define how your bot looks and behaves. The system prompt shapes its expertise and
          communication style.
        </p>
      </div>

      {/* Error display */}
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <ul className="list-disc list-inside text-sm text-red-700">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Emoji Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bot Icon</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onChange({ emoji: e })}
              className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                emoji === e
                  ? 'border-blue-500 bg-blue-50 scale-110'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {e}
            </button>
          ))}
          <input
            type="text"
            value={EMOJI_OPTIONS.includes(emoji) ? '' : emoji}
            onChange={(e) => {
              const val = e.target.value;
              if (val) onChange({ emoji: val.slice(-2) }); // Take last emoji if multiple
            }}
            placeholder="Or type..."
            className="w-24 h-12 text-center text-2xl rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            maxLength={4}
          />
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
        <div className="flex gap-3">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => onChange({ accentColor: color.value })}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                accentColor === color.value
                  ? 'ring-2 ring-offset-2 ring-blue-500 bg-gray-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className={`w-8 h-8 rounded-full ${color.classes}`} />
              <span className="text-xs text-gray-600">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Prompt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">
            System Prompt <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {PROMPT_TEMPLATES.map((template) => (
              <button
                key={template.label}
                type="button"
                onClick={() => onChange({ systemPrompt: template.prompt })}
                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => onChange({ systemPrompt: e.target.value })}
          placeholder="Define your bot's expertise, personality, and guidelines for how it should respond..."
          rows={12}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
          maxLength={10000}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Minimum 50 characters required</span>
          <span>{systemPrompt.length}/10,000</span>
        </div>
      </div>
    </div>
  );
}
