'use client';

import React from 'react';
import { UploadedFile } from '../../types';
import { formatFileSize, CategoryWithFiles } from '../utils';

interface FilesViewProps {
  categoriesWithFiles: CategoryWithFiles[];
  selectedFile: string | null;
  setSelectedFile: (fileId: string | null) => void;
  onFileDelete: (fileId: string) => void;
  onFileVisibilityChange: (fileId: string, visibility: string) => void;
}

export const FilesView: React.FC<FilesViewProps> = ({
  categoriesWithFiles,
  selectedFile,
  setSelectedFile,
  onFileDelete,
  onFileVisibilityChange
}) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">File Management</h2>
      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
        + Upload Files
      </button>
    </div>

    {categoriesWithFiles.map((category) => (
      <div key={category.id} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="text-lg font-bold text-white">{category.title}</h3>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                {category.count} files
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {category.files.map((file: UploadedFile) => (
            <div
              key={file.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                selectedFile === file.id
                  ? 'bg-blue-600/20 border-blue-500'
                  : 'bg-slate-900/30 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-3xl">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                  <select
                    value={file.visibility || 'private'}
                    onChange={(e) => onFileVisibilityChange(file.id, e.target.value)}
                    className="text-xs bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                  >
                    <option value="private">Private</option>
                    <option value="lawyer">Lawyer Only</option>
                    <option value="team">Team</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFile(file.id)}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                  aria-label="View file"
                >
                  👁️
                </button>
                <button
                  onClick={() => onFileDelete(file.id)}
                  className="p-2 hover:bg-red-600/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                  aria-label="Delete file"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
