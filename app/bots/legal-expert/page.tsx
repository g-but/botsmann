'use client';

import { BotPageTemplate, BotSection, DemoSection, BotHeroSection } from '@/components/shared';
import { getBotHeroConfig } from '@/data/botHeroConfigs';
import './styles.css';

import DisclaimerSection from './components/disclaimer/DisclaimerSection';
import FeaturesSection from './components/features/FeaturesSection';
import TestimonialsSection from './components/testimonials/TestimonialsSection';
import VisionSection from './components/vision/VisionSection';
import TechSection from './components/tech/TechSection';
import CallToActionSection from './components/cta/CallToActionSection';

export default function LegalExpert() {
  const heroConfig = getBotHeroConfig('legal-expert');

  return (
    <BotPageTemplate botSlug="legal-expert" botDisplayName="Lex">
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

            <BotSection id="disclaimer">
              <DisclaimerSection />
            </BotSection>

            <BotSection id="demo">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-3">Try Lex Now</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Experience how Lex can help analyze your legal situation. Describe your case and
                    get AI-powered insights.
                  </p>
                </div>
                <DemoSection botSlug="legal-expert" />
              </div>
            </BotSection>

            <BotSection id="features">
              <FeaturesSection />
            </BotSection>

            <BotSection id="testimonials">
              <TestimonialsSection />
            </BotSection>

            <BotSection id="vision">
              <VisionSection />
            </BotSection>

            <BotSection id="tech">
              <TechSection />
            </BotSection>

            <BotSection id="cta" isLast>
              <CallToActionSection getTryLink={() => tryLink} />
            </BotSection>
          </>
        );
      }}
    </BotPageTemplate>
  );
}
