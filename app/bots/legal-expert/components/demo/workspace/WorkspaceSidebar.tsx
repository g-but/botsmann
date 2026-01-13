import { type FC } from 'react';
import { type UploadedFile, type ChatMessage, type WorkspaceViewMode } from '../types';
import { formatTotalSize } from './workspaceUtils';

interface WorkspaceSidebarProps {
  viewMode: WorkspaceViewMode;
  setViewMode: (mode: WorkspaceViewMode) => void;
  files: UploadedFile[];
  messages: ChatMessage[];
}

const NAV_ITEMS: { id: WorkspaceViewMode; icon: string; label: string; hasBadge?: boolean }[] = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'files', icon: '📁', label: 'Files', hasBadge: true },
  { id: 'chat', icon: '💬', label: 'Chat', hasBadge: true },
  { id: 'timeline', icon: '📅', label: 'Timeline' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export const WorkspaceSidebar: FC<WorkspaceSidebarProps> = ({
  viewMode,
  setViewMode,
  files,
  messages,
}) => {
  const getBadgeCount = (id: WorkspaceViewMode): number | undefined => {
    if (id === 'files') return files.length;
    if (id === 'chat') return messages.length;
    return undefined;
  };

  return (
    <aside className="w-20 lg:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700 flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const badge = item.hasBadge ? getBadgeCount(item.id) : undefined;
          return (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                viewMode === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden lg:block font-medium">{item.label}</span>
              {badge !== undefined && (
                <span className="hidden lg:block ml-auto bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="hidden lg:block p-4 border-t border-slate-700">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Files</span>
            <span className="text-white font-bold">{files.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Messages</span>
            <span className="text-white font-bold">{messages.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Storage</span>
            <span className="text-white font-bold">{formatTotalSize(files)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
