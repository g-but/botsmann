'use client';

import { BotPageTemplate, BotSection, DemoSection, BotHeroSection } from '@/components/shared';
import { getBotHeroConfig } from '@/data/botHeroConfigs';
import './styles.css';

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
  const heroConfig = getBotHeroConfig('research-assistant');

  return (
    <BotPageTemplate
      botSlug="research-assistant"
      botDisplayName="Nerd"
      overrideTryLink={WAITLIST_LINK}
    >
      {({ bot }) => {
        const config = heroConfig
          ? {
              ...heroConfig,
              primaryCTA: { ...heroConfig.primaryCTA, href: WAITLIST_LINK },
            }
          : null;

        return (
          <>
            {config && <BotHeroSection config={config} accentColor={bot.nav!.accentColor} />}

            <BotSection id="demo">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-3">Try Nerd Now</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Experience how Nerd can help with your research. Share your topic and get
                    AI-powered analysis and insights.
                  </p>
                </div>
                <DemoSection botSlug="research-assistant" />
              </div>
            </BotSection>

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
        );
      }}
    </BotPageTemplate>
  );
}
