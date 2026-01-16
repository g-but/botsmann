'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { Logo } from './shared';
import { isBotDetailPage } from '@/lib/routes';

/**
 * Main site header component
 * Contains logo and navigation
 *
 * Note: Header is hidden on bot detail pages for immersive experience
 */
export function Header() {
  const pathname = usePathname();

  if (isBotDetailPage(pathname)) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-100/50 shadow-sm">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <div className="flex items-center">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}
