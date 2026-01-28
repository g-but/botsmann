'use client';

import type { DisclaimerContent } from '@/lib/config/bot-pages';

interface DisclaimerSectionProps {
  content: DisclaimerContent;
}

export function DisclaimerSection({ content }: DisclaimerSectionProps) {
  return (
    <div className="rounded-xl bg-amber-50 border border-amber-200 p-6">
      <div className="flex flex-col gap-4">
        {content.items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <p className="text-amber-800 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
