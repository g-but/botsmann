'use client';

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/auth';
import { PageLoading, InlineLoading, LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { DocumentStatusBadge } from '@/components/shared/DocumentStatusBadge';
import { DOCUMENT_STATUS } from '@/lib/constants';
import type { Document } from '@/types/document';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    document_name: string;
    preview: string;
  }[];
}

/**
 * My Data Page
 * Manage uploaded documents and personalizations for AI Professionals
 */
export default function MyDataPage() {
  const { user, loading: authLoading, signOut } = useRequireAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load documents
  useEffect(() => {
    if (!user) return;

    const loadDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        const data = await response.json();
        if (data.success) {
          setDocuments(data.documents || []);
        }
      } catch {
        // Failed to load documents - showing empty state
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setDocuments((prev) => [data.document, ...prev]);
        setSuccess(`Uploaded "${file.name}". Click "Process" to enable search.`);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleProcess = async (documentId: string) => {
    setProcessing(documentId);
    setError('');

    try {
      const response = await fetch('/api/documents/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });

      const data = await response.json();

      if (data.success) {
        setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? data.document : doc)));
        setSuccess(`Processed successfully! ${data.chunks_created} chunks created.`);
      } else {
        setError(data.error || 'Processing failed');
        const listResponse = await fetch('/api/documents');
        const listData = await listResponse.json();
        if (listData.success) {
          setDocuments(listData.documents || []);
        }
      }
    } catch (err) {
      setError('Failed to process document');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        setSuccess('Document deleted');
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const handleChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const message = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: message }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          documentId: selectedDocId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            sources: data.sources,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error}` },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Failed to get response. Please try again.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (authLoading || !user) {
    return <PageLoading />;
  }

  const readyDocuments = (documents || []).filter((d) => d.status === DOCUMENT_STATUS.READY);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header with User Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Data</h1>
            <p className="text-gray-600">
              Manage your documents and personalize your AI Professionals
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/professionals" className="text-sm text-blue-600 hover:text-blue-700">
              AI Professionals
            </Link>
            <Link href="/settings" className="text-sm text-gray-500 hover:text-gray-700">
              Settings
            </Link>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-red-600">
              Sign Out
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-green-800">Your data is private</p>
            <p className="text-sm text-green-700">
              Documents are encrypted and only accessible to you. We never use your data to train AI
              models.
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload Document
              </>
            )}
          </label>
        </div>

        {/* Status Messages */}
        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents List */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Documents</h2>

            {loading ? (
              <InlineLoading />
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>No documents yet</p>
                <p className="text-sm mt-1">
                  Upload documents to personalize your AI Professionals
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg ${
                      selectedDocId === doc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                          <DocumentStatusBadge status={doc.status} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatFileSize(doc.size_bytes || 0)}
                          {doc.chunk_count ? ` • ${doc.chunk_count} chunks` : ''}
                        </p>
                        {doc.error_message && (
                          <p className="text-sm text-red-500 mt-1">{doc.error_message}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {doc.status === DOCUMENT_STATUS.PENDING && (
                          <button
                            onClick={() => handleProcess(doc.id)}
                            disabled={processing === doc.id}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                          >
                            {processing === doc.id ? 'Processing...' : 'Process'}
                          </button>
                        )}
                        {doc.status === DOCUMENT_STATUS.READY && (
                          <button
                            onClick={() =>
                              setSelectedDocId(selectedDocId === doc.id ? null : doc.id)
                            }
                            className={`px-3 py-1 text-sm rounded ${
                              selectedDocId === doc.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {selectedDocId === doc.id ? 'Selected' : 'Select'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Test Your Knowledge Base</h2>
              {selectedDocId && (
                <span className="text-sm text-blue-600">
                  Filtering: {documents.find((d) => d.id === selectedDocId)?.name}
                </span>
              )}
            </div>

            {readyDocuments.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-center">
                <div>
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p>Upload and process documents to start testing</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px] max-h-[400px]">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Test your knowledge base with a question</p>
                      <p className="text-sm mt-1">
                        {selectedDocId
                          ? 'Searching in selected document only'
                          : 'Searching across all your documents'}
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg ${
                          msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
                        }`}
                      >
                        <p className="text-gray-900 whitespace-pre-wrap">{msg.content}</p>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Sources:</p>
                            {msg.sources.map((source, j) => (
                              <div key={j} className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">{source.document_name}</span>
                                {source.preview && (
                                  <span className="text-gray-400"> - {source.preview}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="bg-gray-100 p-4 rounded-lg mr-8">
                      <div className="flex items-center gap-2 text-gray-500">
                        <LoadingSpinner size="sm" className="border-gray-600" />
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={chatLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">
            How to personalize your AI Professionals
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Upload your documents (contracts, medical records, research papers, etc.)</li>
            <li>Click "Process" to extract and index the content securely</li>
            <li>Your AI Professionals will use this knowledge to provide personalized guidance</li>
          </ol>
          <div className="mt-4">
            <Link
              href="/professionals"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Talk to an AI Professional
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
