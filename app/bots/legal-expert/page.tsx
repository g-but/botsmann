'use client';

import React from 'react';
import { getBotBySlug, getBotTryLink } from '@/data/bots';
import BotNavigation from '../BotNavigation';
import { BotNotFoundFallback } from '@/components/shared';
import './styles.css';

import HeroSection from './components/hero/HeroSection';
import DisclaimerSection from './components/disclaimer/DisclaimerSection';
import DemoOrchestrator from './components/demo/DemoOrchestrator';
import FeaturesSection from './components/features/FeaturesSection';
import TestimonialsSection from './components/testimonials/TestimonialsSection';
import VisionSection from './components/vision/VisionSection';
import TechSection from './components/tech/TechSection';
import CallToActionSection from './components/cta/CallToActionSection';

export default function LegalExpert() {
  const bot = getBotBySlug('legal-expert');
  const tryLink = getBotTryLink(bot);

  if (!bot || !bot.nav) {
    return <BotNotFoundFallback botName="Lex" />;
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

      <main className="mx-auto max-w-screen-xl px-6 pt-24">
        <HeroSection title={nav.navTitle} overview={bot.overview} getTryLink={() => tryLink} />
        <DisclaimerSection />
        <DemoOrchestrator />
        <FeaturesSection />
        <TestimonialsSection />
        <VisionSection />
        <TechSection />
        <CallToActionSection getTryLink={() => tryLink} />
      </main>
    </div>
  );
}
