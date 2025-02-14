import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { BotPage } from '@/src/components/bots/BotPage';

async function getBot() {
  try {
    const botPath = path.join(process.cwd(), 'content', 'bots', 'gov-spending-tracker.json');
    const content = fs.readFileSync(botPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

export default async function GovSpendingTracker() {
  const bot = await getBot();
  
  if (!bot) {
    notFound();
  }

  const steps = [
    {
      title: "Track Transactions",
      description: "Monitor government spending in real-time.",
      image: "/gov/step1.png"
    },
    {
      title: "Analyze Data",
      description: "Get insights into spending patterns.",
      image: "/gov/step2.png"
    },
    {
      title: "Engage Citizens",
      description: "Enable public participation and feedback.",
      image: "/gov/step3.png"
    }
  ];

  return (
    <BotPage
      title={bot.title}
      overview={bot.overview}
      features={bot.features}
      howItWorks={steps}
    />
  );
}
