'use client';

import { BotPageTemplate, BotSection, DemoSection, BotHeroSection } from '@/components/shared';
import { getBotHeroConfig } from '@/data/botHeroConfigs';
import './styles.css';

import DisclaimerSection from './components/disclaimer/DisclaimerSection';
import PatientFeaturesSection from './components/patient/PatientFeaturesSection';
import HealthcareProfessionalsSection from './components/professionals/HealthcareProfessionalsSection';
import HealthEducationSection from './components/education/HealthEducationSection';
import FutureProductsSection from './components/future/FutureProductsSection';
import VisionAndJoinSection from './components/vision/VisionAndJoinSection';

export default function MedicalExpert() {
  const heroConfig = getBotHeroConfig('medical-expert');

  return (
    <BotPageTemplate botSlug="medical-expert" botDisplayName="Imhotep">
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

            <DisclaimerSection />

            <BotSection id="demo">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-3">Try Imhotep Now</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Experience how Imhotep can help you understand health information. Share your
                    questions and get evidence-based insights.
                  </p>
                </div>
                <DemoSection botSlug="medical-expert" />
              </div>
            </BotSection>

            <BotSection id="patient-features">
              <PatientFeaturesSection features={bot.features} getTryLink={() => tryLink} />
            </BotSection>

            <BotSection id="for-professionals">
              <HealthcareProfessionalsSection />
            </BotSection>

            <BotSection id="health-education">
              <HealthEducationSection getTryLink={() => tryLink} />
            </BotSection>

            <BotSection id="coming-soon">
              <FutureProductsSection />
            </BotSection>

            <BotSection id="vision-and-join" isLast>
              <VisionAndJoinSection />
            </BotSection>
          </>
        );
      }}
    </BotPageTemplate>
  );
}
