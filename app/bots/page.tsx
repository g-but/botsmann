import { Bot } from '../../data/bots';
import bots from '../../data/bots';
import Link from 'next/link';

export default function BotsList() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">Our AI Bots</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => (
          <Link 
            key={bot.slug} 
            href={`/bots/${bot.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold text-gray-900">{bot.title}</h2>
            <p className="mb-4 text-gray-600">{bot.description}</p>
            <span className="text-sm font-medium text-openai-green group-hover:underline">
              Learn more →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
