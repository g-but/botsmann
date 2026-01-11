'use client';

import React, { useEffect, useRef } from 'react';
import { getBotBySlug, getBotTryLink } from '@/data/bots';
import BotNavigation from '../BotNavigation';
import { BotSection, BotNotFoundFallback } from '@/components/shared';

import HeroSection from './components/hero/HeroSection';
import LanguageLearningSection from './components/language-learning/LanguageLearningSection';
import CommunicationSection from './components/communication/CommunicationSection';
import SocialSection from './components/social/SocialSection';
import SwissContentSection from './components/content/SwissContentSection';
import FutureVisionSection from './components/future/FutureVisionSection';
import WaitlistForm from './components/shared/WaitlistForm';

export default function SwissGermanTeacher() {
  const bot = getBotBySlug('swiss-german-teacher');
  const tryLink = getBotTryLink(bot);
  const hasScrolledToTop = useRef(false);

  // Handle scroll to section if hash is present in URL
  useEffect(() => {
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
  }, []);

  if (!bot || !bot.nav) {
    return <BotNotFoundFallback botName="Heidi" />;
  }

  const { nav } = bot;

  return (
    <div className="min-h-screen bg-white">
      <BotNavigation
        botTitle={nav.navTitle}
        botEmoji={nav.emoji}
        botDescription={nav.navDescription}
        accentColor={nav.accentColor}
        menuItems={nav.menuItems}
        chatLink={tryLink}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <HeroSection getTryLink={() => tryLink} />

        <BotSection id="language-learning">
          <LanguageLearningSection getTryLink={() => tryLink} />
        </BotSection>

        <BotSection id="communication">
          <CommunicationSection getTryLink={() => tryLink} />
        </BotSection>

        <BotSection id="integration">
          <SocialSection getTryLink={() => tryLink} />
        </BotSection>

        <BotSection id="swiss-content">
          <SwissContentSection />
        </BotSection>

        <BotSection id="future">
          <FutureVisionSection />
        </BotSection>

        <BotSection id="waitlist" isLast>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold text-gray-900 text-center mb-2">
                Join Our Beta Program
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Be one of the first to experience our upcoming features and help
                shape the future of Swiss German learning.
              </p>
              <WaitlistForm />
            </div>
          </div>
        </BotSection>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                className="h-8 w-8 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              <span className="ml-2 font-bold text-xl text-gray-900">
                {nav.navTitle}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a
                href="mailto:hello@botsmann.com"
                className="text-gray-500 hover:text-gray-700"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© 2023 Botsmann. All rights reserved.</p>
            <p className="mt-1">
              "{nav.navTitle}" is an AI GPT powered by OpenAI's technology. Not
              affiliated with the Swiss government or any official language
              institution.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
