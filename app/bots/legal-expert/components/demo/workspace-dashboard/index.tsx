'use client';

import React, { useState, useEffect } from 'react';
import { UploadedFile, LawyerProfile } from '../types';
import { FILE_CATEGORIES } from '../constants';
import { ViewMode, Message, CategoryWithFiles, formatTotalSize, getAIResponse } from './utils';
import { OverviewView, FilesView, ChatView, TimelineView, SettingsView } from './views';

interface WorkspaceDashboardProps {
  files: UploadedFile[];
  lawyer: LawyerProfile;
  caseDescription: string;
  onClose: () => void;
  onFileUpload: (files: UploadedFile[]) => void;
  onFileDelete: (fileId: string) => void;
  onFileVisibilityChange: (fileId: string, visibility: string) => void;
}

const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  files,
  lawyer,
  caseDescription,
  onClose,
  onFileUpload,
  onFileDelete,
  onFileVisibilityChange
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Entrance animation
  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 50);
  }, []);

  // Initial welcome messages
  useEffect(() => {
    const welcomeMessages: Message[] = [
      {
        id: '1',
        sender: 'ai',
        senderName: 'Lex AI',
        avatar: '🤖',
        content: `Welcome to your secure data room! I've analyzed your case and organized ${files.length} files. How can I help you today?`,
        timestamp: new Date()
      },
      {
        id: '2',
        sender: 'lawyer',
        senderName: lawyer.username,
        avatar: lawyer.avatar,
        content: `Hi! I'm ${lawyer.username}, your assigned attorney. I've reviewed your case and I'm here to assist. Feel free to ask me anything.`,
        timestamp: new Date()
      }
    ];
    setMessages(welcomeMessages);
  }, [lawyer, files.length]);

  // File categories with counts
  const categoriesWithFiles: CategoryWithFiles[] = FILE_CATEGORIES.map(cat => ({
    ...cat,
    files: files.filter(f => f.category === cat.id),
    count: files.filter(f => f.category === cat.id).length
  })).filter(cat => cat.count > 0);

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadedFile[] = droppedFiles.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: file.name,
      type: file.type,
      size: file.size,
      category: 'other',
      status: 'uploading' as const,
      visibility: 'private'
    }));

    // Simulate upload
    newFiles.forEach((file, idx) => {
      setTimeout(() => {
        file.status = 'completed';
        onFileUpload([file]);
      }, 1000 * (idx + 1));
    });
  };

  // Send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      avatar: '👤',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        senderName: 'Lex AI',
        avatar: '🤖',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  const navItems = [
    { id: 'overview' as ViewMode, icon: '🏠', label: 'Overview' },
    { id: 'files' as ViewMode, icon: '📁', label: 'Files', badge: files.length },
    { id: 'chat' as ViewMode, icon: '💬', label: 'Chat', badge: messages.length },
    { id: 'timeline' as ViewMode, icon: '📅', label: 'Timeline' },
    { id: 'settings' as ViewMode, icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-700 ${
        showAnimation ? 'opacity-100' : 'opacity-0'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Header */}
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
                  <p className="text-xs text-slate-400">Private Data Room - End-to-End Encrypted</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)] flex">
        {/* Sidebar Navigation */}
        <aside className="w-20 lg:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700 flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
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
                {item.badge !== undefined && (
                  <span className="hidden lg:block ml-auto bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
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

        {/* Main View */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {viewMode === 'overview' && (
            <OverviewView
              files={files}
              categoriesWithFiles={categoriesWithFiles}
              caseDescription={caseDescription}
              setViewMode={setViewMode}
            />
          )}

          {viewMode === 'files' && (
            <FilesView
              categoriesWithFiles={categoriesWithFiles}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              onFileDelete={onFileDelete}
              onFileVisibilityChange={onFileVisibilityChange}
            />
          )}

          {viewMode === 'chat' && (
            <ChatView
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              isTyping={isTyping}
              lawyer={lawyer}
            />
          )}

          {viewMode === 'timeline' && (
            <TimelineView files={files} messages={messages} />
          )}

          {viewMode === 'settings' && (
            <SettingsView lawyer={lawyer} />
          )}
        </main>
      </div>

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center z-50 border-4 border-dashed border-blue-400">
          <div className="text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-2xl font-bold text-white">Drop files to upload</p>
            <p className="text-slate-300 mt-2">Files will be automatically categorized</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDashboard;
