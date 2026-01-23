import { UploadedFile } from '../types';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatTotalSize(files: UploadedFile[]): string {
  const total = files.reduce((acc, f) => acc + f.size, 0);
  return formatFileSize(total);
}

export function getAIResponse(message: string): string {
  const responses: Record<string, string> = {
    'help': 'I can help you with document analysis, legal research, deadline tracking, and more. What do you need?',
    'file': 'I\'ve analyzed all your files and organized them into categories. Would you like me to explain any specific document?',
    'deadline': 'Based on your case, I\'ve identified several important deadlines. Would you like me to set up reminders?',
    'default': 'I understand your question. Let me analyze your case files and provide you with a detailed answer. Your lawyer will also be notified if this requires expert legal advice.'
  };

  const lowerMsg = message.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMsg.includes(key)) return response;
  }
  return responses.default;
}

export type ViewMode = 'overview' | 'files' | 'chat' | 'timeline' | 'settings';

export interface Message {
  id: string;
  sender: string;
  senderName: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

export interface CategoryWithFiles {
  id: string;
  title: string;
  icon: string;
  count: number;
  files: UploadedFile[];
}
