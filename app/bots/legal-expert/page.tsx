'use client';

import { BotPageTemplate, BotSection } from '@/components/shared';
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
  return (
    <BotPageTemplate botSlug="legal-expert" botDisplayName="Lex">
      {({ bot, tryLink }) => (
        <>
          <HeroSection
            title={bot.nav!.navTitle}
            overview={bot.overview}
            getTryLink={() => tryLink}
          />

          <BotSection id="disclaimer">
            <DisclaimerSection />
          </BotSection>

          <BotSection id="demo">
            <DemoOrchestrator />
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
      )}
    </BotPageTemplate>
  );
}
