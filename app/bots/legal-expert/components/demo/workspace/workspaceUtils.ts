import { type UploadedFile } from '../types';
import { formatBytes } from '@/lib/format';

// Re-export for backwards compatibility
export const formatFileSize = formatBytes;

/**
 * Calculate and format total size of files
 */
export function formatTotalSize(files: UploadedFile[]): string {
  const total = files.reduce((acc, f) => acc + f.size, 0);
  return formatFileSize(total);
}

/**
 * Get AI response based on message content
 */
export function getAIResponse(message: string): string {
  const responses: Record<string, string> = {
    help: 'I can help you with document analysis, legal research, deadline tracking, and more. What do you need?',
    file: "I've analyzed all your files and organized them into categories. Would you like me to explain any specific document?",
    deadline:
      "Based on your case, I've identified several important deadlines. Would you like me to set up reminders?",
    default:
      'I understand your question. Let me analyze your case files and provide you with a detailed answer. Your lawyer will also be notified if this requires expert legal advice.',
  };

  const lowerMsg = message.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMsg.includes(key)) return response;
  }
  return responses.default;
}
