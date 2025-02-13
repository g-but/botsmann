import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { BotPage } from '@/src/components/bots/BotPage';

async function getBot() {
  try {
    const botPath = path.join(process.cwd(), 'content', 'bots', 'legal-expert.json');
    const content = fs.readFileSync(botPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

export default async function LegalExpert() {
  const bot = await getBot();
  
  if (!bot) {
    notFound();
  }

  const steps = [
    {
      title: "Legal Research",
      description: "Search through case law and statutes efficiently.",
      image: "/legal/step1.png"
    },
    {
      title: "Document Analysis",
      description: "AI-powered review of legal documents.",
      image: "/legal/step2.png"
    },
    {
      title: "Compliance Check",
      description: "Stay updated with regulatory requirements.",
      image: "/legal/step3.png"
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
