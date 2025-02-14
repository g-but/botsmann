import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const botsDir = path.join(process.cwd(), 'content', 'bots');
  const botFiles = fs.readdirSync(botsDir);
  return botFiles.map(file => ({
    id: file.replace('.json', ''),
  }));
}

export default function BotPage() {
  return null;
}
