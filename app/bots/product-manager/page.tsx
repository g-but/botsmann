'use client';

import { BotPageTemplate, BotSection, DemoSection, BotHeroSection } from '@/components/shared';
import { getBotHeroConfig } from '@/data/botHeroConfigs';
import './styles.css';

import FeaturesSection from './components/features/FeaturesSection';
import BenefitsSection from './components/benefits/BenefitsSection';
import ExampleSection from './components/examples/ExampleSection';
import ShowcaseSection from './components/showcase/ShowcaseSection';
import IntegrationSection from './components/integration/IntegrationSection';
import DevelopmentRoadmap from './components/roadmap/DevelopmentRoadmap';
import VisionSection from './components/vision/VisionSection';
import JoinSection from './components/join/JoinSection';

export default function ProductManager() {
  const heroConfig = getBotHeroConfig('product-manager');

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BotPageTemplate botSlug="product-manager" botDisplayName="Trident">
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

            <BotSection id="features">
              <FeaturesSection />
            </BotSection>

            <BotSection id="examples">
              <ExampleSection />
            </BotSection>

            <BotSection id="showcase">
              <ShowcaseSection />
            </BotSection>

            <BotSection id="demo">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-3">Try Trident Now</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Experience how Trident can help optimize your product workflow. Describe your
                    needs and get AI-powered recommendations.
                  </p>
                </div>
                <DemoSection botSlug="product-manager" />
              </div>
            </BotSection>

            <BotSection id="integrations">
              <IntegrationSection />
            </BotSection>

            <BotSection id="benefits">
              <BenefitsSection />
            </BotSection>

            <BotSection id="roadmap">
              <DevelopmentRoadmap />
            </BotSection>

            <BotSection id="vision">
              <VisionSection />
            </BotSection>

            <BotSection id="join" isLast>
              <JoinSection />
            </BotSection>

            {/* Final CTA */}
            <section className="mt-16 mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Optimize Your Cursor Workflow?
              </h2>
              <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                Let Trident manage your product documentation and development process, optimized
                specifically for Cursor&apos;s implementation needs.
              </p>
              <button
                onClick={scrollToDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg inline-flex items-center"
              >
                <span>Start Using Trident</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5l7 7-7 7M5 12h15"
                  />
                </svg>
              </button>
            </section>
          </>
        );
      }}
    </BotPageTemplate>
  );
}
