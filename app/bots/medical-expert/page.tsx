import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { BotPage } from '@/src/components/bots/BotPage';

async function getBot() {
  try {
    const botPath = path.join(process.cwd(), 'content', 'bots', 'medical-expert.json');
    const content = fs.readFileSync(botPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

export default async function MedicalExpert() {
  const bot = await getBot();
  
  if (!bot) {
    notFound();
  }

  const steps = [
    {
      title: "Research Analysis",
      description: "Access and analyze the latest medical research.",
      image: "/medical/step1.png"
    },
    {
      title: "Case Review",
      description: "Get AI-powered insights on complex cases.",
      image: "/medical/step2.png"
    },
    {
      title: "Evidence-Based Decisions",
      description: "Make informed decisions with comprehensive data.",
      image: "/medical/step3.png"
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
