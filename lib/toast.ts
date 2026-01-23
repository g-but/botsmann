/**
 * Toast Notification Helpers
 * @module lib/toast
 *
 * Centralized toast functions using sonner.
 * Import these helpers instead of using toast directly for consistency.
 */

import { toast } from 'sonner';

/**
 * Show a success toast
 */
export const showSuccess = (message: string, description?: string) => {
  toast.success(message, { description });
};

/**
 * Show an error toast
 */
export const showError = (message: string, description?: string) => {
  toast.error(message, { description });
};

/**
 * Show an info toast
 */
export const showInfo = (message: string, description?: string) => {
  toast.info(message, { description });
};

/**
 * Show a warning toast
 */
export const showWarning = (message: string, description?: string) => {
  toast.warning(message, { description });
};

/**
 * Show a loading toast that can be updated
 */
export const showLoading = (message: string) => {
  return toast.loading(message);
};

/**
 * Dismiss a specific toast by ID
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

/**
 * Show a promise toast that updates based on promise state
 */
export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
) => {
  return toast.promise(promise, messages);
};

/**
 * Document-specific toast messages
 */
export const documentToasts = {
  uploadSuccess: (fileName: string) =>
    showSuccess(`Uploaded "${fileName}"`, 'Click "Process" to enable search.'),
  uploadError: (error?: string) => showError('Upload failed', error || 'Please try again.'),
  processSuccess: (chunks: number) =>
    showSuccess('Document processed', `${chunks} chunks created and indexed.`),
  processError: (error?: string) => showError('Processing failed', error || 'Please try again.'),
  deleteSuccess: () => showSuccess('Document deleted'),
  deleteError: (error?: string) => showError('Delete failed', error || 'Please try again.'),
  addToBotSuccess: (botTitle: string, chunks: number) =>
    showSuccess(`Added to "${botTitle}"`, `${chunks} knowledge chunks imported.`),
  addToBotError: (error?: string) =>
    showError('Failed to add to bot', error || 'Please try again.'),
};

/**
 * Conversation-specific toast messages
 */
export const conversationToasts = {
  createSuccess: () => showSuccess('New conversation started'),
  createError: (error?: string) => showError('Failed to create conversation', error),
  deleteSuccess: () => showSuccess('Conversation deleted'),
  deleteError: (error?: string) => showError('Failed to delete conversation', error),
  loadError: (error?: string) => showError('Failed to load conversation', error),
};

/**
 * Bot-specific toast messages
 */
export const botToasts = {
  createSuccess: (title: string) => showSuccess('Bot created', `"${title}" is ready to use.`),
  createError: (error?: string) => showError('Failed to create bot', error),
  updateSuccess: () => showSuccess('Bot updated'),
  updateError: (error?: string) => showError('Failed to update bot', error),
  deleteSuccess: () => showSuccess('Bot deleted'),
  deleteError: (error?: string) => showError('Failed to delete bot', error),
  publishSuccess: () => showSuccess('Bot published'),
  unpublishSuccess: () => showSuccess('Bot unpublished'),
  importSuccess: (count: number) =>
    showSuccess('Knowledge imported', `${count} chunks added to bot.`),
  importError: (error?: string) => showError('Failed to import knowledge', error),
};

/**
 * Settings-specific toast messages
 */
export const settingsToasts = {
  saveSuccess: () => showSuccess('Settings saved'),
  saveError: (error?: string) => showError('Failed to save settings', error),
  keyValidSuccess: () => showSuccess('API key is valid'),
  keyValidError: (error?: string) => showError('Invalid API key', error),
};
