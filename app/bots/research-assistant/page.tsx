'use client';

import { BotPageTemplate, BotSection } from '@/components/shared';
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

const WAITLIST_LINK = 'https://nerd.ai/waitlist';

export default function ResearchAssistant() {
  return (
    <BotPageTemplate
      botSlug="research-assistant"
      botDisplayName="Nerd"
      overrideTryLink={WAITLIST_LINK}
    >
      {({ bot }) => (
        <>
          <HeroSection
            title={bot.nav!.navTitle}
            overview="Your AI companion for organized research, real-time updates, and groundbreaking discoveries"
            getTryLink={() => WAITLIST_LINK}
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
            <QuestionsSection getTryLink={() => WAITLIST_LINK} />
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
        </>
      )}
    </BotPageTemplate>
  );
}
