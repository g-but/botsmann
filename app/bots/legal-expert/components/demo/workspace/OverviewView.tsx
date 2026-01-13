import { type FC } from 'react';
import { type UploadedFile, type CategoryWithFiles, type WorkspaceViewMode } from '../types';

interface OverviewViewProps {
  files: UploadedFile[];
  categoriesWithFiles: CategoryWithFiles[];
  caseDescription: string;
  setViewMode: (mode: WorkspaceViewMode) => void;
}

const QUICK_ACTIONS = [
  { icon: '📁', title: 'Files', color: 'from-blue-500 to-cyan-500', view: 'files' as const },
  { icon: '💬', title: 'Chat', color: 'from-purple-500 to-pink-500', view: 'chat' as const },
  {
    icon: '📅',
    title: 'Timeline',
    color: 'from-green-500 to-emerald-500',
    view: 'timeline' as const,
  },
  {
    icon: '⚙️',
    title: 'Settings',
    color: 'from-orange-500 to-red-500',
    view: 'settings' as const,
  },
] as const;

export const OverviewView: FC<OverviewViewProps> = ({
  files,
  categoriesWithFiles,
  caseDescription,
  setViewMode,
}) => {
  const getActionCount = (view: WorkspaceViewMode): string | number => {
    switch (view) {
      case 'files':
        return files.length;
      case 'chat':
        return '24/7';
      case 'timeline':
        return 'Live';
      case 'settings':
        return 'Manage';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Data Room 🚀</h2>
        <p className="text-blue-100">
          Your secure collaborative workspace is ready. All files are encrypted end-to-end.
        </p>
      </div>

      {/* Case summary */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-3">📋 Case Summary</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{caseDescription}</p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.title}
            onClick={() => setViewMode(action.view)}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105 group"
          >
            <div
              className={`text-4xl mb-3 bg-gradient-to-br ${action.color} bg-clip-text text-transparent`}
            >
              {action.icon}
            </div>
            <h4 className="text-white font-bold mb-1">{action.title}</h4>
            <p className="text-slate-400 text-sm">{getActionCount(action.view)}</p>
          </button>
        ))}
      </div>

      {/* File categories preview */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">📂 File Categories</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categoriesWithFiles.map((cat) => (
            <div key={cat.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  {cat.count}
                </span>
              </div>
              <p className="text-sm text-white font-medium">{cat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
