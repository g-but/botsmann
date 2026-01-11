'use client';

import React from 'react';
import { getBotBySlug, getBotTryLink } from '@/data/bots';
import BotNavigation from '../BotNavigation';
import { BotSection, BotNotFoundFallback } from '@/components/shared';
import './styles.css';

import HeroSection from './components/hero/HeroSection';
import DisclaimerSection from './components/disclaimer/DisclaimerSection';
import PatientFeaturesSection from './components/patient/PatientFeaturesSection';
import HealthcareProfessionalsSection from './components/professionals/HealthcareProfessionalsSection';
import HealthEducationSection from './components/education/HealthEducationSection';
import FutureProductsSection from './components/future/FutureProductsSection';
import VisionAndJoinSection from './components/vision/VisionAndJoinSection';

export default function MedicalExpert() {
  const bot = getBotBySlug('medical-expert');
  const tryLink = getBotTryLink(bot);

  if (!bot || !bot.nav) {
    return <BotNotFoundFallback botName="Imhotep" />;
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
      </main>
    </div>
  );
}
