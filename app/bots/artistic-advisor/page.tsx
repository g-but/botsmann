'use client';

import React from 'react';
import { getBotBySlug, getBotTryLink } from '@/data/bots';
import BotNavigation from '../BotNavigation';
import { BotSection, BotNotFoundFallback } from '@/components/shared';

export default function ArtisticAdvisor() {
  const bot = getBotBySlug('artistic-advisor');
  const tryLink = getBotTryLink(bot);

  if (!bot || !bot.nav) {
    return <BotNotFoundFallback botName="Muse" />;
  }

  const { nav } = bot;

  return (
    <div className="min-h-screen bg-white">
      <BotNavigation
        botTitle={nav.navTitle}
        botEmoji={nav.emoji}
        botDescription={nav.navDescription}
        accentColor={nav.accentColor}
        menuItems={nav.menuItems}
        chatLink={tryLink}
      />

      <main className="mx-auto max-w-screen-xl px-6 pt-24">
        {/* Title and Overview */}
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">
            {nav.navTitle}
          </h1>
          <p className="mb-8 text-lg text-gray-600">{bot.overview}</p>
        </div>

        {/* Features Section */}
        <BotSection id="features">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Features
              </h2>
              <ul className="space-y-4">
                {bot.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="mr-3 h-5 w-5 flex-shrink-0 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="how-it-works"
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm scroll-mt-24"
            >
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                How It Works
              </h2>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Describe your artistic vision
                    </h3>
                    <p className="text-gray-600">
                      Share details about your creative project or style
                      preferences.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">AI Analysis</h3>
                    <p className="text-gray-600">
                      Our AI processes your input using art knowledge and
                      creative principles.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Get Creative Insights
                    </h3>
                    <p className="text-gray-600">
                      Receive tailored advice, inspiration, and techniques for
                      your artistic endeavors.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </BotSection>

        {/* Style Analysis Tool */}
        <BotSection id="style-analysis">
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">
            Analyze Your Style
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="mb-4 text-gray-600">
              Describe your artistic work or upload an image for style analysis.
            </p>

            <div className="mb-6">
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                rows={4}
                placeholder="Example: I create abstract landscapes using bold colors and geometric shapes..."
              />
            </div>

            <div className="flex justify-center">
              <button className="rounded-md bg-amber-500 px-6 py-3 text-white hover:bg-opacity-90 transition-opacity">
                Analyze Style
              </button>
            </div>
          </div>
        </BotSection>

        {/* Art Styles Exploration */}
        <BotSection id="art-styles">
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">
            Explore Art Styles
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                style: 'Impressionism',
                description:
                  'Characterized by small, thin brush strokes and emphasis on light and movement.',
              },
              {
                style: 'Cubism',
                description:
                  'Objects are analyzed, broken up and reassembled in an abstracted form.',
              },
              {
                style: 'Surrealism',
                description:
                  'Juxtaposition of uncommon imagery to activate the unconscious mind.',
              },
            ].map((artStyle, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-48 bg-gray-200">
                  <div className="h-full w-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-600">{artStyle.style}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-medium text-gray-900">
                    {artStyle.style}
                  </h3>
                  <p className="text-gray-600">{artStyle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </BotSection>

        {/* Creative Prompt Generator */}
        <BotSection id="prompt-generator">
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">
            Creative Prompt Generator
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="mb-4 text-gray-600">
              Get a random creative prompt to inspire your next project.
            </p>

            <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-lg text-center italic text-gray-700">
                "Create a piece that represents the feeling of nostalgia using
                only three colors."
              </p>
            </div>

            <div className="flex justify-center">
              <button className="rounded-md bg-amber-500 px-6 py-3 text-white hover:bg-opacity-90 transition-opacity">
                Generate New Prompt
              </button>
            </div>
          </div>
        </BotSection>

        {/* CTA Section */}
        <BotSection id="get-started" isLast>
          <div className="rounded-xl bg-gray-50 p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Unlock your creative potential with our AI-powered artistic
              advisor.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href={tryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-amber-500 px-6 py-3 text-lg font-medium text-white hover:bg-opacity-90 transition-opacity"
              >
                Try {nav.navTitle} Now
              </a>
              <button className="rounded-md border-2 border-amber-500 px-6 py-3 text-lg font-medium text-amber-500 hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </BotSection>
      </main>
    </div>
  );
}
