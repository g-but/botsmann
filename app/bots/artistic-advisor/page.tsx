import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { BotPage } from '@/src/components/bots/BotPage';

async function getBot() {
  try {
    const botPath = path.join(process.cwd(), 'content', 'bots', 'artistic-advisor.json');
    const content = fs.readFileSync(botPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

export default async function ArtisticAdvisor() {
  const bot = await getBot();
  
  if (!bot) {
    notFound();
  }

  const steps = [
    {
      title: "Style Analysis",
      description: "Understand different artistic styles and techniques.",
      image: "/art/step1.png"
    },
    {
      title: "Composition Guidance",
      description: "Get feedback on composition and layout.",
      image: "/art/step2.png"
    },
    {
      title: "Color Theory",
      description: "Expert guidance on color combinations.",
      image: "/art/step3.png"
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
