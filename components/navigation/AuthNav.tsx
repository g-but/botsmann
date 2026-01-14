'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

/**
 * Authentication navigation component
 * Shows login/register for guests, profile dropdown for authenticated users
 */
export function AuthNav() {
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  // Guest state - show login/register
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          Register
        </Link>
      </div>
    );
  }

  // Authenticated state - show profile dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
          {user.email?.[0].toUpperCase() || 'U'}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          </div>
          <Link
            href="/documents"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setDropdownOpen(false)}
          >
            My Documents
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setDropdownOpen(false)}
          >
            Settings
          </Link>
          <hr className="my-1 border-gray-100" />
          <button
            onClick={() => {
              signOut();
              setDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
