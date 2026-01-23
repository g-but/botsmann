'use client';

import React, { useState, useEffect } from 'react';
import {
  type UploadedFile,
  type LawyerProfile,
  type ChatMessage,
  type CategoryWithFiles,
  type WorkspaceViewMode,
} from './types';
import { FILE_CATEGORIES } from './constants';
import {
  WorkspaceHeader,
  WorkspaceSidebar,
  OverviewView,
  FilesView,
  ChatView,
  TimelineView,
  SettingsView,
  getAIResponse,
} from './workspace';

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
  onFileVisibilityChange,
}) => {
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>('overview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Entrance animation
  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 50);
  }, []);

  // Initial welcome messages
  useEffect(() => {
    const welcomeMessages: ChatMessage[] = [
      {
        id: '1',
        sender: 'ai',
        senderName: 'Lex AI',
        avatar: '🤖',
        content: `Welcome to your secure data room! I've analyzed your case and organized ${files.length} files. How can I help you today?`,
        timestamp: new Date(),
      },
      {
        id: '2',
        sender: 'lawyer',
        senderName: lawyer.username,
        avatar: lawyer.avatar,
        content: `Hi! I'm ${lawyer.username}, your assigned attorney. I've reviewed your case and I'm here to assist. Feel free to ask me anything.`,
        timestamp: new Date(),
      },
    ];
    setMessages(welcomeMessages);
  }, [lawyer, files.length]);

  // File categories with counts
  const categoriesWithFiles: CategoryWithFiles[] = FILE_CATEGORIES.map((cat) => ({
    ...cat,
    files: files.filter((f) => f.category === cat.id),
    count: files.filter((f) => f.category === cat.id).length,
  })).filter((cat) => cat.count > 0);

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
      visibility: 'private',
    }));

    // Simulate upload
    newFiles.forEach((file, idx) => {
      setTimeout(
        () => {
          file.status = 'completed';
          onFileUpload([file]);
        },
        1000 * (idx + 1),
      );
    });
  };

  // Send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      avatar: '👤',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        senderName: 'Lex AI',
        avatar: '🤖',
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 2000);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-700 ${
        showAnimation ? 'opacity-100' : 'opacity-0'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <WorkspaceHeader lawyer={lawyer} onClose={onClose} />

      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)] flex">
        <WorkspaceSidebar
          viewMode={viewMode}
          setViewMode={setViewMode}
          files={files}
          messages={messages}
        />

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

          {viewMode === 'timeline' && <TimelineView files={files} messages={messages} />}

          {viewMode === 'settings' && <SettingsView lawyer={lawyer} />}
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
