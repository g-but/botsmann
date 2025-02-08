import { Bot } from '../data/bots';
import bots from '../data/bots';
import Link from 'next/link';

export default function BotsList() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6">Our AI Bots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bots.map((bot) => (
          <div key={bot.slug} className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-3">{bot.title}</h2>
            <p className="text-gray-600 mb-4">{bot.description}</p>
            <Link 
              href={`/bots/${bot.slug}`}
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
