'use client';

import React from 'react';
import Link from 'next/link';

const solutions = [
  {
    title: 'Venture Credit Workflow',
    description: 'Enterprise-grade automation for venture credit operations. Automatically ingest and analyze portfolio company reports, monitor debt metrics, and make data-driven decisions with AI-powered insights.',
    href: '/solutions/venture-credit'
  }
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-screen-xl px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">Enterprise Solutions</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Transform your business operations with our enterprise-grade automation solutions. 
            Unlike our focused chatbots, these comprehensive platforms handle complex workflows 
            and integrate deeply with your existing systems.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {solutions.map((solution) => (
            <Link
              key={solution.title}
              href={solution.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="p-8">
                <h2 className="mb-3 text-2xl font-semibold text-gray-900">{solution.title}</h2>
                <p className="text-gray-600">{solution.description}</p>
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
