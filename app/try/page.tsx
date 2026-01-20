'use client';

import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';

interface UploadedDocument {
  id: string;
  name: string;
  content: string;
  size: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    document_name: string;
    preview: string;
  }>;
}

export default function TryPage() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const newDocs: UploadedDocument[] = [];

    for (const file of Array.from(files)) {
      try {
        // Check file type
        const validTypes = ['text/plain', 'text/markdown', 'application/pdf'];
        const validExtensions = ['.txt', '.md', '.pdf'];
        const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

        if (!validTypes.includes(file.type) && !hasValidExtension) {
          setError(`Invalid file type: ${file.name}. Please upload TXT, MD, or PDF files.`);
          continue;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File too large: ${file.name}. Maximum size is 5MB.`);
          continue;
        }

        let content = '';

        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          // For PDFs, we'd need a PDF parser - for now, show a message
          setError('PDF support coming soon. Please upload TXT or MD files for now.');
          continue;
        } else {
          // Read text content
          content = await file.text();
        }

        if (content.trim().length === 0) {
          setError(`File is empty: ${file.name}`);
          continue;
        }

        newDocs.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          content,
          size: file.size,
        });
      } catch (err) {
        console.error('Error reading file:', err);
        setError(`Failed to read file: ${file.name}`);
      }
    }

    if (newDocs.length > 0) {
      setDocuments(prev => [...prev, ...newDocs]);
      setSuccess(`Uploaded ${newDocs.length} document${newDocs.length > 1 ? 's' : ''}. You can now ask questions!`);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || documents.length === 0) return;

    const message = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/demo/document-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          documents: documents.map(doc => ({
            name: doc.name,
            content: doc.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.data.response,
            sources: data.data.sources,
          },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error || 'Something went wrong'}` },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Failed to get response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Botsmann
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chat With Your Documents
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload any text document and ask questions about it. No account required.
            Your documents stay in your browser - nothing is stored on our servers.
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl max-w-4xl mx-auto">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl max-w-4xl mx-auto">
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Documents Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Documents</h2>

              {/* Upload Area */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,text/plain,text/markdown"
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    uploading
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">Drop files or click to upload</span>
                      <span className="text-xs text-gray-400 mt-1">TXT, MD (max 5MB)</span>
                    </>
                  )}
                </label>
              </div>

              {/* Document List */}
              {documents.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No documents yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {documents.length > 0 && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  {documents.length} document{documents.length > 1 ? 's' : ''} loaded
                </p>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-lg font-bold text-gray-900">Chat</h2>
                <p className="text-sm text-gray-600">Ask questions about your documents</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {documents.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-center">
                    <div>
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">Upload a document to get started</p>
                      <p className="text-sm">Once you upload a document, you can ask questions about its content.</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-center">
                    <div>
                      <svg className="w-16 h-16 mx-auto mb-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">Ready to answer your questions!</p>
                      <p className="text-sm">Ask anything about your uploaded documents.</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => setInput('What is this document about?')}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          What is this document about?
                        </button>
                        <button
                          onClick={() => setInput('Summarize the key points')}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Summarize the key points
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200/30">
                            <p className="text-xs opacity-70 mb-1">Sources:</p>
                            {msg.sources.map((source, j) => (
                              <p key={j} className="text-xs opacity-70">
                                {source.document_name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-500">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleChat} className="p-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={documents.length === 0 ? "Upload a document first..." : "Ask a question about your documents..."}
                    disabled={isLoading || documents.length === 0}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || documents.length === 0}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Upload one or more text documents (TXT or Markdown)</li>
              <li>Ask questions about the content in natural language</li>
              <li>Get AI-powered answers based on your documents</li>
            </ol>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>Privacy:</strong> Your documents are processed in your browser and sent directly to the AI.
                Nothing is stored on our servers. For persistent storage and advanced features,{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                  create a free account
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
