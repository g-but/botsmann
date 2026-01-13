'use client';

import { BotPageTemplate, BotSection } from '@/components/shared';
import './styles.css';

import HeroSection from './components/hero/HeroSection';
import DisclaimerSection from './components/disclaimer/DisclaimerSection';
import PatientFeaturesSection from './components/patient/PatientFeaturesSection';
import HealthcareProfessionalsSection from './components/professionals/HealthcareProfessionalsSection';
import HealthEducationSection from './components/education/HealthEducationSection';
import FutureProductsSection from './components/future/FutureProductsSection';
import VisionAndJoinSection from './components/vision/VisionAndJoinSection';

export default function MedicalExpert() {
  return (
    <BotPageTemplate botSlug="medical-expert" botDisplayName="Imhotep">
      {({ bot, tryLink }) => (
        <>
          <HeroSection
            title={bot.nav!.navTitle}
            overview="Your AI health companion for evidence-based wellness"
            getTryLink={() => tryLink}
          />

          <DisclaimerSection />

          <BotSection id="patient-features">
            <PatientFeaturesSection
              features={bot.features}
              getTryLink={() => tryLink}
            />
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
      )}
    </BotPageTemplate>
  );
}
