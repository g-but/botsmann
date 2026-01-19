'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

/**
 * Email Verification Banner
 *
 * Shows a banner prompting unverified users to verify their email.
 * Only renders if user is logged in but email is not verified.
 */
export function EmailVerificationBanner() {
  const { user, loading, isEmailVerified } = useAuth();

  // Don't show if loading, not logged in, or already verified
  if (loading || !user || isEmailVerified) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-100">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-amber-800">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm">
              Please verify your email address to access all features.
            </span>
          </div>
          <Link
            href={ROUTES.AUTH.VERIFY_EMAIL}
            className="text-sm font-medium text-amber-800 hover:text-amber-900 underline whitespace-nowrap"
          >
            Verify now
          </Link>
        </div>
      </div>
    </div>
  );
}
