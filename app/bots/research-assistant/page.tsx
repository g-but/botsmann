'use client';

import React from 'react';
import { getBotBySlug, getBotTryLink } from '@/data/bots';
import BotNavigation from '../BotNavigation';
import { BotSection, BotNotFoundFallback } from '@/components/shared';
import './styles.css';

import HeroSection from './components/hero/HeroSection';
import FeaturesSection from './components/features/FeaturesSection';
import ResearchSystemSection from './components/features/ResearchSystemSection';
import WebScrapingSection from './components/features/WebScrapingSection';
import DraftGenerationSection from './components/features/DraftGenerationSection';
import QuestionsSection from './components/questions/QuestionsSection';
import DiscoverySection from './components/discovery/DiscoverySection';
import IntegrationSection from './components/integration/IntegrationSection';
import DevelopmentRoadmap from './components/integration/DevelopmentRoadmap';

export default function ResearchAssistant() {
  const bot = getBotBySlug('research-assistant');
  const tryLink = getBotTryLink(bot);
  const waitlistLink = 'https://nerd.ai/waitlist';

  if (!bot || !bot.nav) {
    return <BotNotFoundFallback botName="Nerd" />;
  }

  const { nav } = bot;

  return (
    <div className="min-h-screen bg-white">
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
        <HeroSection
          title={nav.navTitle}
          overview="Your AI companion for organized research, real-time updates, and groundbreaking discoveries"
          getTryLink={() => waitlistLink}
        />

        <BotSection id="core-features" className="mt-16">
          <FeaturesSection features={bot.features || []} />
        </BotSection>

        <BotSection id="research-system">
          <ResearchSystemSection />
        </BotSection>

        <BotSection id="web-scraping">
          <WebScrapingSection />
        </BotSection>

        <BotSection id="draft-generation">
          <DraftGenerationSection />
        </BotSection>

        <BotSection id="daily-questions">
          <QuestionsSection getTryLink={() => waitlistLink} />
        </BotSection>

        <BotSection id="discovery-mode">
          <DiscoverySection />
        </BotSection>

        <BotSection id="integration">
          <IntegrationSection />
        </BotSection>

        <BotSection id="roadmap" isLast>
          <DevelopmentRoadmap />
        </BotSection>
      </main>
    </div>
  );
}
