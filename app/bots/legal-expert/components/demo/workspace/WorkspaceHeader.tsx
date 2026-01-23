import { type FC } from 'react';
import { type LawyerProfile } from '../types';

interface WorkspaceHeaderProps {
  lawyer: LawyerProfile;
  onClose: () => void;
}

export const WorkspaceHeader: FC<WorkspaceHeaderProps> = ({ lawyer, onClose }) => {
  return (
    <header className="relative border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                L
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Lex Workspace</h1>
                <p className="text-xs text-slate-400">Private Data Room • End-to-End Encrypted</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Lawyer info */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
              <span className="text-2xl">{lawyer.avatar}</span>
              <div>
                <p className="text-sm font-medium text-white">{lawyer.username}</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Exit Workspace"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
