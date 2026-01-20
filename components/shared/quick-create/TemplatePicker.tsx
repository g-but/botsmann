'use client';

import { type FC, useState } from 'react';
import {
  templatesByCategory,
  categoryLabels,
  type TemplateCategory,
  type BotTemplate,
} from '@/lib/bot-templates';

interface TemplatePickerProps {
  onSelect: (templateId: string) => void;
}

interface TemplateCategoryOrder {
  category: TemplateCategory;
  order: number;
}

const categoryOrder: TemplateCategoryOrder[] = [
  { category: 'memorial', order: 1 },
  { category: 'legends', order: 2 },
  { category: 'gods', order: 3 },
  { category: 'magical', order: 4 },
  { category: 'helpers', order: 5 },
];

const accentColorClasses: Record<string, string> = {
  blue: 'hover:border-blue-400 hover:bg-blue-50',
  pink: 'hover:border-pink-400 hover:bg-pink-50',
  rose: 'hover:border-rose-400 hover:bg-rose-50',
  slate: 'hover:border-slate-400 hover:bg-slate-50',
  amber: 'hover:border-amber-400 hover:bg-amber-50',
  green: 'hover:border-green-400 hover:bg-green-50',
  indigo: 'hover:border-indigo-400 hover:bg-indigo-50',
  purple: 'hover:border-purple-400 hover:bg-purple-50',
  red: 'hover:border-red-400 hover:bg-red-50',
  orange: 'hover:border-orange-400 hover:bg-orange-50',
  yellow: 'hover:border-yellow-400 hover:bg-yellow-50',
  sky: 'hover:border-sky-400 hover:bg-sky-50',
  stone: 'hover:border-stone-400 hover:bg-stone-50',
  teal: 'hover:border-teal-400 hover:bg-teal-50',
  cyan: 'hover:border-cyan-400 hover:bg-cyan-50',
  violet: 'hover:border-violet-400 hover:bg-violet-50',
};

interface TemplateCardProps {
  template: BotTemplate;
  onClick: () => void;
}

const TemplateCard: FC<TemplateCardProps> = ({ template, onClick }) => {
  const hoverClass = accentColorClasses[template.accentColor] || accentColorClasses.blue;

  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-xl p-4 border-2 border-gray-100 transition-all duration-200 ${hoverClass} hover:shadow-lg hover:scale-105`}
    >
      <div className="flex flex-col items-center text-center">
        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
          {template.emoji}
        </span>
        <span className="font-medium text-gray-900 text-sm">{template.shortName}</span>
      </div>
    </button>
  );
};

export const TemplatePicker: FC<TemplatePickerProps> = ({ onSelect }) => {
  const [expandedCategory, setExpandedCategory] = useState<TemplateCategory | null>(null);

  const toggleCategory = (category: TemplateCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Who Do You Want to Create?
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pick a template and start chatting in under 60 seconds
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-10">
        {categoryOrder.map(({ category }) => {
          const templates = templatesByCategory[category];
          const label = categoryLabels[category];
          const isExpanded = expandedCategory === category;
          const displayTemplates = isExpanded ? templates : templates.slice(0, 8);

          return (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{label.title}</h2>
                  <p className="text-sm text-gray-500">{label.description}</p>
                </div>
                {templates.length > 8 && (
                  <button
                    onClick={() => toggleCategory(category)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    {isExpanded ? 'Show Less' : `Show All (${templates.length})`}
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {displayTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => onSelect(template.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Start from Scratch */}
      <div className="text-center pt-8 border-t border-gray-200">
        <button
          onClick={() => onSelect('custom')}
          className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          <span className="text-2xl">🎭</span>
          <span>Start From Scratch - Build Something Unique</span>
        </button>
      </div>
    </div>
  );
};
