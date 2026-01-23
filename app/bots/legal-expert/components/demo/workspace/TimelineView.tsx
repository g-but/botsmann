import { type FC } from 'react';
import { type UploadedFile, type ChatMessage } from '../types';

interface TimelineViewProps {
  files: UploadedFile[];
  messages: ChatMessage[];
}

type TimelineItem = (ChatMessage & { itemType: 'message' }) | (UploadedFile & { itemType: 'file' });

export const TimelineView: FC<TimelineViewProps> = ({ files, messages }) => {
  // Combine and sort items by timestamp
  const timelineItems: TimelineItem[] = [
    ...messages.map((m) => ({ ...m, itemType: 'message' as const })),
    ...files.map((f) => ({
      ...f,
      itemType: 'file' as const,
      timestamp: f.timestamp || new Date(),
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp || Date.now()).getTime() -
        new Date(a.timestamp || Date.now()).getTime(),
    )
    .slice(0, 20);

  return (
    <div className="space-y-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white">📅 Activity Timeline</h2>
      <div className="space-y-3">
        {timelineItems.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-4 bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700"
          >
            <div className="text-2xl">{item.itemType === 'message' ? '💬' : '📄'}</div>
            <div className="flex-1">
              <p className="text-white font-medium">
                {item.itemType === 'message'
                  ? `Message from ${(item as ChatMessage).senderName}`
                  : `File uploaded: ${(item as UploadedFile).name}`}
              </p>
              <p className="text-sm text-slate-400">
                {new Date(item.timestamp || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
