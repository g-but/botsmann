'use client';

import { type FC, type ReactNode, useEffect, useRef } from 'react';
import { getBotBySlug, getBotTryLink, type Bot } from '@/data/bots';
import BotNavigation from '@/app/bots/BotNavigation';
import { BotNotFoundFallback } from './BotNotFoundFallback';

interface BotPageTemplateProps {
  /** The bot slug to load from data/bots.ts */
  botSlug: string;
  /** Display name for fallback if bot not found */
  botDisplayName: string;
  /** The main content of the page */
  children: (props: BotPageRenderProps) => ReactNode;
  /** Optional: Override the try/chat link */
  overrideTryLink?: string;
  /** Optional: Custom CSS file imported by the page */
  className?: string;
  /** Optional: Include scroll-to-hash behavior */
  enableHashScrolling?: boolean;
  /** Optional: Include footer */
  showFooter?: boolean;
}

export interface BotPageRenderProps {
  bot: Bot;
  /** The try link if available, or '#waitlist' as fallback for bots without GPTs */
  tryLink: string;
  /** Whether the bot has an actual external try link */
  hasExternalLink: boolean;
}

/**
 * Template wrapper for bot detail pages
 * Handles common patterns: bot lookup, fallback, navigation, and layout
 *
 * @example
 * ```tsx
 * export default function MyBotPage() {
 *   return (
 *     <BotPageTemplate botSlug="my-bot" botDisplayName="MyBot">
 *       {({ bot, tryLink }) => (
 *         <>
 *           <HeroSection getTryLink={() => tryLink} />
 *           <BotSection id="features">
 *             <FeaturesSection />
 *           </BotSection>
 *         </>
 *       )}
 *     </BotPageTemplate>
 *   );
 * }
 * ```
 */
export const BotPageTemplate: FC<BotPageTemplateProps> = ({
  botSlug,
  botDisplayName,
  children,
  overrideTryLink,
  className = '',
  enableHashScrolling = false,
  showFooter = false,
}) => {
  const bot = getBotBySlug(botSlug);
  const rawTryLink = overrideTryLink ?? getBotTryLink(bot);
  const hasExternalLink = Boolean(rawTryLink);
  // Provide fallback for components that need a string
  const tryLink = rawTryLink || '#waitlist';
  const hasScrolledToTop = useRef(false);

  // Handle scroll to section if hash is present in URL
  useEffect(() => {
    if (!enableHashScrolling) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else if (!hasScrolledToTop.current) {
        window.scrollTo(0, 0);
        hasScrolledToTop.current = true;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [enableHashScrolling]);

  // Return fallback if bot or nav config not found
  if (!bot || !bot.nav) {
    return <BotNotFoundFallback botName={botDisplayName} />;
  }

  const { nav } = bot;

  return (
    <div className={`min-h-screen bg-white ${className}`.trim()}>
      <BotNavigation
        botSlug={bot.slug}
        botTitle={nav.navTitle}
        botEmoji={nav.emoji}
        botDescription={nav.navDescription}
        accentColor={nav.accentColor}
        menuItems={nav.menuItems}
        chatLink={tryLink}
      />

      <main className="mx-auto max-w-screen-xl px-6 pt-24">
        {children({ bot, tryLink, hasExternalLink })}
      </main>

      {showFooter && (
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-2xl mr-2">{nav.emoji}</span>
                <span className="font-bold text-xl text-gray-900">{nav.navTitle}</span>
              </div>

              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </a>
                <a href="mailto:hello@botsmann.com" className="text-gray-500 hover:text-gray-700">
                  Contact Us
                </a>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Botsmann. All rights reserved.</p>
              <p className="mt-1">
                &quot;{nav.navTitle}&quot; is an AI GPT powered by OpenAI&apos;s technology.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
