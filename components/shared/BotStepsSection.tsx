'use client';

import { type FC } from 'react';
import type { BotAccentColor } from '@/types/bot';

/**
 * Step configuration for the steps section
 */
export interface BotStep {
  /** Step number (1-based) */
  step: string;
  /** Emoji or icon for the step */
  icon: string;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
}

interface BotStepsSectionProps {
  /** Section title */
  title: string;
  /** Array of steps */
  steps: BotStep[];
  /** Accent color for styling */
  accentColor: BotAccentColor;
  /** Number of columns in the grid */
  columns?: 3 | 4;
  /** Optional background gradient style */
  variant?: 'card' | 'gradient-bg';
}

// Color scheme mappings for steps
const stepColorSchemes: Record<
  BotAccentColor,
  {
    numberBg: string;
    bgGradient: string;
    connector: string;
  }
> = {
  blue: {
    numberBg: 'bg-gradient-to-br from-blue-600 to-cyan-600',
    bgGradient: 'from-slate-50 to-blue-50',
    connector: 'from-blue-400 to-cyan-400',
  },
  green: {
    numberBg: 'bg-gradient-to-br from-green-600 to-emerald-600',
    bgGradient: 'from-slate-50 to-green-50',
    connector: 'from-green-400 to-emerald-400',
  },
  indigo: {
    numberBg: 'bg-gradient-to-br from-indigo-600 to-purple-600',
    bgGradient: 'from-slate-50 to-indigo-50',
    connector: 'from-indigo-400 to-purple-400',
  },
  red: {
    numberBg: 'bg-gradient-to-br from-red-600 to-rose-600',
    bgGradient: 'from-slate-50 to-red-50',
    connector: 'from-red-400 to-rose-400',
  },
  amber: {
    numberBg: 'bg-gradient-to-br from-amber-600 to-orange-600',
    bgGradient: 'from-slate-50 to-amber-50',
    connector: 'from-amber-400 to-orange-400',
  },
};

/**
 * Shared Steps/How It Works section for bot pages
 *
 * @example
 * ```tsx
 * <BotStepsSection
 *   title="How Lex Works"
 *   steps={[
 *     { step: '1', icon: '📝', title: 'Describe Your Case', description: '...' },
 *     { step: '2', icon: '🤝', title: 'Match with Lawyer', description: '...' },
 *   ]}
 *   accentColor="blue"
 *   columns={4}
 *   variant="gradient-bg"
 * />
 * ```
 */
export const BotStepsSection: FC<BotStepsSectionProps> = ({
  title,
  steps,
  accentColor,
  columns = 4,
  variant = 'card',
}) => {
  const colors = stepColorSchemes[accentColor];
  const gridCols = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  if (variant === 'gradient-bg') {
    return (
      <div
        className={`bg-gradient-to-r ${colors.bgGradient} rounded-2xl p-8 lg:p-12 border border-gray-200`}
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h3>
        <div className={`grid ${gridCols} gap-6`}>
          {steps.map((item, idx) => (
            <div key={item.step} className="relative">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full ${colors.numberBg} text-white font-bold flex items-center justify-center text-lg`}
                  >
                    {item.step}
                  </div>
                  <div className="text-2xl sm:text-3xl">{item.icon}</div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r ${colors.connector}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Card variant (simpler)
  return (
    <div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h3>
      <div className={`grid ${gridCols} gap-6`}>
        {steps.map((item) => (
          <div key={item.step} className="text-center">
            <div
              className={`w-16 h-16 ${colors.numberBg} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}
            >
              {item.step}
            </div>
            <div className="text-3xl mb-3">{item.icon}</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
