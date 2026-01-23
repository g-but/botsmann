'use client';

import { useState, type ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

/**
 * Code block component with syntax highlighting and copy button
 */
export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract text content from children
  const getCodeText = (): string => {
    if (typeof children === 'string') return children;
    if (typeof children === 'object' && children !== null) {
      // Handle pre > code structure from MDX
      const child = children as { props?: { children?: string } };
      if (child.props?.children) {
        return typeof child.props.children === 'string'
          ? child.props.children
          : String(child.props.children);
      }
    }
    return String(children);
  };

  const handleCopy = async () => {
    const code = getCodeText();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {filename && <span className="text-xs text-gray-400 font-mono">{filename}</span>}
          {language && !filename && (
            <span className="text-xs text-gray-500 uppercase">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre
          className={`p-4 text-sm text-gray-100 font-mono ${
            showLineNumbers ? 'pl-12 relative' : ''
          }`}
        >
          {showLineNumbers && (
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-800/50 flex flex-col items-end pr-2 pt-4 text-gray-500 text-xs select-none">
              {getCodeText()
                .split('\n')
                .map((_, i) => (
                  <span key={i} className="leading-6">
                    {i + 1}
                  </span>
                ))}
            </div>
          )}
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}

function CopyIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
