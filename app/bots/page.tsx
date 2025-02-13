import React from 'react';
import Link from 'next/link';
import { Bot } from '@/src/types/bot';
import { allBots } from 'contentlayer/generated';

async function getBots(): Promise<Bot[]> {
  return allBots;
}

export default async function BotsList() {
  const bots = await getBots();
  
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">Our AI Bots</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => (
          <Link 
            key={bot.id} 
            href={bot.path}
            className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">{bot.title}</h2>
              <p className="mb-4 text-gray-600 min-h-[3rem]">{bot.description}</p>
            </div>
            <span className="text-sm font-medium text-openai-green group-hover:underline mt-auto">
              Learn more →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
