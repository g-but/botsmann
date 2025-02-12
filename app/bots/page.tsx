import React from 'react';
import Link from 'next/link';

const bots = [
  {
    title: 'Swiss German Teacher',
    description: 'AI-powered language tutor specializing in Swiss German dialects and cultural nuances.',
    href: '/bots/swiss-german-teacher'
  },
  {
    title: 'Medical Expert',
    description: 'AI assistant for medical practices, providing preliminary assessments and instant access to medical knowledge.',
    href: '/bots/medical-expert'
  },
  {
    title: 'Legal Expert',
    description: 'Get instant legal insights and document analysis powered by advanced AI technology.',
    href: '/bots/legal-expert'
  },
  {
    title: 'Artistic Advisor',
    description: 'AI-powered creative assistant helping with artistic decisions and style exploration.',
    href: '/bots/artistic-advisor'
  },
  {
    title: 'Auto Shopper',
    description: 'Automate your shopping experience with AI-powered price comparison and smart purchasing decisions.',
    href: '/bots/auto-shopper'
  }
];

export default function BotsList() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-screen-xl px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">AI Assistants</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Our specialized chatbots and AI assistants help automate specific tasks and provide expert guidance 
            across various domains, from language learning to professional services. These compact, focused bots 
            excel at their specific tasks while maintaining simplicity and ease of use.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {bots.map((bot) => (
            <Link
              key={bot.title}
              href={bot.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="p-8">
                <h2 className="mb-3 text-2xl font-semibold text-gray-900">{bot.title}</h2>
                <p className="text-gray-600">{bot.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-openai-green">
                  Learn more
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
