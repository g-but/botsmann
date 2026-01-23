'use client';

import { BotPageTemplate, BotSection, DemoSection, BotHeroSection } from '@/components/shared';
import { getBotHeroConfig } from '@/data/botHeroConfigs';

import LanguageLearningSection from './components/language-learning/LanguageLearningSection';
import CommunicationSection from './components/communication/CommunicationSection';
import SocialSection from './components/social/SocialSection';
import SwissContentSection from './components/content/SwissContentSection';
import FutureVisionSection from './components/future/FutureVisionSection';

export default function SwissGermanTeacher() {
  const heroConfig = getBotHeroConfig('swiss-german-teacher');

  return (
    <BotPageTemplate
      botSlug="swiss-german-teacher"
      botDisplayName="Heidi"
      enableHashScrolling
      showFooter
    >
      {({ bot, tryLink }) => {
        const config = heroConfig
          ? {
              ...heroConfig,
              primaryCTA: { ...heroConfig.primaryCTA, href: tryLink },
            }
          : null;

        return (
          <>
            {config && <BotHeroSection config={config} accentColor={bot.nav!.accentColor} />}

            {/* Demo Section - Interactive AI Chat */}
            <BotSection id="demo">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-3">Try Heidi Now</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Experience how Heidi can help you learn Swiss German. Tell us about your
                    learning goals and start chatting!
                  </p>
                </div>
                <DemoSection botSlug="swiss-german-teacher" />
              </div>
            </BotSection>

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

            <BotSection id="future" isLast>
              <FutureVisionSection />
            </BotSection>
          </>
        );
      }}
    </BotPageTemplate>
  );
}
