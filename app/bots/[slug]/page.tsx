import { notFound } from 'next/navigation';
import { Bot } from '../../../data/bots';
import bots from '../../../data/bots';

export default function BotPage({ params }: { params: { slug: string } }) {
  const bot = bots.find((bot) => bot.slug === params.slug);
  
  if (!bot) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <h1 className="mb-6 text-4xl font-semibold tracking-tight">{bot.title}</h1>
      <p className="mb-8 text-lg text-gray-600">{bot.description}</p>
      <div className="mb-12" dangerouslySetInnerHTML={{ __html: bot.overview }} />
      <div>
        <h3 className="mb-4 text-2xl font-semibold">Features</h3>
        <ul className="grid gap-3">
          {bot.features.map((feature) => (
            <li key={feature} className="flex items-start">
              <span className="mr-2 text-openai-green">•</span>
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-gray-600">{bot.details}</p>
      </div>
    </div>
  );
}
