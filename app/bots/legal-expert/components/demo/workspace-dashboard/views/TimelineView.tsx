'use client';

import React from 'react';
import { UploadedFile } from '../../types';
import { Message } from '../utils';

interface TimelineViewProps {
  files: UploadedFile[];
  messages: Message[];
}

interface TimelineItem {
  id?: string;
  name?: string;
  content?: string;
  senderName?: string;
  timestamp?: Date;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ files, messages }) => {
  const items: TimelineItem[] = [...messages, ...files].sort((a, b) =>
    new Date((b as TimelineItem).timestamp || Date.now()).getTime() -
    new Date((a as TimelineItem).timestamp || Date.now()).getTime()
  ).slice(0, 20);

  return (
    <div className="space-y-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white">Activity Timeline</h2>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isMessage = 'content' in item;
          return (
            <div key={idx} className="flex gap-4 bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700">
              <div className="text-2xl">{isMessage ? '💬' : '📄'}</div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  {isMessage ? `Message from ${item.senderName}` : `File uploaded: ${item.name}`}
                </p>
                <p className="text-sm text-slate-400">
                  {new Date(item.timestamp || Date.now()).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
