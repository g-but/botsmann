import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { BotPage } from '@/src/components/bots/BotPage';
import { notFound } from 'next/navigation';

async function getBot() {
  try {
    const botPath = path.join(process.cwd(), 'content', 'bots', 'swiss-german-teacher.json');
    const content = fs.readFileSync(botPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

export default async function SwissGermanTeacher() {
  const bot = await getBot();

  if (!bot) {
    notFound();
  }

  const steps = [
    {
      title: "Start Learning",
      description: "Begin with basic phrases and greetings in Swiss German.",
      image: "/swiss-german/step1.png"
    },
    {
      title: "Practice Conversations",
      description: "Engage in interactive dialogues with our AI tutor.",
      image: "/swiss-german/step2.png"
    },
    {
      title: "Master Dialects",
      description: "Learn regional variations and authentic pronunciations.",
      image: "/swiss-german/step3.png"
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
