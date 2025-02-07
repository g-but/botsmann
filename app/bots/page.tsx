import Link from 'next/link';
import bots, { Bot } from '../../data/bots';

export default function BotsList() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6">Our AI Bots</h1>
      <ul>
        {bots.map((bot: Bot) => (
          <li key={bot.slug} className="mb-4 p-4 border rounded shadow">
            <h2 className="text-2xl">{bot.title}</h2>
            <p>{bot.description}</p>
            <Link href={`/bots/${bot.slug}`} className="text-blue-500 hover:underline">
              Read More
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 